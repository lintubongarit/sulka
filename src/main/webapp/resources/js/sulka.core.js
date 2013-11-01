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
		multiColumnSort: true,
	    editable: false,
	    enableAddRow: false,
	    enableCellNavigation: true,
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
				
				sulka.fieldGroups = fieldGroups;
				var columns = [];
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
				
				// We are now ready to actually initialize the grid
				sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);
				
				sulka.initColumnGroups();
				sulka.grid.onHeaderContextMenu.subscribe(sulka.columnHeaderContextMenu);
				$headerContextMenu.find("li.context-menu-item").click(sulka.headerContextMenuItemClicked);
				sulka.reloadData();
				sulka.grid.setSelectionModel(new Slick.CellSelectionModel());
				
				sulka.grid.onSort.subscribe(sulka.onGridSort);
				
				$(window).resize(sulka.resizeGrid);
				sulka.resizeGrid();
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
		
		sulka.grid.setSelectionModel(new Slick.CellSelectionModel());
		
		sulka.grid.registerPlugin(new Slick.AutoTooltips());

	    // set keyboard focus on the grid
		sulka.grid.getCanvasNode().focus();
		
		sulka.copyManager = new Slick.CellCopyManager();
		sulka.grid.registerPlugin(sulka.copyManager);
		
		sulka.initColumnGroups();
		
		sulka.grid.onHeaderContextMenu.subscribe(sulka.showColumnHeaderContextMenu);
		$("#header-context-menu li.context-menu-item").click(sulka.headerContextMenuItemClicked);
		
		sulka.grid.setSelectionModel(new Slick.RowSelectionModel());
		
		sulka.copyManager.onPasteCells.subscribe(sulka.onPasteCells);
		
		sulka.grid.onSort.subscribe(sulka.onGridSort);
		
		sulka.grid.onAddNewRow.subscribe(sulka.onAddNewRow);
		
		$(window).resize(sulka.resizeGrid);
		sulka.resizeGrid();
		
		sulka.reloadData();
	},
	
	/**
	 * Adjust grid positioning and size after window resize. 
	 */
	resizeGrid: function () {
		setTimeout(function () {
			var y = $("#row-status-box-container").offset().top + $("#row-status-box-container").outerHeight();
			var width = $(window).width();
				
			$("#slick-grid").css({
				top: y + "px",
				width: width + "px"
			});
			
			sulka.grid.resizeCanvas();
		}, 100);
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
		var data = sulka.grid.getData();
	    var cols = args.sortCols;
	    
		data.sort(function (dataRow1, dataRow2) {
			for (var i = 0, l = cols.length; i < l; i++) {
				var field = cols[i].sortCol.field;
				var sign = cols[i].sortAsc ? 1 : -1;
				var value1 = dataRow1[field], value2 = dataRow2[field];
				var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
				if (result != 0) {
					return result;
				}
		    }
		    return 0;
		});
		sulka.grid.invalidate();
	},
	
	
	onPasteCells: function(event, args){
		  sulka.copyManager.onPasteCells.subscribe(function (e, args) {
	      if (args.from.length !== 1 || args.to.length !== 1) {
	        throw "This implementation only supports single range copy and paste operations";
	      }
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
	      grid.render();
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
	
	columnGroupsDiv: null,
	/**
	 * Called once at start to initialize column group rendering after columns have been
	 * fetched.
	 */
	initColumnGroups: function () {
		sulka.columnGroupsDiv = $(
			'<div></div>'
		).addClass(
			'column-group-headers'
		).insertBefore(
			'#slick-grid div.slick-header div.slick-header-columns:first-child'
		);
		sulka.helpers.disableSelection(sulka.columnGroupsDiv);
		sulka.grid.onColumnsResized.subscribe(sulka.renderColumnGroups);
		sulka.grid.onColumnsReordered.subscribe(sulka.renderColumnGroups);
		sulka.renderColumnGroups();
	},
	
	COL_GROUP_OUTSIDE_WIDTH: 9,
	/**
	 * Create column group element. 
	 */
	_makeColumnGroup: function (name, description, width) {
		return $(
			'<div></div>'
		).addClass(
			'column-group-header'
		).append(
			$(
				'<span></span>'
			).addClass(
				'column-group-name'
			).text(
				description
			).attr(
				"title",
				description
			)
		).css(
				"width",
				(width - sulka.COL_GROUP_OUTSIDE_WIDTH) + "px"
		).data(
			"sulka.group.id",
			name
		);
	},
	
	SLICK_WIDTH_ADJUST: -1000,
	/**
	 * Called whenever column groups need to be re-rendered.
	 */
	renderColumnGroups: function () {
		var columns = sulka.grid.getColumns(),
			groupDivs = [];
		
		var currentGroup = null,
			currentGroupWidth = 0;
		
		$.each(columns, function () {
			if (currentGroup === this.$sulkaGroup) {
				currentGroupWidth += this.width;
			} else {
				if (currentGroup !== null) {
					groupDivs.push(sulka._makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
				}
				currentGroup = this.$sulkaGroup;
				currentGroupWidth = this.width;
			}
		});
		if (currentGroup !== null) {
			groupDivs.push(sulka._makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
		}
		
		sulka.columnGroupsDiv.empty().css(
			"width",
			($(".slick-header-columns").width() + sulka.SLICK_WIDTH_ADJUST) + "px" 
		).append(
			groupDivs
		);
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
			sulka.grid.setData([]);
			sulka.grid.render();
			return;
		}
		
		sulka.helpers.unsetErrorAndShowLoader();
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
				sulka.grid.setData(rows);
				sulka.grid.render();
			},
			sulka.helpers.hideLoaderAndSetError
		);
	},
	
	onAddNewRow: function(event, args){
			var data = sulka.grid.getData();
	        var item = args.item;
	        var column = args.column;
	        sulka.grid.invalidateRow(data.length);
	        data.push(item);
	        sulka.grid.updateRowCount();
	        sulka.grid.render();
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
	
	validate: function() {
		var selectedRows = sulka.grid.getSelectedRows();
		if (selectedRows.length == 0) return;
		console.log(selectedRows[0]);
		sulka.helpers.unsetErrorAndShowLoader();
		var selectedRow = sulka.grid.getData()[selectedRows[0]];
		sulka.API.validate(
			selectedRow, 
			function (data) {
				sulka.helpers.hideLoaderAndUnsetError();
				
				if (data.passes){
					sulka.helpers.hideLoaderAndSetError('Rivi on validi');
				} else {
					var errorString = "RIVI EI OLE VALIDI: ";
					for (var errorField in data.errors) if (data.errors.hasOwnProperty(errorField)) {
						var errorArray = data.errors[errorField];
						console.log("field", errorField, "errorArray", errorArray);
						errorString = errorString.concat('(' + errorField + ': ' + errorArray[0].errorName + '), ');
					}
					sulka.helpers.hideLoaderAndSetError(errorString);
				}
			}, 
			sulka.helpers.hideLoaderAndSetError
		);
	}
	
	
};


return sulka; }();

/* Launch sulka.init() on DOM complete */
$(sulka.init);
