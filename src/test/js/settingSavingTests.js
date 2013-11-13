casper.test.begin('Setting saving tests', 3, function suite(test) {
    browse('/', function () {
    	
    	casper.then(function () {
    		casper.evaluate(function() {
    			sulka.onColumnChange();
    		});
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertEquals(returnValue, "Asetukset tallennettu.", "Saving columns won't fail.");
		}).then(function(){
			casper.evaluate(function() {
				sulka.onColumnChange();
				var gridColumns = sulka.grid.getColumns();
				gridColumns[1].width = 700;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				return gridColumns[1].width;
			});
			test.assertNotEquals(columnWidth, 700, "Column width is changed back to original with fetchSettings().");
		}).then(function() {
			casper.evaluate(function() {
				sulka.onColumnChange();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function() {
			var columnName = casper.evaluate(function() {
				var sulkaColumns = sulka.grid.getColumns();
				return sulkaColumns[0].field;
			});
			test.assertEquals(columnName, "type", "Changed column order is restored back with fetchSettings().");
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});