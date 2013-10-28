sulka.addRecovery = function(addRecovery) {

	sulka.viewMode = "recoveries";
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "recoveries";
	};

	sulka.addRow = function() {
		var data = sulka.grid.getData();
		data.unshift({});
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
