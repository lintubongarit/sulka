sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
	sulka.addMode = "ringing";
	
	sulka.gridOptions.editable = true;
	sulka.gridOptions.enableAddRow = true;
	sulka.gridOptions.autoEdit = false;
	
	sulka.columnOptions.editor = Slick.Editors.Text;
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "ringings";
	};

	sulka.addInvalidRow = function() {
		var data = sulka.grid.getData();
		data.unshift({"nameRing": "A 0617342","ring": "A 0617342","eventDate": "51.6.1998","lon": "a","numberOfYoungs": "a","species": "TURPIL","municipality": "ALAHÄR","type": "d","id": "A 0617342","ageDeterminationMethod": "V","clutchNumber": "3","ringer": "2574","age": "PP","coordinateType": "ykj","ringEnd": "A 0617346","lat": "70125"});
		sulka.grid.setData(data);
		sulka.grid.updateRowCount();
		sulka.grid.render();
	};
	
	
	
	/**
	 * Reload all data to table, applying new filters etc.
	 */
	sulka.reloadData =  function () {
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
		sulka.API.fetchSulkaDBRows(
				sulka.rowsMode,
				filters,
				function (rows) {
					//console.log(JSON.stringify(rows));
					
					if (rows.length == 0) {
						sulka.helpers.hideLoaderAndSetError(sulka.strings.noResults);
					} else {
						sulka.helpers.hideLoaderAndUnsetError();
					}
					
					if (rows.length > 0) {
						sulka.adjustFlexibleCols(rows);
					}
					
					
					var rivit = [];
					
					for (var i = 0; i < rows.length; i++) {
						rivit.push(JSON.parse(rows[i].row));
					}
					
					
					sulka.setData(rivit);

				},
				sulka.helpers.hideLoaderAndSetError
			);
	};
	
}();




$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});