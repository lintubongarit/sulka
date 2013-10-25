casper.test.begin('Uitests', 32, function suite(test) {
	casper.options.timeout = 600000;
	casper.options.logLevel = "debug";
	casper.options.verbose = true;
	
    browse('/', function () {
    	// Generic
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Sulka", "Title is 'Sulka'");
        
        test.assertTrue(count("#slick-grid .slick-header-column") >= 10, "There are at least ten columns");
        test.assertTrue(count("#slick-grid .column-group-header") >= 3, "There are at least three column groups");
		
    	// Data loading and filtering
		casper.then(function () {
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
		});
		
		casper.then(function () {
			test.assertExists('form#filters', 'Slick-page has a form with name "filters".');
		});
	
		casper.then(function () {
			this.fill('form#filters', { ringer: '846' }, false);
			test.assertField('ringer', '846', "Ringer field exists");
		});
	
		casper.then(function () {
			this.fill('form#filters', { date: '1990'}, false);
			test.assertField('date', '1990', "Date field exists");
		});
	
		casper.then(function () {
			this.fill('form#filters', { species: 'SYLCOM'}, false);
			test.assertField('species', 'SYLCOM', "Species field exists");
		});
	
		casper.then(function () {
			this.fill('form#filters', { ringings: true}, false);
			test.assertField('ringings', true, "Ringings checkbox exists");
		});
		
		casper.then(function () {
			this.fill('form#filters', { recoveries: true}, false);
			test.assertField('recoveries', true, "Recoveries checkbox exists");
		});
		
		casper.then(function (){
			this.test.assertExists('form#filters input#form-reset[type=reset][value=Tyhjennä]',
				'The "Tyhjennä" filter button exists.');
		});
	
		casper.then(function (){
			this.test.assertExists('form#filters input#form-submit[type=submit][value=OK]', 
				'The "OK" filter button exists.');
		});
	
		casper.then(function (){
			this.fill('form#filters', {
				ringer: '1234',
				date: '12345',
				species: 'ABCD',
				municipality: 'Kerava'
			}, false);
			this.click('input#form-reset');	
			formValues = this.getFormValues('form#filters');
			for (var filter in formValues) if (formValues.hasOwnProperty(filter)) {
				if (filter == "ringings" || filter == "recoveries") {
					test.assertEquals(formValues[filter], true, 'The "' + filter + ' field is cleared.'); 
				} else {
				test.assertEquals(formValues[filter], "", 'The "' + filter + ' field is cleared.'); 
				}
			}
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
		});

		casper.then(function () {
			casper.fill('form#filters', {
				date: 'foobar'
			}, true);
		}).then(function () {
			test.assertSelectorHasText("#last-error", get("sulka.strings.invalidDate"), 
					"Inputting an invalid date gives the right error.");
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
		}).then(function () {
			casper.fill('form#filters', {
				date: '20.1.2009-1.1.2009'
			}, true);
    	}).then(function () {
			test.assertSelectorHasText("#last-error", get("sulka.strings.inverseDateRange"), 
				"Inputting an inverse date range gives the right error.");
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
    	}).then(function() {
			casper.fill('form#filters', {
				date: '2.7.2006'
			}, true);
			test.assertVisible('#loader-animation', "Submitting valid query causes spinner to show.");
    	}).then(function () {
			this.click('input#browsing');
    	}).then(function() {
			this.log(this.getCurrentUrl());
			test.assertEquals(this.getCurrentUrl(), URL + "/?", "browsing link works on browsing page");
    	}).then(function () {
			this.click('input#addRinging');
    	}).then(function() {
			this.log(this.getCurrentUrl());
			test.assertEquals(this.getCurrentUrl(), URL + "/addringing?", "addRinging link works on browsing page");
			
		}).then(function () {
			this.click('input#addRinging');
		}).then(function() {
			this.log(this.getCurrentUrl());
			test.assertEquals(this.getCurrentUrl(), URL + "/addringing?", "addRinging link works on addRinging page");
	    }).then(function () {
			this.click('input#browsing');
	    }).then(function() {
			this.log(this.getCurrentUrl());
			test.assertEquals(this.getCurrentUrl(), URL + "/?", "browsing link works on addRinging page");
		});
		
    	// Column hiding/showing
		var previousColsLength = 0;
		casper.then(function () {
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
