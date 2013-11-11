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
		
		
		
		deleteSulkaDBRow: function(object, onSuccess, onError){
			
			$.ajax({
				url : API.BASE + "/storage/"  + sulka.viewMode,
				dataType : 'json',
				type: "DELETE",
				data: JSON.stringify(object),
				contentType: "application/json;charset=UTF-8",
				success : function(results) {
					if (onSuccess) {
						onSuccess();
					};
				},
				error : API._jQueryErrorHandler(onError)
			});
		},
		
		
		fetchSulkaDBRows :function(type, filters, onSuccess, onError) {
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
		
				
		addRow: function(row, slickRowId){
			$.ajax({
				url : API.BASE + "/storage/" + sulka.viewMode,
				dataType : "json",
				data: JSON.stringify(row),
				contentType: "application/json",
				type: "POST",
				success: function(data) {
					sulka.grid.getData()[slickRowId].databaseID = data.object.id;
				},
				error : API._jQueryErrorHandler("Riviä ei voitu lisätä"),
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
		 * Creates and returns a jQuery AJAX error handler function that will
		 * call the given function with the API's returned error message, or
		 * current HTTP error message, should an error occur.
		 */
		_jQueryErrorHandler : function(errorHandler) {
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