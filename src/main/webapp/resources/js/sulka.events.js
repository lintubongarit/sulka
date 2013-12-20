sulka.events = function (events) {
events = {
	/**
     * Check if row is editable
     * 
     * @param e Event
     * @param args Data that is related to the event.
     * @return True if row is editable, otherwise false.
     */
    onBeforeEditCell: function (e, args){
        if (args.item && args.item.rowStatus === "inputRow") {
            return true;
        }
        return false;
    },
    
	/**
	 * Used to overwrite default edit navigation and editing. Returns an event
	 * handler function.
	 */
	makeOnKeyDown: function() {
		// This is the set of keys that should not cause cell editing to begin
		var ignoreKeys = {};
		for (var key in $.ui.keyCode) {
			ignoreKeys[$.ui.keyCode[key]] = true;
		}
		delete ignoreKeys[$.ui.keyCode.BACKSPACE];
		delete ignoreKeys[$.ui.keyCode.DELETE];
		
		$.extend(ignoreKeys, {
			16: true, //SHIFT
			18: true, //ALT
			20: true, //CAPS_LOCK
			91: true, //WIN_KEY
			225: true //ALT_GR
		});
		for (var i=112; i<=123; i++) { //F_KEYS
			ignoreKeys[i] = true;
		}
		
		return function (e) {
			if (e.ctrlKey) return;
			
			if (e.which === $.ui.keyCode.ENTER) {
				if (sulka.grid.getCellEditor() !== null) {
					sulka.grid.navigateRight();
				}
				sulka.grid.editActiveCell();
				sulka.helpers.cancelEvent(e);
			} else if (e.which === $.ui.keyCode.TAB) {
				var editing = sulka.grid.getCellEditor() !== null;
				if (e.shiftKey) {
					sulka.grid.navigateLeft();
				} else {
					sulka.grid.navigateRight();
				}
				if (editing) {
					sulka.grid.editActiveCell();
				}
				sulka.helpers.cancelEvent(e);
			}else if (e.which === $.ui.keyCode.DELETE){
				var data = sulka.getData();
				var activeField = sulka.grid.getColumns()[sulka.grid.getActiveCell().cell].field
				delete data[sulka.grid.getActiveCell().row][activeField]
				var activeRowData = sulka.getData()[sulka.grid.getActiveCell().row];
				sulka.submitSulkaDBRow(activeRowData);
				sulka.setData(data);
				sulka.grid.navigateRight();
			} else if (!ignoreKeys.hasOwnProperty(e.which) && sulka.grid.getCellEditor() === null) {
				// Show editor if user starts typing in a cell
				sulka.grid.editActiveCell();
			}
		};
	},
	
	/**
	 * Called upon double click. Sets clicked cell editable.
	 */
	onDblClick: function() {
		if (sulka.grid.getCellEditor() === null) {
			sulka.grid.editActiveCell();
		}
	},

	/**
	 * When cell is changed, this function is called.
	 * uses submitSulkaDBRow() to add row to SulkaDB
	 */
	onCellChange: function(event, args) {
		if (args.row >= 0) {
			sulka.previousActiveRowEdited = true;
			var row = sulka.getData()[args.row];
			sulka.submitSulkaDBRow(row);
		}

		if (sulka.grid.getSelectedRows()[0] === sulka.getData().length - 1){
			sulka.setData(sulka.getData().concat({rowStatus: "inputRow"}));
		}
	},
	
	/**
	 * This function is called when active cell is changed.
	 * If active row is changed and previous active row was edited, this 
	 * function validates previous active row.
	 * 
	 * Validation adds these fields to the row:
	 * 	$valid: true, is row is valid, false if not
	 * 
	 *  //these are added only if $valid is false
	 *  $errors: array which contains fields that are invalid. Example: ["species", "municipalities"]
	 *  $invalid_msg: error msg to be displayed when invalid row is clicked
	 */
	onActiveCellChanged: function (e, args) {
		sulka.statusBar.clearGridValidationError();
		
		var newRow = sulka.getData()[args.row];
		if (newRow && newRow.$invalid_msg) {
			sulka.statusBar.setValidationServiceError(newRow.$invalid_msg);
		} else {
			sulka.statusBar.clearValidationServiceError();
		}
		
		if (sulka.previousActiveRow !== undefined
				&& sulka.grid.getSelectedRows()[0] !== sulka.previousActiveRow
				&& sulka.previousActiveRowEdited ){
			var previousRow = sulka.getData()[sulka.previousActiveRow];

			if (!previousRow) {
				return;
			}
			
			sulka.statusBar.unsetErrorAndShowLoader();
			sulka.API.validate(
				sulka.formatters.formatRowOut(previousRow),
				function (data) {
					previousRow.$valid = !!data.passes;
					if (data.passes) {
						delete previousRow.$invalid_msg;
						delete previousRow.$errors;
					} else {
						var serializeErrors = [];
						var errorStrings = []; 
						for (var errorField in data.errors) if (data.errors.hasOwnProperty(errorField)) {
							var errorArray = data.errors[errorField];
							var fieldName = sulka.fieldsByName.hasOwnProperty(errorField) ? 
									sulka.fieldsByName[errorField].name : 
									errorField;
							errorStrings.push(sulka.strings.fieldErrorString(fieldName, errorArray.map(function (error) { 
								return error.localizedErrorText; 
							})));
							serializeErrors.push(errorField);
						}
						previousRow.$errors = JSON.stringify(serializeErrors);
						previousRow.$invalid_msg = sulka.strings.validationFailed(errorStrings);
					}
					
					sulka.submitSulkaDBRow(previousRow);
					sulka.statusBar.hideLoaderAndUnsetError();
					sulka.setData(sulka.getData());
				}, function() {
					sulka.statusBar.hideLoaderAndSetError();
				}
			);
		}
		
		if (sulka.previousActiveRow !== sulka.grid.getSelectedRows()[0]) {
			sulka.previousActiveRowEdited = false;
		}
		
		sulka.previousActiveRow = sulka.grid.getSelectedRows()[0];
		
	},
	
	/**
	 * Update column width changes in visible columns to sulka.columns.
	 */
	updateWidthToSulkaColumns: function(e, args) {
		var gridInd = 0;
		var gridColumns = sulka.grid.getColumns();
		for(var i = 0; i < sulka.columns.length; i++){
			if(sulka.columns[i].$sulkaVisible && 
				sulka.columns[i].field == gridColumns[gridInd].field){
				sulka.columns[i].width = gridColumns[gridInd].width;
				gridInd++;
			}
		}
	},
	
	/**
	 * Update order changes in visible columns to sulka.columns.
	 */
	updateOrderToSulkaColumns: function(e, args) {
		var columnIndex = 0;
		var gridColumns = sulka.grid.getColumns();
		var updatedColumnList = {};
		for (var i = 0; i < sulka.columns.length; i++) {
			if (sulka.columns[i] && !sulka.columns[i].$sulkaVisible) {
				updatedColumnList[sulka.columns[i].field] = i;
			} else if (columnIndex < gridColumns.length) {
				updatedColumnList[gridColumns[columnIndex].field] = i;
				columnIndex++;
			}
		}
		var newColumns = [];
		for (var i=0; i < sulka.columns.length; i++) {
			newColumns[updatedColumnList[sulka.columns[i].field]] = sulka.columns[i];
		}
		
		sulka.columns = newColumns;
	},
	
	/**
	 *	Prevent the grid from cancelling drag'n'drop by default 
	 */
	onDragInit: function(e,dd) {
	    e.stopImmediatePropagation();
	},

	/**
	 * Called when drag event is started
	 */
	onDragStart: function(e,dd){
	    var cell = sulka.grid.getCellFromEvent(e);
	    if (!cell) {
	    	return;
	    }

	    dd.row = cell.row;
	    if (!sulka.getData()[dd.row]) {
	    	return;
	    }

	    if (Slick.GlobalEditorLock.isActive()) {
	    	return;
	    }

	    e.stopImmediatePropagation();
	    dd.mode = "recycle";

	    var selectedRows = sulka.grid.getSelectedRows();

	    if (!selectedRows.length || $.inArray(dd.row, selectedRows) == -1) {
	    	selectedRows = [dd.row];
	    	sulka.grid.setSelectedRows(selectedRows);
	    }

	    dd.rows = selectedRows;
	    dd.count = selectedRows.length;

	    var proxy = $("<span></span>")
	    	.css({
	    		position: "absolute",
	    		display: "inline-block",
	    		padding: "4px 10px",
	    		background: "#e0e0e0",
	    		border: "1px solid gray",
	    		"z-index": 99999,
	    		"border-radius": "8px",
	    		"box-shadow": "2px 2px 6px silver",
	    		"-moz-border-radius": "8px",
	    		"-moz-box-shadow": "2px 2px 6px silver",
	    		"-webkit-border-radius": "8px",
	    		"-webkit-box-shadow": "2px 2px 6px silver"
	    	})
	    	.text(sulka.strings.dragToDelete(dd.count))
	    	.appendTo("body");

		dd.helper = proxy;

		$(dd.available).css("background", "pink");

		return proxy;
	},
	
	/**
	 * onDrag events.
	 */
	onDrag: function(e,dd){
		if (dd.mode != "recycle") {
			return;
		}
		dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
	},
	
	
	/**
	 * onDragEnd: this function is called when dragging rows ends.
	 */
	onDragEnd: function(e, dd){
	    if (dd.mode != "recycle") {
	    	return;
	    }
	    dd.helper.remove();
	    $(dd.available).css("background", "beige");
	},
	

	/**
	 *  Called before MoveRows
	 */
	onBeforeMoveRows: function(e,data) {
	    for (var i = 0; i < data.rows.length; i++) {
		    // no point in moving before or after itself
		    if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
			    e.stopPropagation();
			    return false;
		    }
	    }
	    return true;
	},
	
	/**
	 * OnMoveRows events
	 */
	onMoveRows: function(e,args) {
	    var extractedRows = [], left, right;
	    var rows = args.rows;
	    var insertBefore = args.insertBefore;
	    left = data.slice(0, insertBefore);
	    right = data.slice(insertBefore, data.length);

	    rows.sort(function(a,b) { return a-b; });

	    for (var i = 0; i < rows.length; i++) {
	      extractedRows.push(data[rows[i]]);
	    }

	    rows.reverse();

	    for (var i = 0; i < rows.length; i++) {
	      var row = rows[i];
	      if (row < insertBefore) {
	        left.splice(row, 1);
	      } else {
	        right.splice(row - insertBefore, 1);
	      }
	    }

	    data = left.concat(extractedRows.concat(right));

	    var selectedRows = [];
	    for (var i = 0; i < rows.length; i++)
	      selectedRows.push(left.length + i);

	    sulka.grid.resetActiveCell();
	    sulka.grid.setData(data);
	    sulka.grid.setSelectedRows(selectedRows);
	    sulka.grid.render();
	},

	/**
	 * Called by SlickGrid when the grid needs to be sorted. 
	 */
	onGridSort: function (event, args) {
		sulka.freeze.removeSortMarkers();
		sulka.parseSort(args);
	},
	
	/**
	 * Parameters for mouse wheel events
	 */
	//viewport: null,
	MOUSE_WHEEL_ROW_HEIGHT: 25,
	MOUSE_WHEEL_SCROLL_ROWS: 3,
	
	/**
	 * Handle mouse wheel events.
	 */
	onMouseWheel: function (event, delta, deltaX, deltaY) {
		event.preventDefault();
		if (deltaY !== 0) {
			sulka.viewport.scrollTop(Math.max(0, sulka.viewport.scrollTop() - 
					deltaY*sulka.events.MOUSE_WHEEL_SCROLL_ROWS*sulka.events.MOUSE_WHEEL_ROW_HEIGHT));
		}
	},
	
	/**
	 * Adjust grid positioning and size after window resize. 
	 */
	resizeGrid: function () {
		setTimeout(function () {
			sulka.freeze.resize();
			
			var y = $("#local-toolbar").offset().top + $("#local-toolbar").outerHeight();
			var x = sulka.freeze.getWidth(); 
			var width = $(window).width() - x;
			
			$("#slick-grid").css({
				left: x + "px",
				top: y + "px",
				width: width + "px"
			});
			
			sulka.freeze.position(y);
			sulka.grid.resizeCanvas();
		}, 100);
	},
	
	/**
	 * Handler for the SlickGrid editor validation error.
	 */
	onValidationError: function (e, args) {
		if (args.validationResults) {
			if (!args.validationResults.valid) {
				if (args.validationResults.msg) {
					sulka.statusBar.setGridValidationError(args.validationResults.msg);
				}
			} else {
				sulka.statusBar.clearGridValidationError();
			}
		}
	},
	
	/**
	 * showColumnHeaderContextMenu layout adjustment constant value
	 */
	CONTEXT_HEIGHT_ADJUST: 6,
	
	/**
	 * Called by SlickGrid to show context menu on headers. 
	 */
	showColumnHeaderContextMenu: function (event, args) {
		event.preventDefault();
		
		var contextItem = undefined;
		
		var groupTarget = $(event.target).closest(".column-group-header");
		if (groupTarget.length > 0 && groupTarget.data("sulka.group.id")) {
			var groupId = groupTarget.data("sulka.group.id");
			if (sulka.contextMenuItemById.hasOwnProperty(groupId)) {
				contextItem = sulka.contextMenuItemById[groupId];
			}
		}
		
		if (args.column) {
			var colId = args.column.id; 
			if (sulka.contextMenuItemById.hasOwnProperty(colId)) {
				contextItem = sulka.contextMenuItemById[colId];
			}
		}
		
		if (contextItem === undefined) {
			return;
		}
		
		$("#header-context-menu")
			.find(".context-menu-item-selected")
			.removeClass("context-menu-item-selected");
		contextItem.addClass("context-menu-item-selected");
		
		var winWidth = $(window).width(),
			winHeight = $(window).height();
		
		var menuWidth = $("#header-context-menu").width();
		
		var x = Math.max(0, Math.min(winWidth - menuWidth, event.pageX)),
			y = Math.max(0, event.pageY);
		
		$("#header-context-menu")
			.css("left", x + "px")
			.css("top", y + "px")
			.height(winHeight - event.pageY - sulka.events.CONTEXT_HEIGHT_ADJUST)
			.show()
			.scrollTop(Math.max(0, $("#header-context-menu").scrollTop() + contextItem.position().top));
	
		$("body").one("click", function () {
			$("#header-context-menu").hide();
		});
	},
	
	/**
	 * Called when a context menu item is clicked.
	 */
	headerContextMenuItemClicked: function () {
		var column = $(this).data("column");
		if (column) {
			column.$sulkaVisible = !column.$sulkaVisible;
			var visibleCols = sulka.getVisibleColumns();
			if (visibleCols.length === 0) {
				// Refuse to hide all main grid columns
				column.$sulkaVisible = true;
				return;
			}
			sulka.setColumns(visibleCols, sulka.getVisibleColumns(true));
			sulka.renderColumnGroups();
			sulka.contextMenuItemById[column.id].find("span.context-menu-tick").text(
					column.$sulkaVisible ? sulka.TICK_MARK : "");
		}
	},
	
	/**
	 * Called when a context menu title is clicked.
	 */
	headerContextMenuTitleClicked: function () {
		var group = $(this).data("group");
		if (group && group.$columns) {
			var allHidden = group.$columns.every(function (column) { 
				return !column.$sulkaVisible; 
			});
			group.$columns.forEach(function (column) { 
				column.$sulkaVisible = allHidden; 
			});
			var visibleCols = sulka.getVisibleColumns();
			if (visibleCols.length === 0) {
				// Refuse to hide all main grid columns
				for (var i=0; i<group.$columns.length; i++) {
					if (group.$columns[i].$sulkaVisible && !sulka.freeze.isFrozen(group.$columns[i].id)) {
						group.$columns[i].$sulkaVisible = true;
						break;
					} 
				}
				visibleCols = sulka.getVisibleColumns();
			}
			sulka.setColumns(visibleCols, sulka.getVisibleColumns(true));
			sulka.renderColumnGroups();
			group.$columns.forEach(function (column) {
				sulka.contextMenuItemById[column.id].find("span.context-menu-tick").text(
						column.$sulkaVisible ? sulka.TICK_MARK : "");
			});
		}
	},
	
	/**
	 * Update selected row count to status bar on selection.
	 */
	onSelectedRowsChanged: function (event, data) {
		if (data.rows) {
			if (data.rows.length > 1) {
				sulka.statusBar.setSelectionInfo(sulka.strings.rowsSelected(data.rows.length));
				return;
			}
		}
		sulka.statusBar.clearSelectionInfo();
	}
};
return events;
}();