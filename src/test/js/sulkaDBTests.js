
var flag = false;

var sulkaRows = [];

casper.test.begin('Sulka-database tests', 1, function suite(test) {
	
	
	browse('/addRingings', function () {
		
		
		var rows = [];

		casper.then(function () {
			
			flag = false;
			
			casper.evaluate(function(){
				
				sulka.viewMode = "ringings";
				
				sulka.rowsMode = "ringings";
				var args = {};
				args.row = 0;
				
				args.item = {};
				args.item.species = 'asd';
				args.item.databaseID = 0;
				args.item.rowStatus = 'inputRow';
				
				var item = args.item;
				
				var data = sulka.grid.getData();
				sulka.grid.invalidateRow(data.length);
		        data.push(item);
		        sulka.grid.updateRowCount();
		        sulka.grid.render();
				sulka.addToSulkaDB(args);
			});
			
			casper.evaluate(function(){
				sulka.API.fetchSulkaDBRows(
						sulka.rowsMode,
						filters,
						function (rows) {
							if (rows.length == 0) {
								sulka.helpers.hideLoaderAndSetError(sulka.strings.noResults);
							} else {
								sulka.helpers.hideLoaderAndUnsetError();
							}

							if (rows.length > 0) {
								sulka.adjustFlexibleCols(rows);
							}

							for (var i = 0; i < rows.length; i++) {
								sulkaRows.push(JSON.parse(rows[i].row));
							}
							flag = true; 
							return sulkaRows;
							sulka.setData(sulka.grid.getData().concat(sulkaRows));
						},
						sulka.helpers.hideLoaderAndSetError
				)
			});
		
		}).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	var data = casper.evaluate(function () {
				return sulka.grid.getData();
	        });
	    	test.assertEquals(data.length, 1, "sulka.API.addToSulkaDB and sulka.API.fetchSulkaDBRows work");
	    });
	});

	casper.run(function () {
		test.done();
	});

});
