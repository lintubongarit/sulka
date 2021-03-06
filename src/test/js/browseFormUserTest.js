casper.test.begin('Browsing pages form tests for user', 14, function suite(test) {
    browse('/', function () {
    	// Data loading and filtering
		
		casper.then(function () {
			test.assertExists('form#filters', 'Browse page has a form with name "filters".');
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
			this.fill('form#filters', { municipality: 'LUOPIO'}, false);
			test.assertField('municipality', 'LUOPIO', "Municipality field exists");
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
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
		});
	});
		
    casper.run(function () {
        test.done();
   	});
});
