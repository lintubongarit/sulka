var sulka = function (){ var sulka = {
	grid: null,
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: false
	},
	
	initGrid: function (){
		sulka.grid = new Slick.Grid(
									"#slick-grid",
									sulka.fetchRingings({}),
									sulka.fetchFields(),
									sulka.gridOptions
									);
	},
		
	fetchFields: function () {
		var fetchedFields = new Array();
		$.ajax({
			url: "api/fields/groups",
			async: false,
			dataType: 'json',
			success: function(result){
				$.each(result.objects, function(index, fieldGroup){
					fieldsInGroup = fieldGroup['fields'];
					$.each(fieldsInGroup, function(indexB, field){
						var columnHeader = {
							id: field['field'],
							name: field['name'],
							field: field['field']
						};
						fetchedFields.push(columnHeader);
					});
				});
			}
		});
		return fetchedFields;
	},
	
	fetchRingings: function (filters) {
		var rows = new Array();
		var baseAddress = "api/rows/ringings?";
		var filterString = "";
		
		for(var filter in filters){
			if(filterString != ""){
				filterString += "&";
			}
			filterString += filter + "=" + filters[filter];
		}
		
		$.ajax({
			url: baseAddress + filterString,
			async: false,
			dataType: 'json',
			success: function(results){
				rows = rows.concat(results["objects"]);
			}
		});
		return rows;
	},
	
	reloadData: function (form) {
		console.log("Reloading...");
		filters = {
				municipality: form.municipality.value.toUpperCase(), //Kannassa nimet isoin kirjaimin
				species: form.species.value,
				
		};
		var parsedDate = apufunktiot.parseDate(form.year.value);
		for (var attrname in parsedDate) {filters[attrname] = parsedDate[attrname]; }
		sulka.grid.setData(sulka.fetchRingings(filters));
		sulka.grid.render();

	}
}; return sulka; }();

var apufunktiot = function (){ var apufunktiot = {
		parseDate: function (date){
			
			var regAlku = /^/;
			var regLoppu = /$/;
			var exactDate = /[0-3]{0,1}\d.[0-3]{0,1}\d.[1,2][8,9,0]\d{2}/;
			
			var isFourDigitYear = /^\d{4}$/;
			var isExactDate = new RegExp(regAlku.source + exactDate.source + regLoppu.source);
			var isExactDateRange = new RegExp(regAlku.source + exactDate.source + /\s*-\s*/.source + exactDate.source + regLoppu.source);
			
			if(isFourDigitYear.test(date)){
				return { startDate: '1.1.' + date, endDate: '31.12.' + date};
			} else if(isExactDate.test(date)){
				return { startDate: date, endDate: ''};
			} else if(isExactDateRange.test(date)){
				var startDateMatch = (new RegExp(regAlku.source + exactDate.source)).exec(date)[0];
				var endDateMatch = (new RegExp(exactDate.source + regLoppu.source)).exec(date)[0];
				return { startDate: startDateMatch, endDate: endDateMatch};
			}
			return {startDate: "", endDate: ""};
		},
}; return apufunktiot; }();

/* Launch initGrid() on DOM complete */
$(sulka.initGrid);