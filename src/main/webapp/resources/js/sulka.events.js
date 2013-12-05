sulka.events = function (events) {
events = {
	/**
     * OnBeforeEditCell
     * 
     * If row is not an inputRow, deny editing.
     * 
     */
    onBeforeEditCell: function (e, args){
        if (args.item && args.item.rowStatus === "inputRow") {
            return true;
        }
        return false;
    },
    
	/**
	 * Used to overwrite default edit navigation and editing. Returns an event handler function.
	 */
	makeOnKeyDown: function() {
		var specialCodes = {};
		for (var key in $.ui.keyCode) {
			specialCodes[$.ui.keyCode[key]] = true;
		}
		
		//these aren't in $ui.keyCode
		specialCodes[16] = true; //SHIFT
		specialCodes[17] = true; //CTRL
		specialCodes[18] = true; //ALT
		specialCodes[20] = true; //CAPS_LOCK
		specialCodes[91] = true; //WIN_KEY
		for (var i = 112; i <= 123; i++){ //F_KEYS
			specialCodes[i] = true;
		}
		specialCodes[225] = true; //ALT_GR
		
		delete specialCodes[$.ui.keyCode.BACKSPACE]; //backspace should work
		delete specialCodes[$.ui.keyCode.DELETE]; //delete should work
		
		return function (e) {
			if (e.which === $.ui.keyCode.ENTER) {
				if (sulka.grid.getCellEditor() !== null) {
					sulka.grid.navigateRight();
				}
				sulka.grid.editActiveCell();
				sulka.helpers.cancelEvent(e);
			} else if (!specialCodes.hasOwnProperty(e.which) && sulka.grid.getCellEditor() === null) {
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
	 * uses submitSulkaDBRow() to add row to sulka-database
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
	 * If active row is changed and previous active row was edited, this function validates previous active row.
	 * 
	 * Validation adds these fields to the row:
	 * 	$valid: true, is row is valid, false if not
	 * 
	 *  //these are added only if $valid is false
	 *  $errors: array which contains fields that are invalid. Example: ["species", "municipalities"]
	 *  $invalid_msg: error msg to be displayed when invalid row is clicked
	 */
	onActiveCellChanged: function (e, args) {
		if (sulka.previousActiveRow !== undefined
				&& sulka.grid.getSelectedRows()[0] !== sulka.previousActiveRow
				&& sulka.previousActiveRowEdited ){
			var data = sulka.getData();
			var actualRowData = data[sulka.previousActiveRow];

			if (!actualRowData) {
				return;
			}
			
			sulka.helpers.unsetErrorAndShowLoader();
			sulka.helpers.setValidationError(sulka.getData()[args.row].$invalid_msg);
			
			sulka.API.validate(
				sulka.formatRowOut(actualRowData),
				function (data) {
					actualRowData.$valid = data.passes;
					if (data.passes) {
						actualRowData.$invalid_msg = undefined;
						actualRowData.$errors = undefined;
					} else {
						actualRowData.$errors = [];
						var errorStrings = []; 
						for (var errorField in data.errors) if (data.errors.hasOwnProperty(errorField)) {
							var errorArray = data.errors[errorField];
							errorStrings.push(sulka.strings.fieldErrorString(errorField, errorArray.map(function (error) { 
								return error.localizedErrorText; 
							})));
							actualRowData.$errors.push(errorField);
						}
						actualRowData.$errors = JSON.stringify(actualRowData.$errors);
						actualRowData.$invalid_msg = sulka.strings.validationFailed(errorStrings);
					}
					
					sulka.submitSulkaDBRow(actualRowData);
					sulka.helpers.hideLoaderAndUnsetError();
					sulka.setData(sulka.getData());
				}, function() {
					sulka.helpers.hideLoaderAndSetError();
				}
			);
		}
		sulka.helpers.setValidationError(sulka.getData()[args.row].$invalid_msg);
		
		if (sulka.previousActiveRow !== sulka.grid.getSelectedRows()[0])
			sulka.previousActiveRowEdited = false;
		
		sulka.previousActiveRow = sulka.grid.getSelectedRows()[0];
		
	},
	
	/**
	 * onColumnResized updates column width changes to sulka.columns.
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
	 * onColumnsReorder updates order changes to sulka.columns.
	 */
	updateOrderToSulkaColumns: function(e, args) {
		var columnIndex = 0;
		var gridColumns = sulka.grid.getColumns();
		var updatedColumnList = {};
		for(var i = 0; i < sulka.columns.length; i++){
			if(!sulka.columns[i].$sulkaVisible)
				updatedColumnList[sulka.columns[i].field] = i;
			else
				if(columnIndex < gridColumns.length){
					updatedColumnList[gridColumns[columnIndex].field] = i;
					columnIndex++;
				}
		}
		var newColumns = [];
		for(var i = 0; i < sulka.columns.length; i++)
			newColumns[updatedColumnList[sulka.columns[i].field]] = sulka.columns[i];
		
		sulka.columns = newColumns;
	},
	
	/**
	 *	OnDragInit is used to prevent the grid from cancelling drag'n'drop by default 
	 */
	onDragInit: function(e,dd) {
	    // prevent the grid from cancelling drag'n'drop by default
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
		sulka.sort(args);
		sulka.colouriseCellsWithErrors(sulka.getData());
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
	}
};
return events;
}();