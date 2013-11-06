sulka.addCore = function() {
	
	sulka.gridOptions.editable = true;
	sulka.gridOptions.enableAddRow = true;
	
	sulka.columnOptions.editor = Slick.Editors.Text;
	
	/*
	 * Overrides sulka.cores sulka.getRowMode to use always rowsMode defined on this page ("ringings")
	 */
	sulka.getRowMode = function() {
	};
	
	/*
	 * Overrides sulka.cores sulka.fetchRows to fetch ringings from tipu-DB and sulka-DB
	 */
	sulka.fetchRows = function (filters) {
		
		sulka.grid.setData([]);
		
		sulka.API.fetchRows(
			sulka.rowsMode,
			filters,
			function (tipuRows) {
				if (tipuRows.length == 0) {
					sulka.helpers.hideLoaderAndSetError(sulka.strings.noResults);
				} else {
					sulka.helpers.hideLoaderAndUnsetError();
				}
				
				if (tipuRows.length > 0) {
					sulka.adjustFlexibleCols(tipuRows);
				}
				sulka.setData(sulka.grid.getData().concat(tipuRows));
			},
			sulka.helpers.hideLoaderAndSetError
		);
		sulka.API.fetchSulkaDBRows(
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
				
				
				var sulkaRows = [];
				
				for (var i = 0; i < rows.length; i++) {
					sulkaRows.push(JSON.parse(rows[i].row));
				}
				
				sulka.setData(sulka.grid.getData().concat(sulkaRows));
			},
			sulka.helpers.hideLoaderAndSetError
		);
	};
}();

/*
 * Sets the date filter to be the last 12 months
 */
$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});