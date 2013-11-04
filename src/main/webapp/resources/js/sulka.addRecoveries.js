sulka.addRecovery = function(addRecovery) {

	sulka.viewMode = "recoveries";
	
	sulka.gridOptions.editable = true;
	sulka.gridOptions.enableAddRow = true;
	sulka.gridOptions.autoEdit = false;
	
	sulka.columnOptions.editor = Slick.Editors.Text;
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "recoveries";
	};

	sulka.addRow = function() {
		var data = sulka.grid.getData();
		data.unshift({});
		sulka.setData(data);
		sulka.grid.updateRowCount();
	};
	
}();

$(function () {
	var now = moment();
	var lastYear = now.clone().subtract("years", 1);
	var dateFmt = "DD.MM.YYYY";
	var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
	$("#filters-date").val(dateSearch); 
});
