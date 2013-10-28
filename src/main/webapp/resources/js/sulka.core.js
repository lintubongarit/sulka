var sulka = function (sulka) {
/**
 * The main application container.
 */
sulka = {
	grid: null,
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: true,
		multiColumnSort: true
	},

	viewMode: "browsing",
	rowsMode: "ringings",
	
	init: function () {
		sulka.initEventHandlers();
		sulka.initGrid();
	},

	initEventHandlers: function () {
		$("#filters").submit(function (event) {
			sulka.helpers.cancelEvent(event);
			sulka.reloadData();
		});
		$("#header-context-menu-show").click(function () {
			sulka.showColumn($("#header-context-menu").data("column"));
		});
		$("#header-context-menu-hide").click(function () {
			sulka.hideColum($("#header-context-menu").data("column"));
		});
	},
	
	fieldGroups: null,
	
	TICK_MARK: "✓",
	
	contextMenuItemById: {}, 
	initGrid: function () {
		sulka.helpers.showLoader();

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
						var id = group.name + "/" + this.field;
						var column = {
							id: id,
							field: this.field,
							name: this.name,
							toolTip: this.description,
							$sulkaGroup: group,
							$sulkaVisible: true,
							width:  ((this.name.toString().length<5)?35:20) + (this.name.toString().length * 9),
							sortable:true					
						};
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
										.text(this.name)
							)
							.data("column", column);
						sulka.contextMenuItemById[id] = contextItem;
						$headerContextMenu.append(contextItem);
					});
				});
				sulka.columns = columns;
				sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);

				sulka.initColumnGroups();
				sulka.grid.onHeaderContextMenu.subscribe(sulka.columnHeaderContextMenu);
				$headerContextMenu.find("li.context-menu-item").click(sulka.headerContextMenuItemClicked);
				sulka.reloadData();
				
				sulka.grid.onSort.subscribe(function (e, args) {
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
					  sulka.grid.render();
				});
			},
			sulka.helpers.hideLoaderAndSetError
		);
	},
	
	
	getVisibleColumns: function () {
		var visible = [];
		$.each(sulka.columns, function () {
			if (this.$sulkaVisible) {
				visible.push(this);
			}
		});
		return visible;
	},
	
	CONTEXT_HEIGHT_ADJUST: 6,
	columnHeaderContextMenu: function (event, args) {
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
			.css("top", event.pageY + "px")
			.css("left", event.pageX + "px")
			.height($(document).height() - event.pageY - sulka.CONTEXT_HEIGHT_ADJUST)
			.show()
			.scrollTop(Math.max(0, $("#header-context-menu").scrollTop() + contextItem.position().top));
	
		$("body").one("click", function () {
			$("#header-context-menu").hide();
		});
	},
	
	headerContextMenuItemClicked: function () {
		var column = $(this).data("column");
		if (column) {
			column.$sulkaVisible = !column.$sulkaVisible;
			sulka.grid.setColumns(sulka.getVisibleColumns());
			sulka.renderColumnGroups();
			$(this).closest("li").find("span.context-menu-tick").text(column.$sulkaVisible ? sulka.TICK_MARK : "");
		}
	},
	
	columnGroupsDiv: null,
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
	renderColumnGroups: function () {
		var columns = sulka.getVisibleColumns(),
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
				sulka.grid.setData(rows);
				sulka.grid.render();
			},
			sulka.helpers.hideLoaderAndSetError
		);
		
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
			date = sulka.getDate();
		
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
	
	getDate: function () {
		return $.trim($("#filters-date").val());
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
	}
};


return sulka; }();


/* Launch sulka.init() on DOM complete */
$(sulka.init);
