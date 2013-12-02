sulka.addMode = true;
sulka.gridOptions.editable = true;

sulka.columnOptions.editor = Slick.Editors.Text;

/*
 * Overrides sulka.cores sulka.getRowMode to use always rowsMode defined on this page ("ringings")
 */
sulka.getRowMode = function() {};

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