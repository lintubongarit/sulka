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
	},
	
	initGrid: function () {
		sulka.helpers.showLoader();
		sulka.API.fetchFields(
			sulka.viewMode,
			function (fields) {
				sulka.helpers.hideLoaderAndUnsetError();
				fields = $.map(fields, function (field) {
					var columnHeader = {
						id: field['field'],
						name: field['name'],
						field: field['field']
					};
					return columnHeader;
				});
				sulka.grid = new Slick.Grid("#slick-grid", [], fields, sulka.gridOptions);
				sulka.reloadData();
			},
			sulka.helpers.hideLoaderAndSetError
		);
	},
	
	/**
	 * Reload all data to table, applying new filters etc.
	 */
	reloadData: function () {
		// Grid not yet initialised?
		if (sulka.grid === null) return;
		
		sulka.helpers.unsetErrorAndShowLoader();
		
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
	}
};

return sulka; }();

/* Launch initGrid() on DOM complete */
$(sulka.init);