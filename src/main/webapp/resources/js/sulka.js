var sulka = {
	grid: null,
	gridData: new Array(),
	gridFields: {}, 
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: false
	},
	
	initGrid: function (){
		this.gridFields = this.fetchFields();
		this.grid = new Slick.Grid(
									"#slick-grid",
									this.gridData,
									this.gridFields,
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
	}
};
