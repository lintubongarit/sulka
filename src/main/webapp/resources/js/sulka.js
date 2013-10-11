var sulka = {
	grid: null,
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: false
	},
	
	initGrid: function (){
		this.grid = new Slick.Grid(
									"#slick-grid",
									this.fetchRingings({municipality:'ESPOO'}),
									this.fetchFields(),
									this.gridOptions
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
				municipality: form.municipality.value.toUpperCase() //Kannassa nimet isoin kirjaimin
		};
		this.grid.setData(this.fetchRingings(filters));
		this.grid.render();

	}
};
