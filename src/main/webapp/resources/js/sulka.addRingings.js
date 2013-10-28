sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "ringings";
	};

	sulka.addRow = function() {
		var data = sulka.grid.getData();
		data.unshift({});
		sulka.grid.setData(data);
		sulka.grid.updateRowCount();
		sulka.grid.render();
	};
	
	sulka.validate = function() {
		console.log(sulka.grid.getSelectedRows());
		//sulka.API.validate(sulka.grid.getSelectedRow());
	};

}();

$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});