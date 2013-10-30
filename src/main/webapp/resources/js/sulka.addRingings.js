sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
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
	
}();

$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});