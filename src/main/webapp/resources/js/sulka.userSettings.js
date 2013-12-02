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
			 *  - Freezed columns
			 * 
			 */
			save: function() {
				sulka.helpers.showLoader();
				var columnsSettings = {};
				for(var i in sulka.columns){
					var currentColumn = [ // [position, width, visibility]
							i,
							sulka.columns[i].width,
							sulka.columns[i].$sulkaVisible,
					];
					columnsSettings[sulka.columns[i].field] = currentColumn;
				}
				
				var freezedCount = 0;
				if(sulka.freeze.grid != null)
					freezedCount = sulka.freeze.grid.getColumns().length;
				
				var columnsData = {
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
						columns: JSON.stringify(columnsData),
						filters: JSON.stringify(filters),
				};
				sulka.API.saveSettings(sulka.viewMode, settings,
					function onSuccess() {
						sulka.helpers.hideLoader();
					}, function onError(){
						sulka.helpers.hideLoaderAndSetError(sulka.strings.settingsSaveFailed);
					}
				);
			},
			
			
			/**
			 * Restore previously saved settings from SulkaDB.
			 */
			restore: function() {
				sulka.helpers.showLoader();
				sulka.API.fetchSettings(
					sulka.viewMode,
					function onSuccess(results){
						sulka.helpers.hideLoader();
						
						if(results.object.columns){
							if(sulka.viewMode == "browsing" && sulka.freeze.grid != null){
								// Unfreeze freezed columns before editing. 
								var freezedColumnCount = sulka.freeze.grid.getColumns().length;
								for(; freezedColumnCount > 0; freezedColumnCount--)
									sulka.freeze.unfreezeRightColumn();
							}
							var settings = jQuery.parseJSON(results.object.columns);
							var newColumnData = settings.columns;
							var oldColumns = sulka.columns;
							var updatedColumns = [];
							for (var index=0; index<oldColumns.length; index++) {
								var oldColumn = oldColumns[index];
								// Data is in following format:
								// "columnName": [position, width, visibility]
								oldColumn.width = newColumnData[oldColumn.field][1];
								oldColumn.$sulkaVisible = newColumnData[oldColumn.field][2];
								updatedColumns[newColumnData[oldColumn.field][0]] = oldColumn;
							}
							sulka.columns = updatedColumns;
							sulka.grid.setColumns(sulka.getVisibleColumns());
							sulka.renderColumnGroups();
							
							if(sulka.viewMode == "browsing"){
								var wantedFreezedColumnCount = settings.freezeCount;
								for(var i = 0; i < wantedFreezedColumnCount; i++){
									sulka.freeze.freezeLeftColumn();
								}
							}
							
							var menuItems = $("#header-context-menu .context-menu-item span");
							for(var i = 0; i < (menuItems.length / 2); i++){
								var tickIndex = 2 * i;
								var itemIndex = 2 * i + 1;
								var columnName = menuItems[itemIndex].innerHTML;
								for(var columnNo in sulka.columns){
									if(sulka.columns[columnNo].name == columnName){
										if(sulka.columns[columnNo].$sulkaVisible)
											menuItems[tickIndex].textContent = sulka.TICK_MARK;
										else
											menuItems[tickIndex].textContent = "";
										break;
									}
								}
							}
						}
						
						if(results.object.freezed){
							var freezedColumnCount = jQuery.parseJSON(results.object.freezed);
							for(var i = 0; i < freezedColumnCount; i++){
								sulka.freeze.freezeLeftColumn();
							}
						}
						
						if(results.object.filters){
							var filters = jQuery.parseJSON(results.object.filters);
							if(filters.date != "")
								$("#filters-date").val(filters.date);
							if(filters.species != "")
								$("#filters-species").val(filters.species);
							if(filters.municipality != "")
								$("#filters-municipality").val(filters.municipality);

							if(sulka.viewMode == "browsing"){
								$("#filters-ringings").prop('checked', filters.ringings);
								$("#filters-recoveries").prop('checked', filters.recoveries);
							}
						}
					}, function onError(){
						sulka.helpers.hideLoaderAndSetError(sulka.strings.settingsReceivedFailed);
					}
				);
			},
			
	};
	return userSettings;
}();
