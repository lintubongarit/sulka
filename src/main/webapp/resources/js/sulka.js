var sulka = {
	fetchFields: function (){
		var fetchedFields = new Array();
		$.getJSON("api/fields/groups", function(json){
			$.each(json.objects, function(index, fieldGroup){
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
		});
		return fetchedFields;
	}
};
