sulka.API = function(API) {
	/**
	 * API access object.
	 */
	API = {
		/**
		 * Base URL relative to current HTML path.
		 */
		BASE : "api",

		/**
		 * Get fields from the API and call handler with the fetched fields when
		 * done.
		 * 
		 * @param type Either "browsing", "ringings", "recoveries" or "all". Browsing type to return fields for.
		 * @param onSuccess Called on success with an array of field group objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		fetchFieldGroups : function(type, onSuccess, onError) {
			if (type && type.toLowerCase() != "all") {
				type = "/" + type;
			} else {
				type = "";
			}

			$.ajax({
				url : API.BASE + "/fields/groups" + type,
				dataType : 'json',
				success : function(results) {
					if (onSuccess) {
						onSuccess(results.objects);
					}
				},
				error : API._jQueryErrorHandler(onError)
			});
		},

		
		
		/**
		 * Convert coordinates from WGS84 to YKJ coordinate system.
		 * 
		 * @param lon Longitude in WGS84
		 * @param lat Latitude in WGS84
		 * @param onSuccess Called on success with an array of field group objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		convertCoordinate: function(lon,lat,onSuccess, onError){
			$.ajax({
				url : API.BASE + "/coordinate",
				type: "GET",
				data: {lon:lon,lat:lat},
				dataType: "json",
				success : function(results) {
					if (onSuccess) {
						onSuccess(results.object);
					}
				},
				error: onError
			});
		},
		
		
		/**
		 * Get field groups from the API and call handler with the fetched
		 * groups when done.
		 * 
		 * @param type Either "browsing", "ringings", "recoveries" or "all". Browsing type to return fields for.
		 * @param onSuccess Called on success with an array of field objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		fetchFields : function(type, onSuccess, onError) {
			if (type && type.toLowerCase() != "all") {
				type = "/" + type;
			} else {
				type = "";
			}

			$.ajax({
				url : API.BASE + "/fields/all" + type,
				dataType : 'json',
				success : function(results) {
					if (onSuccess) {
						onSuccess(results.objects);
					}
				},
				error : API._jQueryErrorHandler(onError)
			});
		},

		/**
		 * Get rows from the API and call handler with the fetched rows when
		 * done.
		 * 
		 * @param type Either "ringings", "recoveries" or "all". Types of rows to return.
		 * @param filters Object of filter settings.
		 * @param onSuccess Called on success with an array of row objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		fetchRows : function(type, filters, onSuccess, onError) {
			if (type && type.toLowerCase() != "all") {
				type = "/" + type;
			} else {
				type = "";
			}
			
			var filterString = "";
			for ( var filter in filters)
				if (filters.hasOwnProperty(filter)) {
					if (filterString == "") {
						filterString = "?";
					} else {
						filterString += "&";
					}
					filterString += encodeURIComponent(filter) + "="
							+ encodeURIComponent(filters[filter]);
				}

			$.ajax({
				url : API.BASE + "/rows" + type + filterString,
				dataType : 'json',
				success : function(results) {
					if (onSuccess) {
						onSuccess(results.objects);
					}
				},
				error : API._jQueryErrorHandler(onError)
			});
		},
		
		
		/**
		 * 
		 * @param ids List of row ID's to be deleted
		 * @param onSuccess Called on success with an array of row objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		deleteSulkaDBRows: function(ids, onSuccess, onError) {
			var rowsHandled = 0;
			var errors = [];
			var onRowHandled = function (error) {
				rowsHandled++;
				if (error) {
					errors.push(error);
				}
				if (rowsHandled == ids.length) {
					if (errors.length == 0) {
						if (onSuccess) onSuccess();
					} else {
						if (onError) onError(errors.join(", "));
					}
				}
			};
			
			$.each(ids, function () {
				$.ajax({
					url : API.BASE + "/storage/"  + sulka.viewMode + "/" + this,
					dataType : 'json',
					type: "DELETE",
					contentType: "application/json;charset=UTF-8",
					success : function() {
						onRowHandled();
					},
					error: API._jQueryErrorHandler(onRowHandled) 
				});
			});
		},
		
		
		
		
		/**
		 * 
		 * @param type Either "ringings", "recoveries" or "all". Types of rows to return.
		 * @param filters Object of filter settings.
		 * @param onSuccess Called on success with an array of row objects.
		 * @param onError If defined, called on failure with the error message, if any.
		 */
		fetchSulkaDBRows: function(type, filters, onSuccess, onError) {
			if (type && type.toLowerCase() != "all") {
				type = "/" + type;
			} else {
				type = "";
			}
			
			var filterString = "";
			for ( var filter in filters)
				if (filters.hasOwnProperty(filter)) {
					if (filterString == "") {
						filterString = "?";
					} else {
						filterString += "&";
					}
					filterString += encodeURIComponent(filter) + "="
							+ encodeURIComponent(filters[filter]);
				}
			
			
			$.ajax({
				url : API.BASE + "/storage/"  + sulka.viewMode ,
				dataType : 'json',
				type: "GET",
				success : function(results) {
					if (onSuccess) {
						onSuccess(results.objects);
					}
				},
				error : API._jQueryErrorHandler(onError)
			});
		},
		
				
		addRow: function(row, onSuccess, onError) {
			$.ajax({
				url : API.BASE + "/storage/" + sulka.viewMode,
				dataType : "json",
				data: JSON.stringify(row),
				contentType: "application/json;charset=UTF-8",
				type: "POST",
				success: function (data) {
					if (onSuccess) {
						onSuccess(data.object);
					}
				},
				error: onError
			});
		},

		
		/**
		 * Validate a row object through the validation service.  
		 * @param row The data to validate
		 * @param onSuccess Handler for when we get a validation reply (irrespective of if validation was successful).
		 * @param onError Handler for when we have a network error or such and no reply.
		 */
		validate: function(row, onSuccess, onError) {
			$.ajax({
				url : API.BASE + "/validate",
				type: "POST",
				contentType: "application/json",
				dataType : "json",
				data: JSON.stringify(row),
				error : API._jQueryErrorHandler(onError),
				success: onSuccess
			});
		},
		
		/**
		 * Save users settings to database 
		 * @param viewMode Which mode is being saved
		 * @param settings Settings to be saved
		 * @param onSuccess Handler for succesfull POST.
		 * @param onError Handler for failed POST.
		 */
		saveSettings: function(viewMode, settings, onSuccess, onError) {
			$.ajax({
				url: API.BASE  + "/storage/settings/" + viewMode,
				type: "POST",
				contentType: "application/json;charset=UTF-8",
				data: JSON.stringify(settings),
				success: onSuccess,
				error: onError
			});
		},
		
		/**
		 * Get user settings from database
		 * @param viewMode To which mode to get the settings
		 * @param onSuccess Handler for succesfull GET.
		 * @param onError Handler for failed GET.
		 */
		fetchSettings: function(viewMode, onSuccess, onError){
			$.ajax({
				url: API.BASE + "/storage/settings/" + viewMode,
				type: "GET",
				success: onSuccess,
				error: onError
			});
		},
		
		/**
		 * Creates and returns a jQuery AJAX error handler function that will
		 * call the given function with the API's returned error message, or
		 * current HTTP error message, should an error occur.
		 */
		_jQueryErrorHandler: function(errorHandler) {
			if (!errorHandler)
				return undefined;
			return function(jqXHR, textStatus, errorThrown) {
				if (JSON && jqXHR && jqXHR.responseText) {
					var errorJSON = null;
					try {
						errorJSON = JSON.parse(jqXHR.responseText);
					} catch (e) {
						;
					}
					if (errorJSON && errorJSON.error) {
						errorHandler(errorJSON.error);
						return;
					}
				}
				if (errorThrown) {
					errorHandler(errorThrown);
					return;
				}
				errorHandler();
			};
		}
	};
	return API;
}();