casper.test.begin('Column picker tests', 3, function suite(test) {
    browse('/', function () {
    	var previousColsLength = 0;
    	
		casper.then(function () {
			this.click('#browse-tab');
			
		}).then(function () {
			previousColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
		    	var fakeEvent = {pageX: 0, pageY: 0, preventDefault: function () {}};
		    	var fakeArgs = {column: { id: "common"} };
				sulka.columnHeaderContextMenu.call(cols[0], fakeEvent, fakeArgs);
				return cols.length;
			});
			
		}).then(function () {
			test.assertVisible("#header-context-menu", "Context menu is shown");
			
		}).thenClick("#header-context-menu .context-menu-item", function () {
			var currentColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
				return cols.length;
			});
			test.assertEquals(currentColsLength, previousColsLength - 1, "Clicking on context menu item hides one column");
			previousColsLength = currentColsLength;
			
		}).thenClick("#header-context-menu .context-menu-item", function () {
			var currentColsLength = casper.evaluate(function () {
				var cols = $("#slick-grid .slick-header-column");
				return cols.length;
			});
			test.assertEquals(currentColsLength, previousColsLength + 1, "Re-clicking on context menu item re-shows one column");
			previousColsLength = currentColsLength;
		}).then(function () {
			casper.test.begin("Column hiding tests", previousColsLength + 3, function () {
				var currentTicks = casper.evaluate(function () {
					return $("#header-context-menu .context-menu-item .context-menu-tick").filter(function () {
						return $(this).text().trim() != ""; 
					}).length;
				});
				test.assertEquals(currentTicks, previousColsLength, "All columns are ticked.");
				
				var currentColsLength;
				while (previousColsLength > 1) {
					casper.evaluate(function () {
						var ticked = $("#header-context-menu .context-menu-item .context-menu-tick").filter(function () {
							return $(this).text().trim() != ""; 
						});
						ticked.first().parent().click();
					});
					
					currentColsLength = casper.evaluate(function () {
						var cols = $("#slick-grid .slick-header-column");
						return cols.length;
					});
					
					test.assertEquals(currentColsLength, previousColsLength - 1, "Clicking on context menu item hides column");
					previousColsLength = currentColsLength;
				}
				
				test.assertEquals(previousColsLength, 1, "Only one column is shown"); 
				
				casper.evaluate(function () {
					var ticked = $("#header-context-menu .context-menu-item .context-menu-tick").filter(function () {
						return $(this).text().trim() != ""; 
					});
					ticked.first().parent().click();
				});
				
				test.assertEquals(previousColsLength, 1, "Last column can not be hidden.");
				
				var remainingTicks = casper.evaluate(function () {
					return $("#header-context-menu .context-menu-item .context-menu-tick").filter(function () {
						return $(this).text().trim() != ""; 
					}).length;
				});
				test.assertEquals(remainingTicks, 1, "Last column is still ticked.");
				
				test.done();
			}); 
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});