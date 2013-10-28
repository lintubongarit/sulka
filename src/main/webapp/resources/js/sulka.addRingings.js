sulka.addRinging = function(addRinging) {

	sulka.viewMode = "ringings";
	
	sulka.getRowMode = function() {
		sulka.rowsMode = "ringings";
	};

	sulka.addRow = function() {
		var data = sulka.grid.getData();
		data.unshift({});
		sulka.grid.setData(data);
		sulka.grid.render();
	};

	sulka.getDate = function() {
		var now = new Date();
		var date = now.getDate() + '.' + (now.getMonth() + 1) + '.'
				+ (now.getFullYear() - 11) + '-' + now.getDate() + '.'
				+ (now.getMonth() + 1) + '.' + now.getFullYear();
		console.log(date);
		return date;
	};

}();
