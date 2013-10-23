var sulka = function (sulka) {
/**
 * The main application container.
 */
sulka = {
	grid: null,
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: false
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
	},
	
	fieldGroups: null,
	initGrid: function () {
		sulka.helpers.showLoader();
		sulka.API.fetchFieldGroups(
			sulka.viewMode,
			function (fieldGroups) {
				sulka.helpers.hideLoaderAndUnsetError();
				
				sulka.fieldGroups = fieldGroups;
				var columns = [];
				$.each(fieldGroups, function () {
					var group = this;
					$.each(this.fields, function () {
						var column = {
							id: group.name + "/" + this.field,
							field: this.field,
							name: this.name,
							toolTip: this.description
						};
						columns.push(column);
					});
				});
				sulka.grid = new Slick.Grid("#slick-grid", [], columns, sulka.gridOptions);
				sulka.initColumnGroups();
				sulka.reloadData();
			},
			sulka.helpers.hideLoaderAndSetError
		);
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
		sulka.grid.onColumnsResized.subscribe(sulka.renderColumnGroups);
		sulka.renderColumnGroups();
	},
	
	COL_GROUP_BORDER_WIDTH: 1,
	renderColumnGroups: function () {
		var columns = sulka.grid.getColumns(),
			totalWidth = 500,
			columnWidths = {};
		
		$.each(columns, function () {
			totalWidth += this.width;
			columnWidths[this.id] = this.width;
		});
		
		var groupDivs = $.map(sulka.fieldGroups, function (group) {
			var groupWidth = 0;
			$.each(group.fields, function () {
				var colWidth = columnWidths[group.name + '/' + this.field];
				groupWidth += colWidth ? colWidth : 0;
			});
			
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
					group.description
				).attr(
					"title",
					group.description
				)
			).css(
					"width",
					(groupWidth - sulka.COL_GROUP_BORDER_WIDTH) + "px"
			);
		});
		
		sulka.columnGroupsDiv.empty().css(
			"width",
			totalWidth + "px"
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