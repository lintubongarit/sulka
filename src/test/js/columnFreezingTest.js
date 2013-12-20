casper.test.begin('Column freezing tests', 19, function suite(test) {
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
			}).wait(100
			).then(function () {
				test.assertVisible("#slick-grid .header-freeze-button", "Freeze button is visible");
				test.assertVisible("#freeze-grid .header-unfreeze-button", "Unfreeze button is visible");
				test.assertVisible("#freeze-grid", "Freeze grid is visible");
				
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
			})
			.then(function () {
				exec('$("#slick-grid .header-freeze-button").click()');
			}).then(function () {
				test.assertVisible("#freeze-grid", "Freeze grid is visible");
				test.assertEquals(get('sulka.getData().length'), get('sulka.freeze.grid.getData().getLength()'), 
						"Freeze grid has same amount of rows as main grid.");
				casper.fill('form#filters', {
					date: '2005',
					ringings: true,
					recoveries: true
				}, true);
				casper.click("#form-submit");
			}).waitWhileVisible("#loader-animation"
    		).wait(100
			).then(function(){
				test.assertTrue(get('sulka.getData().length') >= 5, "There are at least five rows for 2005");
				test.assertEquals(get('sulka.freeze.grid.getData().getLength()'), get('sulka.getData().length'), 
					"Freeze grid has same amount of rows as main grid.");
				
				exec("sulka.grid.setSelectedRows([0, 2, 5])");
				test.assertEquals(get("sulka.grid.getSelectedRows()"), [0,2,5], "Setting selection on main grid worked.");
				test.assertEquals(get("sulka.freeze.grid.getSelectedRows()"), [0,2,5], "Freeze grid reflected main grid selection.");
				
				exec("sulka.freeze.grid.setSelectedRows([1, 3])");
				test.assertEquals(get("sulka.freeze.grid.getSelectedRows()"), [1,3], "Setting selection on freeze grid worked.");
				test.assertEquals(get("sulka.grid.getSelectedRows()"), [1,3], "Main grid reflected freeze grid selection.");
			});
    });
    
    casper.run(function () {
        test.done();
   	});
});
