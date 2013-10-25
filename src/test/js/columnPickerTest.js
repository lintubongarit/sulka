casper.test.begin('Column picker tests', 3, function suite(test) {
    browse('/', function () {
    	var previousColsLength = 0;
		casper.then(function () {
			this.click('input#browsing');
			
		}).then(function () {
			previousColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
				sulka.columnHeaderContextMenu.call(cols[0], {pageX: 0, pageY: 0, preventDefault: function () {}});
				return cols.length;
			});
			
		}).then(function () {
			test.assertVisible("#header-context-menu", "Context menu is shown");
			
		}).thenClick("#header-context-menu .context-menu-item", function () {
			var currentColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
				return cols.length;
			});
			test.assertTrue(currentColsLength + 1 == previousColsLength, "Clicking on context menu item hides one column");
			previousColsLength = currentColsLength;
			
		}).thenClick("#header-context-menu .context-menu-item", function () {
			var currentColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
				return cols.length;
			});
			test.assertTrue(currentColsLength == previousColsLength + 1, "Re-clicking on context menu item re-shows one column");
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});