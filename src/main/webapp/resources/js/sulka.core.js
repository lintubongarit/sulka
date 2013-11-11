var sulka = function (sulka) {
/**
 * The main application container.
 */
sulka = {
	/**
	 * Reference to Slick Grid object
	 */
	grid: null,
	
	/**
	 * Slick grid options.
	 */
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: true,
	    editable: false,
	    enableAddRow: false,
	    asyncEditorLoading: false,
	    autoEdit: false
	},
	
	/**
	 * Base column options.
	 */
	columnOptions: {
		sortable: true,
		editable: true,
		$sulkaVisible: true,
	},

	viewMode: "browsing",
	rowsMode: "ringings",
	
	/**
	 * Called at start, when the document has fully loaded.
	 */
	init: function () {
		sulka.helpers.disableSelection($(".context-menu"));
		sulka.initEventHandlers();
		sulka.initColumns(); // Calls initGrid when done
	},

	/**
	 * Called at start to attach generic DOM event handlers
	 */
	initEventHandlers: function () {
		$("#filters").submit(function (event) {
			sulka.helpers.cancelEvent(event);
			sulka.reloadData();
		});
	},
	
	TICK_MARK: "✓",
	
	/**
	 * Stores context menu <li></li> elements by corresponding column ID.
	 */
	contextMenuItemById: {},
	
	/**
	 * Reference to current view's columns and fieldGroups.
	 */
	columns: null,
	fieldGroups: null,
	
	/**
	 * Get rendered text width.
	 */
	getRenderedTextWidth: function (text) {
		var width = $("#text-width-tester").text(text).width();
		$("#text-width-tester").text("");
		return width;
	},
	
	COL_PADDING: 20,
	COL_MAX_WIDTH: 200,
	/**
	 * Called at start to get columns. Calls initGrid() when done. 
	 */
	initColumns: function () {
		sulka.helpers.showLoader();
		
		// Get view fields
		sulka.API.fetchFieldGroups(
			sulka.viewMode,
			function (fieldGroups) {
				sulka.helpers.hideLoaderAndUnsetError();
				var columns = [];
				sulka.fieldGroups = fieldGroups;
				
				var $headerContextMenu = $("#header-context-menu");
				
				$.each(fieldGroups, function () {
					var group = this;
					
					var contextHeader = $("<li></li>")
						.addClass("context-menu-title")
						.text(group.description);
					sulka.contextMenuItemById[group.name] = contextHeader; 
					$headerContextMenu.append(contextHeader);
					
					$.each(this.fields, function () {
						var field = this;
						var id = group.name + "/" + field.field;
						
						var width;
						var isFlexible = false;
						if (field.enumerationValues) {
							isFlexible = false;
							width = sulka.COL_PADDING;
							$.each(field.enumerationValues, function () {
								var enumWidth = Math.min(
										sulka.COL_MAX_WIDTH, sulka.getRenderedTextWidth(this.value) + sulka.COL_PADDING);
								if (enumWidth > width) {
									width = enumWidth;
								}
							});
						} else {
							isFlexible = true;
							width = Math.min(
									sulka.COL_MAX_WIDTH, sulka.getRenderedTextWidth(field.name) + sulka.COL_PADDING);
						}
					
						var column = $.extend({
							id: id,
							field: field.field,
							name: field.name,
							toolTip: field.description,
							width: width,
							$sulkaGroup: group,
							// Flexible columns are resized on next data fetch
							$sulkaFlexible: isFlexible,
							editor: Slick.Editors.Text,
							$sulkaFlexible: isFlexible,
						}, sulka.columnOptions);
						columns.push(column);

						var contextItem = $("<li></li>")
							.addClass("context-menu-item")
							.append(
								$("<span></span>")
									.addClass("context-menu-tick")
									.text(sulka.TICK_MARK)
							)
							.append(
								$("<span></span>")
									.text(field.name)
							)
							.data("column", column);
						sulka.contextMenuItemById[id] = contextItem;
						$headerContextMenu.append(contextItem);
					});
				});
				sulka.columns = columns;
				sulka.initGrid();
			},
			sulka.helpers.hideLoaderAndSetError
		); 
	},
	
	/**
	 * Init grid. Called once at start after columns have been fetched.
	 */
	initGrid: function () {
		// We are now ready to actually initialize the grid
		sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);
		
		sulka.viewport = $("#slick-grid").find(".slick-viewport");
		
		sulka.grid.setSelectionModel(new Slick.CellSelectionModel());
		sulka.grid.setSelectionModel(new Slick.RowSelectionModel());
		
		//Subscribe setting saving
		sulka.grid.onColumnsReordered.subscribe(sulka.onColumnChange);
		sulka.grid.onColumnsResized.subscribe(sulka.onColumnChange);
		
		
		if (sulka.viewMode == ("ringings" || "recoveries")){
			sulka.moveRowsPlugin = 
				new Slick.RowMoveManager({   
					cancelEditOnDrag: true
				});
			
			sulka.grid.registerPlugin(sulka.moveRowsPlugin);
			
			//Row move, drag & drop features
			sulka.moveRowsPlugin.onBeforeMoveRows.subscribe(sulka.onBeforeMoveRows); 	  
			sulka.moveRowsPlugin.onMoveRows.subscribe(sulka.onMoveRows);
			sulka.grid.onDragInit.subscribe(sulka.grid.onDragInit);
			sulka.grid.onDragStart.subscribe(sulka.onDragStart);
			sulka.grid.onDrag.subscribe(sulka.onDrag);
			sulka.grid.onDragEnd.subscribe(sulka.onDragEnd);
			
			//Init drop events?
			sulka.initDrop();
		}
		
		
		sulka.grid.registerPlugin(new Slick.AutoTooltips());

	    // set keyboard focus on the grid
		$(sulka.grid.getCanvasNode()).focus();
		
		sulka.copyManager = new Slick.CellCopyManager();
		sulka.grid.registerPlugin(sulka.copyManager);
		
		
		sulka.grid.$columnGroups = new sulka.groups(sulka.grid, $("#slick-grid"));
		
		sulka.freeze.init();

		sulka.grid.onHeaderContextMenu.subscribe(sulka.showColumnHeaderContextMenu);
		$("#header-context-menu li.context-menu-item").click(sulka.headerContextMenuItemClicked);
		
		//sulka.grid.setSelectionModel(new Slick.RowSelectionModel());
		
		sulka.copyManager.onPasteCells.subscribe(sulka.onPasteCells);
		
		sulka.grid.onSort.subscribe(sulka.onGridSort);
		
		sulka.grid.onAddNewRow.subscribe(sulka.onAddNewRow);
		
		sulka.grid.onCellChange.subscribe(sulka.onCellChange);
		
		$(window).resize(sulka.resizeGrid);
		sulka.resizeGrid();
		
		$("#slick-grid").mousewheel(sulka.onMouseWheel);
		
		sulka.reloadData();
	},
	
	
	
	initDrop: function(){
		 $.drop({mode: "mouse"});
		  $("#dropzone")
		      .bind("dropstart", function (e, dd) {
		        if (dd.mode != "recycle") {
		          return;
		        }
		        $(this).css("background", "yellow");
		      })
		      .bind("dropend", function (e, dd) {
		        if (dd.mode != "recycle") {
		          return;
		        }
		        $(dd.available).css("background", "pink");
		      })
		      .bind("drop", function (e, dd) {
		        if (dd.mode != "recycle") {
		          return;
		        }
		        var data = sulka.grid.getData();
		        
		        var rowsToDelete = dd.rows.sort().reverse();
		        for (var i = 0; i < rowsToDelete.length; i++) {
		        	
		        	//Delete data from the database.
		        	sulka.deleteRow(data[rowsToDelete[i]]);
		        	
		        	//Delete data from the grid.
		        	data.splice(rowsToDelete[i], 1);
		        }
		        sulka.grid.invalidate();
	
		        sulka.grid.setSelectedRows([]);
		      });
	},
	
	deleteRow: function(data,args){
		console.log(JSON.stringify(data));
	    if (data.rowStatus == "inputRow"){
	 	    	var testObject = {};
	 	    	
		 	   	if(data.hasOwnProperty("databaseId")){
		    		testObject.id = data.id;
		    		testObject.userId = data.UserId;
		    	}
		 	   	else
		 	   	{
		 	   		return;
		 	   	}
	 	    	testObject.row = JSON.stringify(data);
	 	    	
	 	    	sulka.API.deleteSulkaDBRow(testObject);
	    }
	    
	},
	
	
	
	
	
	/**
	 * Adjust grid positioning and size after window resize. 
	 */
	resizeGrid: function () {
		setTimeout(function () {
			sulka.freeze.resize();
			
			var y = $("#row-status-box-container").offset().top + $("#row-status-box-container").outerHeight();
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
	
	viewport: null,
	
	MOUSE_WHEEL_ROW_HEIGHT: 25,
	MOUSE_WHEEL_SCROLL_ROWS: 3,
	/**
	 * Handle mouse wheel events.
	 */
	onMouseWheel: function (event, delta, deltaX, deltaY) {
		event.preventDefault();
		if (deltaY !== 0) {
			sulka.viewport.scrollTop(Math.max(0, sulka.viewport.scrollTop() - 
					deltaY*sulka.MOUSE_WHEEL_SCROLL_ROWS*sulka.MOUSE_WHEEL_ROW_HEIGHT));
		}
	},
	
	/**
	 * Return currently visible columns (even those not currently on grid)
	 */
	getVisibleColumns: function () {
		var visible = [];
		$.each(sulka.columns, function () {
			if (this.$sulkaVisible) {
				visible.push(this);
			}
		});
		return visible;
	},
	
	/**
	 * Called by SlickGrid when the grid needs to be sorted. 
	 */
	onGridSort: function (event, args) {
		sulka.freeze.removeSortMarkers();
		sulka.sort(args);
	},
	
	/**
	 * Sort grid by cols.
	 */
	sort: function (args) {
		var data = sulka.grid.getData();
	    
		var sign = args.sortAsc ? 1 : -1;
		var field = args.sortCol.field;
		data.sort(function (dataRow1, dataRow2) {
			var value1 = dataRow1[field], value2 = dataRow2[field];
			return (value1 == value2) ? 0 : (sign * (value1 > value2 ? 1 : -1));
		});
		sulka.grid.invalidate();
		sulka.freeze.invalidate();
	},
	
	
	
	onBeforeMoveRows: function(e,data) {
		sulka.moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
			    for (var i = 0; i < data.rows.length; i++) {
			      // no point in moving before or after itself
			      if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
			        e.stopPropagation();
			        return false;
			      }
		    }
			    return true;
		});
	},
	
	
	onMoveRows: function(e,args){
		sulka.moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
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
		  });
		
	},
	
	
	onDragInit: function(e,dd){
		sulka.grid.onDragInit.subscribe(function (e, dd) {
		    // prevent the grid from cancelling drag'n'drop by default
		    e.stopImmediatePropagation();
		  });
		
	},
	
	
	
	onDragStart: function(e,dd){
		sulka.grid.onDragStart.subscribe(function (e, dd) {
			
			var data = sulka.grid.getData();
			
		    var cell = sulka.grid.getCellFromEvent(e);
		    if (!cell) {
		      return;
		    }

		    dd.row = cell.row;
		    if (!data[dd.row]) {
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
		          "-moz-border-radius": "8px",
		          "-moz-box-shadow": "2px 2px 6px silver"
		        })
		        .text("Drag to Recycle Bin to delete " + dd.count + " selected row(s)")
		        .appendTo("body");

		    dd.helper = proxy;

		    $(dd.available).css("background", "pink");

		    return proxy;
		  });
		
	},
	
	onDrag: function(e,dd){
		  sulka.grid.onDrag.subscribe(function (e, dd) {
			    if (dd.mode != "recycle") {
			      return;
			    }
			    dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
			  });
	},
	
	
	onDragEnd: function(e, dd){
		sulka.grid.onDragEnd.subscribe(function (e, dd) {
		    if (dd.mode != "recycle") {
		        return;
		      }
		      dd.helper.remove();
		      $(dd.available).css("background", "beige");
		    });
	},
	
		
	
	onPasteCells: function(event, args){
		  sulka.copyManager.onPasteCells.subscribe(function (e, args) {
	      if (args.from.length !== 1 || args.to.length !== 1) {
	        throw "This implementation only supports single range copy and paste operations";
	      }
	      
	      
	      var data = sulka.grid.getData();
	      
	      var columns = sulka.grid.getColumns();
	      var from = args.from[0];
	      var to = args.to[0];
	      var val;
	      for (var i = 0; i <= from.toRow - from.fromRow; i++) {
	        for (var j = 0; j <= from.toCell - from.fromCell; j++) {
	          if (i <= to.toRow - to.fromRow && j <= to.toCell - to.fromCell) {
	            val = data[from.fromRow + i][columns[from.fromCell + j].field];
	            data[to.fromRow + i][columns[to.fromCell + j].field] = val;
	            sulka.grid.invalidateRow(to.fromRow + i);
	          }
	        }
	      }
	      sulka.grid.render();
	    });
	},
	
	CONTEXT_HEIGHT_ADJUST: 6,
	/**
	 * Called by SlickGrid to show context menu on headers. 
	 */
	showColumnHeaderContextMenu: function (event, args) {
		event.preventDefault();
		
		var contextItem = undefined; 
		if ($(event.target).data("sulka.group.id")) {
			var groupId = $(event.target).data("sulka.group.id");
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
			.height(winHeight - event.pageY - sulka.CONTEXT_HEIGHT_ADJUST)
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
			if (visibleCols.length == 0) {
				// Refuse to hide all columns
				column.$sulkaVisible = true;
				return;
			}
			sulka.grid.setColumns(visibleCols);
			sulka.renderColumnGroups();
			$(this).closest("li").find("span.context-menu-tick").text(column.$sulkaVisible ? sulka.TICK_MARK : "");
		}
	},
	
	/**
	 * Called whenever column groups need to be re-rendered.
	 */
	renderColumnGroups: function () {
		if (sulka.grid && sulka.grid.$columnGroups) sulka.grid.$columnGroups.render();
		sulka.freeze.renderColumnGroups();
	},
	
	/**
	 * Set grid data and render.
	 */
	setData: function (rows) {
		sulka.grid.setData(rows);
		sulka.grid.render();
		sulka.freeze.setData(rows);
	},
	
	/**
	 * Reload all data to table, applying new filters etc.
	 */
	reloadData: function () {
		// Grid not yet initialised?
		if (sulka.grid === null) return;
		
		sulka.helpers.unsetErrorAndShowLoader();
		
		sulka.getRowMode();
		
		var filters = sulka.getFilters();
		if (typeof(filters) === "string") {
			sulka.helpers.hideLoaderAndSetError(filters);
			sulka.setData([]);
			return;
		}
		
		sulka.helpers.unsetErrorAndShowLoader();
		sulka.fetchRows(filters);
	},
	
	fetchRows: function (filters) {
		sulka.API.fetchRows(
				sulka.rowsMode,
				filters,
				function (rows) {
					if (rows.length == 0) {
						sulka.helpers.hideLoaderAndSetError(sulka.strings.noResults);
					} else {
						sulka.helpers.hideLoaderAndUnsetError();
					}
					
					if (rows.length > 0) {
						sulka.adjustFlexibleCols(rows);
					}
					sulka.setData(rows);
				},
				sulka.helpers.hideLoaderAndSetError
			);
	},
	
	/**
	 * Adjust flexible columns for new data. 
	 */
	adjustFlexibleCols: function (rows) {
		var flexibleCols = [];
		
		var a = sulka.grid.getColumns();
		for (var i=0; i<a.length; i++) {
			var col = a[i];
			if (col.$sulkaFlexible) {
				col.$sulkaFlexible = false;
				col.$sulkaMaxStrLen = 0;
				col.$sulkaMaxTextWidth = sulka.COL_PADDING;
				flexibleCols.push(col);
			}
		}
		
		if (flexibleCols.length == 0) {
			return;
		}
		
		for (var i=0; i<rows.length; i++) {
			var row = rows[i];
			for (var j=0; j<flexibleCols.length; j++) {
				var col = flexibleCols[j];
				if (col.$sulkaMaxTextWidth >= sulka.COL_MAX_WIDTH) continue;
				
				var str = String(row[col.field]);
				if (str.length > col.$sulkaMaxStrLen) {
					col.$sulkaMaxStrLen = str.length;
					// sulka.getRenderedTextWidth() is an expensive call
					var newWidth = sulka.COL_PADDING + sulka.getRenderedTextWidth(str);
					if (col.$sulkaMaxTextWidth < newWidth) {
						col.$sulkaMaxTextWidth = Math.max(newWidth, col.$sulkaMaxTextWidth);
					}
				}
			}
		}
		
		for (var j=0; j<flexibleCols.length; j++) {
			var col = flexibleCols[j];
			col.width = Math.min(sulka.COL_MAX_WIDTH, col.$sulkaMaxTextWidth);
			delete col.$sulkaMaxStrLen;
			delete col.$sulkaMaxTextWidth;
		}
		sulka.grid.setColumns(a);
		sulka.renderColumnGroups();
	},
	
	/**
	 * Get current row filter object by filters form values.
	 * 
	 * @returns Filter object, or a string if there are parsing errors. The
	 *          string describes the error.
	 */
	getFilters: function () {
		var filters;
		var municipality = $.trim($("#filters-municipality").val()),
			species = $.trim($("#filters-species").val()),
			date = $.trim($("#filters-date").val());
		
		if (date) {
			filters = sulka.helpers.parseDateInput(date);
			if (typeof(filters) === "string") {
				return filters;
			}
		} else {
			filters = {};
		}
		
		if (municipality) {
			filters.municipality = municipality.toUpperCase();
		}
		if (species) {
			filters.species = species.toUpperCase();
		}
			
		return filters;
	},
	
	/**
	 * When new row is added, this function is called.
	 * uses addToSulkaDB() to add row to sulka-database
	 */
	onAddNewRow: function(event, args){
			var data = sulka.grid.getData();
	        var item = args.item;
	        item.rowStatus = "inputRow";
	        args.row = sulka.grid.getData().length;
	        
	        sulka.grid.invalidateRow(data.length);
	        data.push(item);
	        sulka.grid.updateRowCount();
	        sulka.grid.render();
	        
	        sulka.addToSulkaDB(args);
	},
	
	/**
	 * When cell is changed, this function is called.
	 * uses addToSulkaDB() to add row to sulka-database
	 */
	onCellChange: function(event, args){
		sulka.addToSulkaDB(args);
	},
	
	/**
	 * Adds row to sulka-database
	 */
	addToSulkaDB: function (args) {
		var data = sulka.grid.getData();		
		var actualRowData = data[args.row];
	    var rowStatus = args.item.rowStatus;
	    
	    if (rowStatus == "inputRow"){
	    	var testObject = {};
	    	if(actualRowData.hasOwnProperty("databaseId")){
	    		testObject.id = actualRowData.databaseId;
	    		testObject.userId = actualRowData.UserId;
	    	}
	    	testObject.row = JSON.stringify(actualRowData);
	    	
	    	sulka.API.addRow(
	    			testObject,
	    			args.row
	    	);
	    }
	},
	
	/**
	 * Gets the wanted rows mode from the checkboxes in filters-form
	 */
	getRowMode: function () {
		var	ringings = $("#filters-ringings").is(':checked'),
			recoveries = $("#filters-recoveries").is(':checked');
		
		if (ringings && recoveries){
			sulka.rowsMode = "all";
		} else if (ringings){
			sulka.rowsMode = "ringings";
		} else if (recoveries){
			sulka.rowsMode = "recoveries";
		} else{
			sulka.rowsMode = "all";
		}
	},
	
	/**
	 * validates selected row
	 */
	validate: function() {
		var selectedRows = sulka.grid.getSelectedRows();
		if (selectedRows.length == 0) return;
		sulka.helpers.unsetErrorAndShowLoader();
		var selectedRow = sulka.grid.getData()[selectedRows[0]];
		sulka.API.validate(
			selectedRow, 
			function (data) {
				sulka.helpers.hideLoaderAndUnsetError();
				
				if (data.passes){
					sulka.helpers.hideLoaderAndSetError(sulka.strings.validRow);
				} else {
					var errorString = sulka.strings.invalidRow + ": ";
					for (var errorField in data.errors) if (data.errors.hasOwnProperty(errorField)) {
						var errorArray = data.errors[errorField];
						errorString = errorString.concat('(' + errorField + ': ' + errorArray[0].errorName + '), ');
					}
					sulka.helpers.hideLoaderAndSetError(errorString);
				}
			}, 
			sulka.helpers.hideLoaderAndSetError
		);
	},
	
	onColumnChange: function() {
		sulka.helpers.showLoader();
		var columns = sulka.grid.getColumns();
		var columnDataToBeSaved = {};
		for(var index in columns){
			var columnData = {
					w: columns[index].width
			};
			columnDataToBeSaved[columns[index].field] = columnData;
		}
		var settings = {
				columns: JSON.stringify(columnDataToBeSaved)
		};
		sulka.API.saveSettings(settings, function onSuccess() {
			sulka.helpers.hideLoaderAndSetError("Asetukset tallennettu.");
		}, function onError(){
			sulka.helpers.hideLoaderAndSetError("Asetusten tallennus epäonnistui.");
		});
	},
	
	fetchSettings: function() {
		sulka.helpers.showLoader();
		sulka.API.fetchSettings(function onSuccess(results){
			console.log(results);
			var settings = jQuery.parseJSON(results.object.columns);
			console.log(settings);
			var columns = sulka.grid.getColumns();
			for(var index in columns){
				columns[index].width = settings[columns[index].field].w;
			}
			sulka.grid.setColumns(columns);
			sulka.helpers.hideLoaderAndSetError("Asetukset noudettu.");
		}, function onError(){
			sulka.helpers.hideLoaderAndSetError("Asetusten nouto epäonnistui.");
		});
	}
	
};


return sulka; }();

/* Launch sulka.init() on DOM complete */
$(sulka.init);

