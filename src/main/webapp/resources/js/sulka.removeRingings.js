sulka.removeRinging = function(removeRinging) {

	sulka.viewMode = "ringings";
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "ringings";
	};

	sulka.removeRow = function() {
		//grid.invalidateRow();
		
	};

}();

$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});