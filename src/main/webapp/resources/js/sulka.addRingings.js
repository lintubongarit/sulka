sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "ringings";
	};

	sulka.addRow = function() {
		var data = sulka.grid.getData();
		data.unshift({"nameRing": "A 0617342","ring": "A 0617342","eventDate": "51.6.1998","lon": "32904","numberOfYoungs": "5","species": "TURPIL","municipality": "ALAHÄR","type": "Rengastus","id": "A 0617342","ageDeterminationMethod": "V","clutchNumber": "3","ringer": "2574","age": "PP","coordinateType": "ykj","ringEnd": "A 0617346","lat": "70125"});
		sulka.grid.setData(data);
		sulka.grid.updateRowCount();
		sulka.grid.render();
	};
	
	sulka.validate = function() {
		var selectedRow = JSON.stringify( sulka.grid.getData()[ sulka.grid.getSelectedRows() ] );
		var a =sulka.API.validate(selectedRow, sulka.helpers.hideLoaderAndSetError);
		console.log(a);
	};

}();

$(function () {
//	var now = moment();
//	var lastYear = now.clone().subtract("years", 1);
//	var dateFmt = "DD.MM.YYYY";
//	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
//	$("#filters-date").val(dateSearch); 
	$("#filters-date").val('2005'); 
});