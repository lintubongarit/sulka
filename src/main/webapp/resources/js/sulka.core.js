var sulka = function (sulka) {
/**
 * The main application container.
 */
sulka = {
	grid: null,
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: true
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
					$headerContextMenu.append(
						$("<li></li>")
							.addClass("context-menu-title")
							.text(group.description)
					);
					$.each(this.fields, function () {
						var column = {
							id: group.name + "/" + this.field,
							field: this.field,
							name: this.name,
							toolTip: this.description,
							$sulkaGroup: group,
							$sulkaVisible: true
						};
						columns.push(column);
						$headerContextMenu.append(
								$("<li></li>")
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
									.data("column", column)
						);
					});
				});
				sulka.columns = columns;
				sulka.grid = new Slick.Grid("#slick-grid", [], sulka.getVisibleColumns(), sulka.gridOptions);
				sulka.initColumnGroups();
				sulka.grid.onHeaderContextMenu.subscribe(sulka.columnHeaderContextMenu);
				$headerContextMenu.find("li.context-menu-item").click(sulka.headerContextMenuItemClicked);
				sulka.reloadData();
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
	
	columnHeaderContextMenu: function (event, data) {
		event.preventDefault();
		
		$("#header-context-menu")
			.css("top", event.pageY)
			.css("left", event.pageX)
			.data("column", data.column)
			.show();
		
		$("body").one("click", function () {
			$("#header-context-menu").hide();
		});
	},
	
	headerContextMenuItemClicked: function () {
		var column = $(this).data("column");
		if (column) {
			column.$sulkaVisible = !column.$sulkaVisible;
			sulka.grid.setColumns(sulka.getVisibleColumns());
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
	_makeColumnGroup: function (description, width) {
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
		);
	},
	
	SLICK_WIDTH_ADJUST: -1000,
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
					groupDivs.push(sulka._makeColumnGroup(currentGroup.description, currentGroupWidth));
				}
				currentGroup = this.$sulkaGroup;
				currentGroupWidth = this.width;
			}
		});
		if (currentGroup !== null) {
			groupDivs.push(sulka._makeColumnGroup(currentGroup.description, currentGroupWidth));
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
	 * @returns Filter object, or a string if there are parsing
	 * errors. The string describes the error.
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