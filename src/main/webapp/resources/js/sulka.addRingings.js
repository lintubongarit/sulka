sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
	sulka.rowsMode = "ringings";
	
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

 