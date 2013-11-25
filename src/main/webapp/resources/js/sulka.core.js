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
	 * Slick grid options that are used to initialize the grid.
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
		$sulkaVisible: true
	},

	/** In row inserting mode? */ 
	addMode: false,
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
	COL_TYPE_IMAGE_WIDTH: 19,
	
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
						
						if (field.field == "type") {
							column.$sulkaFlexible = false;
							column.formatter = function () { return ""; };
							column.width  = sulka.COL_TYPE_IMAGE_WIDTH + sulka.COL_PADDING;
							column.cssClass = "rowtype-column";
						}
						
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
	
	previousActiveRow: undefined,
	previousActiveRowEdited: false,
	
	/**
	 * Init grid. Called once at start after columns have been fetched.
	 */
	initGrid: function () {
		// We are now ready to actually initialize the grid
		  
		sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);
		
		sulka.viewport = $("#slick-grid").find(".slick-viewport");
		
		sulka.grid.setSelectionModel(new Slick.CellSelectionModel());
		sulka.grid.setSelectionModel(new Slick.RowSelectionModel());
		
		if (sulka.viewMode == "ringings" || sulka.viewMode == "recoveries"){
			sulka.moveRowsPlugin = 
				new Slick.RowMoveManager({   
					cancelEditOnDrag: true
				});
			
			sulka.grid.registerPlugin(sulka.moveRowsPlugin);
			
			//Row move, drag & drop features
			sulka.grid.onKeyDown.subscribe(sulka.onKeyDown);
			sulka.moveRowsPlugin.onBeforeMoveRows.subscribe(sulka.onBeforeMoveRows); 	  
			sulka.moveRowsPlugin.onMoveRows.subscribe(sulka.onMoveRows);
			sulka.grid.onDragInit.subscribe(sulka.grid.onDragInit);
			sulka.grid.onDragStart.subscribe(sulka.onDragStart);
			sulka.grid.onDrag.subscribe(sulka.onDrag);
			sulka.grid.onDragEnd.subscribe(sulka.onDragEnd);
			
			sulka.grid.onClick.subscribe(sulka.onClick);
			
			sulka.grid.onActiveCellChanged.subscribe(sulka.onActiveCellChanged);
			
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
	
	/**
	 * InitDrop function is called when drop event is launched.
	 */
	initDrop: function(){
		 $.drop({mode: "mouse"});
		 $("#dropzone").bind("dropstart", function (e, dd) {
	 		if (dd.mode != "recycle") {
	 			return;
	        }
	        $(this).css("background", "yellow");
	    }).bind("dropend", function (e, dd) {
	    	if (dd.mode != "recycle") {
	    		return;
	        }
	        $(dd.available).css("background", "pink");
	    }).bind("drop", function (e, dd) {
	    	if (dd.mode != "recycle") {
	    		return;
	        }
	    	
	    	//Call delete rows
	    	sulka.deleteRows(e, dd);
      	});
	},
	
	/**
	 * Deletes selected rows
	 */
	deleteRows: function(e, dd){
        var data = sulka.getData();
        
        var rowsToDelete = dd.rows.sort(sulka.helpers.numericReverseSort);
        var toBeDeleted = [];
        for (var i=0; i<rowsToDelete.length; i++) {
        	var deleteRow = data[rowsToDelete[i]];
        	if (deleteRow && deleteRow.rowStatus == "inputRow" && typeof(deleteRow.databaseId) === "number" ) {
        		data.splice(rowsToDelete[i], 1);
	 	    	toBeDeleted.push(deleteRow.databaseId);
        	}
        }
        
        sulka.helpers.unsetErrorAndShowLoader();
		sulka.API.deleteSulkaDBRows(
			toBeDeleted,
			sulka.helpers.hideLoaderAndUnsetError,
			sulka.helpers.hideLoaderAndSetError
		);
        
		sulka.colourErrors(sulka.getData());
        sulka.setData(data);
        sulka.grid.invalidate();
        sulka.grid.setSelectedRows([]);
		
		
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
	
	
	/**
	 * Parameters for mouse wheel events
	 */
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
		sulka.colourErrors(sulka.getData());
	},
	
	/**
	 * Sort grid by columns.
	 */
	sort: function (args) {
		var data = sulka.getData();
	    
		var sign = args.sortAsc ? 1 : -1;
		var field = args.sortCol.field;
		data.sort(function (dataRow1, dataRow2) {
			var value1 = dataRow1[field], value2 = dataRow2[field];
			return (value1 == value2) ? 0 : (sign * (value1 > value2 ? 1 : -1));
		});
		sulka.setData(data);
		sulka.grid.invalidate();
		sulka.freeze.invalidate();
	},
	
	
	/**
	 *  Called before MoveRows
	 */
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
	
	/**
	 * OnMoveRows events
	 */
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
	
	
	/**
	 *	OnDragInit is used to prevent the grid from cancelling drag'n'drop by default 
	 */
	onDragInit: function(e,dd){
		sulka.grid.onDragInit.subscribe(function (e, dd) {
		    // prevent the grid from cancelling drag'n'drop by default
		    e.stopImmediatePropagation();
		  });
		
	},
	
	
	/**
	 * Contains onKeyDown events. Here you can map custom events to different keys by their ASCII code.
	 */
	onKeyDown: function(e){
		
		//Enter key bindings
		  if (e.which == 13) {
			  if (sulka.gridOptions.editable){
				  if (sulka.grid.activeRow === sulka.grid.getDataLength()) {
					  sulka.grid.navigateRight();
	                } else {
	                	
	                	sulka.grid.navigateRight();
	                }
			  }
		  }
	},
	
	/**
	 * Called when drag event is started
	 */
	onDragStart: function(e,dd){
		sulka.grid.onDragStart.subscribe(function (e, dd) {
			
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
		        .text("Drag to Recycle Bin to delete " + dd.count + " selected row(s)")
		        .appendTo("body");

		    dd.helper = proxy;

		    $(dd.available).css("background", "pink");

		    return proxy;
		  });
		
	},
	
	
	/**
	 * onDrag events.
	 */
	onDrag: function(e,dd){
		  sulka.grid.onDrag.subscribe(function (e, dd) {
			    if (dd.mode != "recycle") {
			      return;
			    }
			    dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
			  });
	},
	
	
	/**
	 * onDragEnd: this function is called when dragging rows ends.
	 */
	onDragEnd: function(e, dd){
		sulka.grid.onDragEnd.subscribe(function (e, dd) {
		    if (dd.mode != "recycle") {
		        return;
		      }
		      dd.helper.remove();
		      $(dd.available).css("background", "beige");
		    });
	},
	
	
	/**
	 * showColumnHeaderContextMenu parameters
	 */
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
	 * setData parameters.
	 */
	currentData: [],
	
	/**
	 * Set grid data and render.
	 */
	setData: function (rows) {
		sulka.currentData = rows;
		var dataView = sulka.createNewDataView(rows);
		sulka.grid.setData(dataView);
		sulka.grid.render();
		sulka.freeze.setData(dataView);
	},
	
	/**
	 * Returned cached data.
	 */
	getData: function () {
		return sulka.currentData;
	},
	
	/**
	 * Reload all data to table, applying new filters etc.
	 */
	reloadData: function () {
		// Grid not yet initialised?
		if (sulka.grid === null) return;
		
		sulka.getRowMode();
		
		var filters = sulka.getFilters();
		if (typeof(filters) === "string") {
			sulka.helpers.hideLoaderAndSetError(filters);
			sulka.setData([]);
			return;
		}
		
		sulka.helpers.unsetErrorAndShowLoader();
		
		// Fetch rows
		var combinedRows = null;
		var combineCalls = 0;
		var N_CALLS = sulka.addMode ? 2 : 1;
		
		var combine = function (rows) {
			combineCalls++;
			if (combinedRows === null) {
				combinedRows = rows;
			} else {
				combinedRows = combinedRows.concat(rows);
			}
			
			if (combineCalls < N_CALLS) return;
			
			sulka.setData(combinedRows);
			if (combinedRows.length > 0) {
				sulka.adjustFlexibleCols(combinedRows);
			}
			
			sulka.colourErrors(sulka.getData());
			sulka.grid.render();
			
			if (combinedRows.length == 0) {
				sulka.helpers.hideLoaderAndSetError(sulka.strings.noResults);
			} else {
				sulka.helpers.hideLoaderAndUnsetError();
			}
		};
		
		sulka.API.fetchRows(
			sulka.rowsMode,
			filters,
			combine,
			sulka.helpers.hideLoaderAndSetError
		);
		
		if (sulka.addMode) {
			sulka.API.fetchSulkaDBRows(
				sulka.rowsMode,
				filters,
				function (rows) {
					if (rows.length > 0) {
						sulka.adjustFlexibleCols(rows);
					}
					
					var sulkaRows = [];
					for (var i=0; i<rows.length; i++) {
						var row;
						try {
							row = JSON.parse(rows[i].row);
						} catch (e) {
							continue;
						};
						row.userId = rows[i].userId;
						row.databaseId = rows[i].id;
						sulkaRows.push(row);
					}
					combine(sulkaRows);
				},
				sulka.helpers.hideLoaderAndSetError
			);
		}
	},
	
	/**
	 * Sets coordinates to selected rows, this function is called from the Colorbox
	 */
	setCoordinateToRows: function(){
		/*
		 * SlickGrid Coordinate Columns
		 * 
		 * Latitude: lat
		 * Longitude: lon 
		 * 
		 */
		var selectedRows = sulka.grid.getSelectedRows();
		var data = sulka.getData();
		
		if (selectedRows.length == 0) return;
		
		for (var i = 0; i < selectedRows.length; i++){		
			data[selectedRows[i]].lon = sulka.lastInputCoordinateLon;
			data[selectedRows[i]].lat = sulka.lastInputCoordinateLat;
			sulka.addToSulkaDB(selectedRows[i]);
		}
	
        sulka.grid.invalidateRow(data.length);
        sulka.setData(data);
        sulka.grid.updateRowCount();
        sulka.grid.render();
	},
	
	
	/**
	 * Parameters used while initializing new dataview with createNewDataView.
	 */
	METADATA_SULKA_RECOVERY: {"cssClasses" : "sulka-row recovery-row" },
	METADATA_SULKA_RINGING: {"cssClasses" : "sulka-row ringing-row" },
	METADATA_SULKA_RINGING_VALID : {"cssClasses" : "sulka-row ringing-row-color sulka-valid-row"},
	METADATA_SULKA_RINGING_INVALID : {"cssClasses" : "sulka-row ringing-row-color sulka-invalid-row"},
	METADATA_TIPU_RECOVERY: { "cssClasses": "tipu-row recovery-row" },
	METADATA_TIPU_RINGING: { "cssClasses": "tipu-row ringing-row" },
	METADATA_EMPTY: { },
	
	RINGING_TYPE: "Rengastus",
	RECOVERY_TYPE: "Tapaaminen",
	
	
	
	/**
	 * Creates new DataView for the grid.
	 */
	createNewDataView: function (data) {
		var METADATA_SULKA_RECOVERY = sulka.METADATA_SULKA_RECOVERY,
			METADATA_SULKA_RINGING = sulka.METADATA_SULKA_RINGING,
			METADATA_SULKA_RINGING_VALID = sulka.METADATA_SULKA_RINGING_VALID,
			METADATA_SULKA_RINGING_INVALID = sulka.METADATA_SULKA_RINGING_INVALID,
			METADATA_TIPU_RECOVERY = sulka.METADATA_TIPU_RECOVERY,
			METADATA_TIPU_RINGING = sulka.METADATA_TIPU_RINGING,
			METADATA_EMPTY = sulka.METADATA_EMPTY,
			RINGING_TYPE = sulka.RINGING_TYPE;
		return {
			data: data,
			getLength: function () {
				return data.length;
			},
			getItem: function (index) {
				return data[index];
			},
			getItemMetadata: function (index) {
				if (data.length <= index) {
					return METADATA_EMPTY; 
				}
				var row = data[index];
				if (row.hasOwnProperty("databaseId")) {
					if (sulka.rowsMode == "ringings") {
						if (row.$valid === false) {
							return METADATA_SULKA_RINGING_INVALID;
						} else if (row.$valid === true) {
							return METADATA_SULKA_RINGING_VALID;
						} else {
							return METADATA_SULKA_RINGING;
						}
					} else {
						return METADATA_SULKA_RECOVERY;
					}
				} else {
					if (row.type == RINGING_TYPE) {
						return METADATA_TIPU_RINGING;
					} else {
						return METADATA_TIPU_RECOVERY;
					}
				}
			}
		};
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
	 * 
	 * @returns slick grid row id where was added
	 */
	onAddNewRow: function(event, args) {
		var data = sulka.getData();
        var item = args.item;
        item.rowStatus = "inputRow";
        data.push(item);
        sulka.setData(data);
        sulka.grid.render();
        sulka.addToSulkaDB(sulka.getData().length - 1);
	},
	
	/**
	 * When cell is changed, this function is called.
	 * uses addToSulkaDB() to add row to sulka-database
	 */
	onCellChange: function(event, args){
		sulka.addToSulkaDB(args.row);
	},
	
	/**
	 * This function is called when slickgrid is clicked.
	 * If invalid row is clicked, displays it's error msg.
	 */
	onClick: function(e, args) {
		if (args.row === sulka.getData().length)
			return;
		sulka.helpers.unsetErrorAndShowLoader();
		if (sulka.getData()[args.row].$invalid_msg !== undefined) {
			sulka.helpers.hideLoaderAndSetError(sulka.getData()[args.row].$invalid_msg);
		} else {
			sulka.helpers.hideLoaderAndSetError("");
		}
	},
	
	/**
	 * This function is called when activecell is changed.
	 * If active row is changed and previous active row was edited, this function validates previous active row.
	 */
	
	onActiveCellChanged: function () {
		if (sulka.previousActiveRow !== undefined
				&& sulka.grid.getSelectedRows()[0] !== sulka.previousActiveRow
				&& sulka.previousActiveRowEdited ){
			
			
			var data = sulka.getData();
			var actualRowData = data[sulka.previousActiveRow];

			if (!actualRowData)
				return;
			
			sulka.previousActiveRow = sulka.grid.getSelectedRows()[0];
			
			sulka.helpers.unsetErrorAndShowLoader();
			sulka.API.validate(
				actualRowData,
				function(data) {
					sulka.previousActiveRowEdited = false;
					
					actualRowData.$valid = data.passes;
					if (data.passes) {
						actualRowData.$invalid_msg = undefined;
						actualRowData.$errors = undefined;
					} else {
						actualRowData.$errors = [];
						errorString = sulka.strings.invalidRow + ": ";
						for ( var errorField in data.errors)
							if (data.errors.hasOwnProperty(errorField)) {
								var errorArray = data.errors[errorField];
								errorString = errorString.concat('(' + errorField + ': ' + errorArray[0].errorName + '), ');
								actualRowData.$errors.push(errorField);
							}
						actualRowData.$errors = JSON.stringify(actualRowData.$errors);
						actualRowData.$invalid_msg = errorString;
					}
					
					var localDbRow = {};
					if (actualRowData.hasOwnProperty("databaseId")) {
						localDbRow.id = actualRowData.databaseId;
						localDbRow.userId = actualRowData.userId;
					}
					localDbRow.row = JSON.stringify(actualRowData);
					sulka.API.addRow(
						localDbRow,
						function(row) {
							actualRowData.databaseId = row.id;
							actualRowData.userId = row.userId;
							JSON.stringify(actualRowData.errors);
							sulka.colourErrors(sulka.getData());
							sulka.grid.invalidate();
							sulka.grid.render();
							sulka.helpers.hideLoaderAndUnsetError();
						},
						function() {
							sulka.helpers.hideLoaderAndSetError(sulka.strings.couldNotInsert);
						});	
				}, function() {
					sulka.helpers.hideLoaderAndSetError;
				}
			);
		}
		sulka.previousActiveRow = sulka.grid.getSelectedRows()[0];
	},
	
	/**
	 * Adds row to sulka-database
	 */
	addToSulkaDB: function (index) {
		sulka.previousActiveRowEdited = true;	
		
		var data = sulka.getData();
		var actualRowData = data[index];

		if (!actualRowData)
			return;
		var rowStatus = actualRowData.rowStatus;

		if (rowStatus == "inputRow") {
			var localDbRow = {};
			if (actualRowData.hasOwnProperty("databaseId")) {
				localDbRow.id = actualRowData.databaseId;
				localDbRow.userId = actualRowData.userId;
			}
			localDbRow.row = JSON.stringify(actualRowData);

			
			var localDbRow = {};
			if (actualRowData.hasOwnProperty("databaseId")) {
				localDbRow.id = actualRowData.databaseId;
				localDbRow.userId = actualRowData.userId;
			}
			localDbRow.row = JSON.stringify(actualRowData);
			sulka.helpers.unsetErrorAndShowLoader();
			sulka.API.addRow(
				localDbRow,
				function(row) {
					actualRowData.databaseId = row.id;
					actualRowData.userId = row.userId;
					JSON.stringify(actualRowData.errors);
					sulka.colourErrors(sulka.getData());
					sulka.grid.invalidate();
					sulka.grid.render();
					sulka.helpers.hideLoaderAndUnsetError();
				},
				function() {
					sulka.helpers.hideLoaderAndSetError(sulka.strings.couldNotInsert);
				}
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
	 * This function validates the selected row.
	 */
	validate: function() {
		var selectedRows = sulka.grid.getSelectedRows();
		if (selectedRows.length == 0) return;
		sulka.helpers.unsetErrorAndShowLoader();
		var selectedRow = sulka.getData()[selectedRows[0]];
		sulka.API.validate(
			selectedRow, 
			function (data) {
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
	
	
	/**
	 * SaveSettings function is used to save users current view, which includes:
	 * 	- Filters
	 * 	- Column settings
	 * 
	 * to the sulka database.
	 */
	saveSettings: function() {
		sulka.helpers.showLoader();
		var columnsDataToBeSaved = {};
		for(var index in sulka.columns){
			var columnData = [ // [position, width, visibility]
					index,
					sulka.columns[index].width,
					sulka.columns[index].$sulkaVisible,
			];
			columnsDataToBeSaved[sulka.columns[index].field] = columnData;
		}
		var gridColumns = sulka.grid.getColumns();
		for(var index in gridColumns){
			columnsDataToBeSaved[gridColumns[index].field][1] = gridColumns[index].width;
		}
		
		var filters =  {
				date: $("#filters-date").val(),
				species: $("#filters-species").val(),
				municipality: $("#filters-municipality").val(),
				ringings: $("#filters-ringings").prop("checked"),
				recoveries: $("#filters-recoveries").prop("checked"),
		};
		
		var settings = {
				columns: JSON.stringify(columnsDataToBeSaved),
				filters: JSON.stringify(filters),
		};
		sulka.API.saveSettings(sulka.viewMode, settings,
			function onSuccess() {
				sulka.helpers.hideLoader();
			}, function onError(){
				sulka.helpers.hideLoaderAndSetError(sulka.strings.settingsSaveFailed);
			});
	},
	
	
	/**
	 * FetchSettings is used to fetch user settings from the Sulka database.
	 */
	fetchSettings: function() {
		sulka.helpers.showLoader();
		sulka.API.fetchSettings(
			sulka.viewMode,
			function onSuccess(results){
				sulka.helpers.hideLoader();
				
				if(results.object.columns){
					var settings = jQuery.parseJSON(results.object.columns);
					var oldColumns = sulka.columns;
					var updatedColumns = [];
					for(var index in oldColumns){ 
						// Data is in following format:
						// "columnName": [position, width, visibility]
						oldColumns[index].width = settings[oldColumns[index].field][1];
						oldColumns[index].$sulkaVisible = settings[oldColumns[index].field][2];
						updatedColumns[settings[oldColumns[index].field][0]] = oldColumns[index];
					}
					sulka.columns = updatedColumns;
					sulka.grid.setColumns(sulka.getVisibleColumns());
					sulka.renderColumnGroups();
				}
				
				if(results.object.filters){
					var filters = jQuery.parseJSON(results.object.filters);
					$("#filters-date").val(filters.date);
					$("#filters-species").val(filters.species);
					$("#filters-municipality").val(filters.municipality);
					$("#filters-ringings").prop('checked', filters.ringings);
					$("#filters-recoveries").prop('checked', filters.recoveries);
				}
			}, function onError(){
				sulka.helpers.hideLoaderAndSetError(sulka.strings.settingsReceivedFailed);
			});
	},
	
	/**
	 * Adds sulka-invalid-cell-color css class to cells that have been tagged invalid by validate().
	 */
	colourErrors: function(rows) {
		var cellsToPaint = {};
		rows.forEach(function(row, index) {
			if (row.$errors !== undefined) {
				var errors = JSON.parse(row.$errors);
				errors.forEach(function(error) {
					if (cellsToPaint[index] === undefined){
						cellsToPaint[index] = {};
					}
					sulka.grid.getColumns().forEach(function(column){
						if (column.field == error){
							cellsToPaint[index][column.id] = "sulka-invalid-cell";
						}
					});
				});
			}
		});
		sulka.grid.setCellCssStyles("invalid-cell", cellsToPaint);
	}
	
};

return sulka; }();

/* Launch sulka.init() on DOM complete */
$(sulka.init);
