sulka.addMode = true;
sulka.gridOptions.editable = true;

/*
 * Overrides sulka.cores sulka.getRowMode to use always rowsMode defined on this page 
 */
sulka.getRowMode = function() {};

sulka.addCore = function (addCore){
addCore = {
	/**
	 * Set date filter to previous year.
	 */
	setDefaultDateFilter: function () {
		var dateSearch = sulka.addCore.getDefaultDateFilter();
		$("#filters-date").val(dateSearch); 
	},
	
	/**
	 * Get date range from today to one year in past.
	 * 
	 * @returns {String} Date range containing previous year
	 */
	getDefaultDateFilter: function () {
		var now = moment();
		var lastYear = now.clone().subtract("years", 1);
		var dateFmt = "DD.MM.YYYY";
		return lastYear.format(dateFmt) + "-" + now.format(dateFmt);
	}
};
return addCore;
}();
