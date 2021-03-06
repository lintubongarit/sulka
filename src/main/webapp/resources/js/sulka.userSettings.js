sulka.userSettings = function (userSettings) {
/**
 * UserSettings access object.
 */
userSettings = {
	/**
	 * Save users current settings to SulkaDB. Following settings are 
	 * saved:
	 * 	- Current filters
	 * 	- Columns order
	 *  - Columns width
	 *  - Columns visibility
	 *  - Freezed column count
	 */
	save: function() {
		sulka.statusBar.showLoader();
		var columnsSettings = {};
		sulka.columns.forEach(function (column, i) {
			var currentColumn = [ // [position, width, visibility]
					i,
					column.width,
					column.$sulkaVisible,
			];
			columnsSettings[column.field] = currentColumn;
		});
		
		var freezedCount = 0;
		if (sulka.freeze.grid != null) {
			freezedCount = sulka.freeze.grid.getColumns().length;
		}
		
		var columnsRelatedSettings = {
			columns: columnsSettings,
			freezeCount: freezedCount,
		};
		
		var filters =  {
			date: $("#filters-date").val(),
			species: $("#filters-species").val(),
			municipality: $("#filters-municipality").val(),
			ringings: $("#filters-ringings").prop("checked"),
			recoveries: $("#filters-recoveries").prop("checked"),
		};
		
		var settings = {
			columns: JSON.stringify(columnsRelatedSettings),
			filters: JSON.stringify(filters),
		};
		sulka.API.saveSettings(sulka.viewMode, settings,
			function onSuccess() {
				sulka.statusBar.hideLoader();
			}, 
			function onError() {
				sulka.statusBar.hideLoaderAndSetError(sulka.strings.settingsSaveFailed);
			}
		);
	},
	
	
	/**
	 * Restore previously saved settings from SulkaDB.
	 */
	restore: function () {
		sulka.statusBar.showLoader();
		sulka.API.fetchSettings(
			sulka.viewMode,
			function onSuccess(results) {
				sulka.statusBar.hideLoader();
				
				if (results.object.columns) {
					var columnsRelatedSettings = jQuery.parseJSON(results.object.columns);

					// Unfreeze all columns before restore
					if (sulka.viewMode == "browsing" && sulka.freeze.grid != null) {
						var freezedColumnCount = sulka.freeze.grid.getColumns().length;
						for (; freezedColumnCount > 0; freezedColumnCount--) {
							sulka.freeze.unfreezeRightColumn();
						}
					}
					
					// Restore columns
					var restoredColumnSettings = columnsRelatedSettings.columns;
					var updatedColumns = [];
					for (var i=0; i<sulka.columns.length; i++) {
						var oldColumn = sulka.columns[i];
						var columnSettings = restoredColumnSettings[oldColumn.field];
						// Data format: [position, width, visibility]
						oldColumn.width = columnSettings[1];
						oldColumn.$sulkaVisible = columnSettings[2];
						updatedColumns[columnSettings[0]] = oldColumn;
					}
					sulka.columns = updatedColumns;
					sulka.setColumns(sulka.getVisibleColumns());
					sulka.renderColumnGroups();
					
					if (sulka.viewMode == "browsing") {
						var wantedFreezedColumnCount = columnsRelatedSettings.freezeCount;
						for (var i = 0; i < wantedFreezedColumnCount; i++) {
							sulka.freeze.freezeLeftColumn();
						}
					}
					
					var menuItems = $("#header-context-menu .context-menu-item span");
					for (var i = 0; i < (menuItems.length / 2); i++) {
						var tickIndex = 2 * i;
						var itemIndex = 2 * i + 1;
						var columnName = menuItems[itemIndex].innerHTML;
						for (var column in sulka.columns) if (sulka.columns.hasOwnProperty(column)) {
							if (sulka.columns[column].name == columnName) {
								if (sulka.columns[column].$sulkaVisible) {
									menuItems[tickIndex].textContent = sulka.TICK_MARK;
								}
								else {
									menuItems[tickIndex].textContent = "";
								}
								break;
							}
						}
					}
				}
				
				if (results.object.filters) {
					var filters = jQuery.parseJSON(results.object.filters);
					if (!filters) return;
					
					var changed = false;
					if (typeof(filters.date) === "string") {
						if (sulka.addCore){
							if ($("#filters-date").val() != sulka.addCore.getDefaultDateFilter()
								|| filters.date != "") {
							changed = true;
							$("#filters-date").val(filters.date);
							}
						} else {
							if ($("#filters-date").val() !== filters.date) changed = true;
							$("#filters-date").val(filters.date);
						}
					}
					if (typeof(filters.species) === "string") {
						if ($("#filters-species").val() !== filters.species) changed = true;
						$("#filters-species").val(filters.species);
					}
					if (typeof(filters.municipality) === "string") {
						if ($("#filters-municipality").val() !== filters.municipality) changed = true;
						$("#filters-municipality").val(filters.municipality);
					}

					if (sulka.viewMode === "browsing") {
						if ($("#filters-ringings").prop('checked') !== !!filters.ringings) changed = true;
						$("#filters-ringings").prop('checked', !!filters.ringings);
						if ($("#filters-recoveries").prop('checked') !== !!filters.recoveries) changed = true;
						$("#filters-recoveries").prop('checked', !!filters.recoveries);
					}
					
					if (changed) {
						sulka.reloadData();
					}
				}
			}, 
			function onError() {
				sulka.statusBar.hideLoaderAndSetError(sulka.strings.settingsReceivedFailed);
			}
		);
	},
};
return userSettings;
}();
