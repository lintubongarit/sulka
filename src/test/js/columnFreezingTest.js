casper.test.begin('Column freezing tests', 10, function suite(test) {
    browse('/', function () {
    	var firstColumn = null,
    		firstFreezeGridColumn = null;
    	
    	casper
			.then(function () {
				this.click('#browse-tab');
			})
	    	.waitWhileVisible("#loader-animation")
			.then(function () {
				test.assertVisible("#slick-grid .header-freeze-button", "Freeze button is visible");
				test.assertNotVisible("#freeze-grid", "Freeze grid is not visible");
				firstColumn = get('sulka.grid.getColumns()[0].id');
				
				exec('$("#slick-grid .header-freeze-button").click()');
			})
			.then(function () {
				test.assertVisible("#slick-grid .header-freeze-button", "Freeze button is visible");
				test.assertVisible("#freeze-grid .header-unfreeze-button", "Unfreeze button is visible");
				
				firstFreezeGridColumn = get('sulka.freeze.grid.getColumns()[0].id');
				test.assertEquals(firstFreezeGridColumn, firstColumn, "First column is now in freeze grid");
				firstColumn = get('sulka.grid.getColumns()[0].id');
				test.assertNotEquals(firstColumn, firstFreezeGridColumn, "First column is not anymore in main grid");
				
				exec('$("#freeze-grid .header-unfreeze-button").click()');
			})
			.then(function () {
				test.assertVisible("#slick-grid .header-freeze-button", "Freeze button is visible");
				test.assertNotVisible("#freeze-grid", "Freeze grid is not visible");
				
				test.assertEquals(get('sulka.grid.getColumns()[0].id'), firstFreezeGridColumn, "Frozen column is back in main grid");
				test.assertEquals(get('sulka.grid.getColumns()[1].id'), firstColumn, "Previous first column has moved back");
			});
    });
    
    casper.run(function () {
        test.done();
   	});
});
