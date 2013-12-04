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
		});
		$("#filters").change(function (event) {
			sulka.helpers.cancelEvent(event);
			sulka.reloadData();
		});
		
		$("#saveSettings").click(sulka.userSettings.save);
		$("#loadSettings").click(sulka.userSettings.restore);
		
		// Prevent inputting invalid chars to filter fields
		$("#filters-date").keypress(
				sulka.createInputLimitter("1234567890-."));
		var letterPercentLimitter = sulka.createInputLimitter("ABCDEFGHJIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstyuvwxyzåäö%");
		$("#filters-species").keypress(letterPercentLimitter);
		$("#filters-municipality").keypress(letterPercentLimitter);
	},
	
	TICK_MARK: "✓",
	
	/**
	 * Stores context menu <li></li> elements by corresponding column ID.
	 */
	contextMenuItemById: {},
	
	/**
	 * Reference to current view's columns, fieldGroups and list of date fields.
	 */
	columns: [],
	fieldGroups: [],
	dateFields: [],
	
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
				var dateFields = [];
				sulka.fieldGroups = fieldGroups;
				
				var $headerContextMenu = $("#header-context-menu");
				dateFieldFormatter = sulka.makeDateFieldFormatter();
				
				fieldGroups.forEach(function (group) {
					var contextHeader = $("<li></li>")
						.addClass("context-menu-title")
						.text(group.description);
					sulka.contextMenuItemById[group.name] = contextHeader; 
					$headerContextMenu.append(contextHeader);
					
					group.fields.forEach(function (field) {
						var id = group.name + "/" + field.field;
						var isFlexible = false;
						var width;
						
						if (field.type === "ENUMERATION") {
							width = sulka.COL_PADDING;
							field.enumerationValues.forEach(function (enumValue) {
								var enumWidth = Math.min(
										sulka.COL_MAX_WIDTH, sulka.getRenderedTextWidth(enumValue.value) + sulka.COL_PADDING);
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
							$sulkaField: field, 
							$sulkaFlexible: isFlexible,
							cssClass: "sulka-column-" + field.field
						}, sulka.columnOptions);
						
						if (field.field === "type") {
							column.$sulkaFlexible = false;
							column.formatter = function () { return ""; };
							column.width  = sulka.COL_TYPE_IMAGE_WIDTH + sulka.COL_PADDING;
						}
						if (field.type === "ENUMERATION") {
							column.$sulkaEnumValues = field.enumerationValues.map(function (apiField) {
								return apiField.value;
							});
							if (sulka.addMode) {
								column.editor = sulka.editors.EnumerationEditor;
							}
						} else if (field.type === "DATE") {
							column.formatter = dateFieldFormatter;
							dateFields.push(field.field);
							if (sulka.addMode) {
								column.editor = sulka.editors.DateEditor;
							}
						} 
						else if (sulka.addMode) {
							column.editor = Slick.Editors.Text;
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
				sulka.dateFields = dateFields;
				sulka.initGrid();
			},
			sulka.helpers.hideLoaderAndSetError
		);
	},
	
	previousActiveRow: undefined,
	/**
	 * Set to true whenever the current row has been edited and needs to be re-validated once user
	 * moves the selection to another row. 
	 */
	previousActiveRowEdited: false,
	
	/**
	 * Init grid. Called once at start after columns have been fetched.
	 */
	initGrid: function () {
		// We are now ready to actually initialize the grid
		  
		sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);
		
		sulka.viewport = $("#slick-grid").find(".slick-viewport");
		
		//sulka.grid.setSelectionModel(new Slick.CellSelectionModel());
		sulka.grid.setSelectionModel(new Slick.RowSelectionModel());
		
		if (sulka.addMode) {
			sulka.moveRowsPlugin = 
				new Slick.RowMoveManager({   
					canceleditingCellDrag: true
				});
			
			sulka.grid.registerPlugin(sulka.moveRowsPlugin);
			
			//Row move, drag & drop features
			
            sulka.grid.onBeforeEditCell.subscribe(sulka.events.onBeforeEditCell);
			sulka.moveRowsPlugin.onBeforeMoveRows.subscribe(sulka.events.onBeforeMoveRows); 	  
			sulka.moveRowsPlugin.onMoveRows.subscribe(sulka.events.onMoveRows);
			sulka.grid.onDragInit.subscribe(sulka.events.onDragInit);
			sulka.grid.onDragStart.subscribe(sulka.events.onDragStart);
			sulka.grid.onDrag.subscribe(sulka.events.onDrag);
			sulka.grid.onDragEnd.subscribe(sulka.events.onDragEnd);
			
			sulka.grid.onKeyDown.subscribe(sulka.events.makeOnKeyDown());
			sulka.grid.onDblClick.subscribe(sulka.events.onDblClick);
			
			sulka.grid.onActiveCellChanged.subscribe(sulka.events.onActiveCellChanged);
			
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
		
		sulka.grid.onSort.subscribe(sulka.events.onGridSort);
		
		sulka.grid.onCellChange.subscribe(sulka.events.onCellChange);
		
		sulka.grid.onColumnsResized.subscribe(sulka.events.updateWidthToSulkaColumns);
		sulka.grid.onColumnsReordered.subscribe(sulka.events.updateOrderToSulkaColumns);
		
		$(window).resize(sulka.resizeGrid);
		sulka.resizeGrid();
		
		var $slickGrid = $("#slick-grid");
		if (typeof($slickGrid.mousewheel) === "function") {
			$slickGrid.mousewheel(sulka.events.onMouseWheel);
		}
		
		sulka.reloadData();
		
		sulka.userSettings.restore();
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
        
		sulka.colouriseCellsWithErrors(sulka.getData());
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
	 * Return currently visible columns (even those not currently on grid)
	 */
	getVisibleColumns: function () {
		return sulka.columns.filter(function (column) {
			return column.$sulkaVisible;
		});
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
	 * Reload all data to table, applying new filters etc. If in add mode, the data is combined
	 * from Tipu and Sulka DBs.
	 */
	reloadData: function () {
		// Grid not yet initialised?
		if (sulka.grid === null) return;
		
		sulka.getRowMode();
		
		var filters = sulka.getFilters();
		if (typeof(filters) === "string") {
			sulka.helpers.setError(filters);
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
			
			//add empty row to end
			if (sulka.addMode){
				combinedRows = combinedRows.concat({rowStatus: "inputRow"});
			}
			
			sulka.formatRowsIn(combinedRows);
			sulka.setData(combinedRows);
			
			sulka.colouriseCellsWithErrors(sulka.getData());
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
			sulka.helpers.unsetErrorAndShowLoader();
			sulka.API.convertCoordinate(
				sulka.lastInputCoordinateLon,
				sulka.lastInputCoordinateLat, 
				function onSuccess(results){
					for (var i = 0; i < selectedRows.length; i++){	
						if(data[selectedRows[i]].rowStatus == "inputRow"){
							data[selectedRows[i]].lon = results.lon;
							data[selectedRows[i]].lat = results.lat;
							data[selectedRows[i]].coordinateType = "KARTTA";
							//data[selectedRows[i]].coordinateAccuracy = "kartta";
							sulka.grid.invalidate();
							sulka.grid.render();
							var row = sulka.getData()[selectedRows[i]];
							if (row) {
								sulka.submitSulkaDBRow(row);
							}
						}
					}
					sulka.helpers.hideLoader();
				},
				function onError(){
					sulka.helpers.hideLoaderAndSetError(sulka.strings.coordinateConversionFailed);
				}
			);

        sulka.grid.invalidateRow(data.length);
        sulka.setData(data);
        sulka.grid.updateRowCount();
        sulka.grid.render();
	},
	
	
	/**
	 * Parameters used while initializing new dataview with createNewDataView.
	 */
	
	METADATA_SULKA : {"cssClasses" : "sulka-row"},
	METADATA_SULKA_ODD : {"cssClasses" : "sulka-row-odd"},
	
	METADATA_SULKA_INVALID : {"cssClasses" : "sulka-invalid-row"},
	METADATA_SULKA_INVALID_ODD : {"cssClasses" : "sulka-invalid-row-odd"},
	
	METADATA_TIPU_RECOVERY: { "cssClasses": "tipu-row recovery-row" },
	METADATA_TIPU_RECOVERY_ODD: {"cssClasses": "tipu-row recovery-row tipu-row-color-odd"},
	
	METADATA_TIPU_RINGING: { "cssClasses": "tipu-row ringing-row" },
	METADATA_TIPU_RINGING_ODD: {"cssClasses": "tipu-row ringing-row tipu-row-color-odd"},
	
	METADATA_EMPTY: { },
	
	RINGING_TYPE: "Rengastus",
	RECOVERY_TYPE: "Tapaaminen",
	
	
	
	/**
	 * Creates new DataView for the grid.
	 */
	createNewDataView: function (data) {
		var METADATA_SULKA= sulka.METADATA_SULKA,
			METADATA_SULKA_ODD = sulka.METADATA_SULKA_ODD,
			
			METADATA_SULKA_INVALID = sulka.METADATA_SULKA_INVALID,
			METADATA_SULKA_INVALID_ODD = sulka.METADATA_SULKA_INVALID_ODD,
			
			METADATA_TIPU_RECOVERY = sulka.METADATA_TIPU_RECOVERY,
			METADATA_TIPU_RECOVERY_ODD = sulka.METADATA_TIPU_RECOVERY_ODD,
			
			METADATA_TIPU_RINGING = sulka.METADATA_TIPU_RINGING,
			METADATA_TIPU_RINGING_ODD = sulka.METADATA_TIPU_RINGING_ODD,
			
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
				if (row.hasOwnProperty("rowStatus")) {
						if (row.$valid === false) {
							if (index%2 == 0)
								return METADATA_SULKA_INVALID;
							else
								return METADATA_SULKA_INVALID_ODD;
						} else if (row.$valid === true || !row.hasOwnProperty("$valid")) {
							if (index%2 == 0)
								return METADATA_SULKA;
							else
								return METADATA_SULKA_ODD;
						} else {
							return METADATA_EMPTY;
						}
				} else {
					if (row.type == RINGING_TYPE) {
						if (index%2 == 0)
							return METADATA_TIPU_RINGING;
						else
							return METADATA_TIPU_RINGING_ODD;
					} else {
						if (index%2 == 0)
							return METADATA_TIPU_RECOVERY;
						else
							return METADATA_TIPU_RECOVERY_ODD;
					}
				}
			}
		};
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
	
	submitSulkaDBRow: function (row) {
		if (!row || row.rowStatus !== "inputRow") {
			// Refuse to submit undefined or read-only row
			return;
		}
		
		// The local DB wrapper object
		var localDbRow = {};
		
		if (row.hasOwnProperty("databaseId")) {
			localDbRow.id = row.databaseId;
			localDbRow.userId = row.userId;
		}
		localDbRow.row = JSON.stringify(sulka.formatRowOut(row));
		sulka.helpers.unsetErrorAndShowLoader();
		sulka.API.addRow(
			localDbRow,
			function (savedRow) {
				row.databaseId = savedRow.id;
				row.userId = savedRow.userId;
				JSON.stringify(row.errors);
				sulka.colouriseCellsWithErrors(sulka.getData());
				sulka.helpers.hideLoaderAndUnsetError();
			},
			function() {
				sulka.helpers.hideLoaderAndSetError(sulka.strings.couldNotInsert);
			}
		);	
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
	 * Adds sulka-invalid-cell css class to cells that have been tagged invalid by validation
	 */
	colouriseCellsWithErrors: function(rows) {
		var cellsToColourise = {};
		rows.forEach(function(row, index) {
			if (row.$errors !== undefined) {
				var errors = JSON.parse(row.$errors);
				errors.forEach(function(error) {
					if (cellsToColourise[index] === undefined){
						cellsToColourise[index] = {};
					}
					sulka.grid.getColumns().forEach(function(column){
						if (column.field == error){
							cellsToColourise[index][column.id] = "sulka-invalid-cell";
						}
					});
				});
			}
		});
		sulka.grid.setCellCssStyles("invalid-cell", cellsToColourise);
	},
	
	/**
	 * Create and return an keypress event handler that constrains the allowable input characters to the ones
	 * specified in alphabet.
	 * @param alphabet the allowed alphabet of the input string.
	 * @return An jQuery event handler that discards any printable input keypresses that are not in the alphabet. 
	 */
	createInputLimitter: function (alphabet) {
		var alphabetSet = {};
		for (var i=0; i<alphabet.length; i++) {
			alphabetSet[alphabet[i]] = true; 
		}
		return function (e) {
			if (e.which >= 0x20 && !alphabetSet.hasOwnProperty(String.fromCharCode(e.which))) {
				e.preventDefault();
			}
		};
	},
	
	DATE_IN_REGEXP: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
	/**
	 * Apply transformations to API row data on input from server. The transformations should happen in-place.
	 * @param data Input rows from the API.
	 */
	formatRowsIn: function (data) {
		var DATE_RE = sulka.DATE_IN_REGEXP;
		var pad2 = sulka.helpers.pad2;
		var dateFields = sulka.dateFields; 
		data.forEach(function (row) {
			if (row) {
				dateFields.forEach(function (field) {
					if (typeof(row[field]) === "string") { 
						// Order dates year-month-day to make string sorting work
						var match = row[field].match(DATE_RE);
						if (match !== null) {
							row[field] = match[3] + "." + pad2(match[2]) + "." + pad2(match[1]);  
						}
					}
				});
			}
		});
	},
	
	DATE_OUT_REGEXP: /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/,
	/**
	 * Apply transformations to an API row on output back to server. Should do the
	 * reverse of formatRowsIn for individual row. Should clone the row if it needs
	 * to be modified.
	 * @param row Row from the local grid that is being saved to the API.
	 * @return Possibly modified row that conforms to the expectations of the API.
	 */
	formatRowOut: function (row) {
		var copy = null;
		var dateFields = sulka.dateFields;
		if (row) {
			dateFields.forEach(function (field) {
				if (typeof(row[field]) === "string") {
					var match = row[field].match(sulka.DATE_OUT_REGEXP);
					if (match !== null) {
						if (copy === null) copy = $.extend({}, row);  
						copy[field] = match[3] + "." + match[2] + "." + match[1];  
					}
				}
			});
		}
		return copy === null ? row : copy;
	},
	
	/**
	 * Create a new formatter for date fields.
	 */
	makeDateFieldFormatter: function () {
		var DATE_RE = sulka.DATE_OUT_REGEXP;
		return function (row, cell, date) {
			if (typeof(date) === "string") {
				var match = date.match(DATE_RE);
				if (match !== null) {
					return match[3] + "." + match[2] + "." + match[1];
				}
			}
			return date;
		};
	}
};

return sulka; }();

/* Launch sulka.init() on DOM complete */
$(sulka.init);
