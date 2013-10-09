var sulka = {
	fetchFields: function (){
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
