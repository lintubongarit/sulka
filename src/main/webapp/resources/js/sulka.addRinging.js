sulka.addRingings = function (addRingings) {
	
	sulka.getRowMode = function () {
		sulka.rowsMode = "ringings";
	};
	
	sulka.addRow = function () {
		alert('not implemented yet');
	};
	
	sulka.getDate = function () {
		var now = new Date();
		var date =  now.getDate() + '.' + (now.getMonth() + 1) + '.' + (now.getFullYear() - 20) + '-' +
			now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();
		console.log(date);
		return date;
	};
	
}();
