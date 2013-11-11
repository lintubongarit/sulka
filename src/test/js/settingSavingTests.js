casper.test.begin('Setting saving tests', 2, function suite(test) {
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
				gridColumns = sulka.grid.getColumns();
				return gridColumns[1].width;
			});
			test.assertNotEquals(columnWidth, 700, "Column width is changed back to original with fetchSettings().");
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});