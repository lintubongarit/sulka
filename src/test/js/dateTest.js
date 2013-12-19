casper.test.begin('Date tests', 5, function suite(test) {
    browse('/', function () {
    
		casper.then(function () {
			casper.fill('form#filters', {
				date: 'foobar'
			}, true);
			
		}).then(function () {
			test.assertSelectorHasText("#row-status-error", get("sulka.strings.invalidDate"), 
					"Inputting an invalid date gives the right error.");
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
			
		}).then(function () {
			casper.fill('form#filters', {
				date: '20.1.2009-1.1.2009'
			}, true);
			
    	}).then(function () {
			test.assertSelectorHasText("#row-status-error", get("sulka.strings.inverseDateRange"), 
				"Inputting an inverse date range gives the right error.");
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
			
    	}).then(function() {
			casper.fill('form#filters', {
				date: '2.7.2006'
			}, true);
			test.assertVisible('#loader-animation', "Submitting valid query causes spinner to show.");
		});
	
    });
	
    casper.run(function () {
        test.done();
   	});
});
