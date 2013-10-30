var moment = require('lib/moment.min.js');

casper.test.begin('AddRinger pages form tests', 11, function suite(test) {
    browse('/', function () {
    	// Data loading and filtering
		
		casper.then(function () {
			this.click('#add-ringings-tab');
			
		}).then(function () {
			test.assertExists('form#filters', 'addRingings-page has a form with name "filters".');
			
		}).then(function () {
			this.fill('form#filters', { species: 'SYLCOM'}, false);
			test.assertField('species', 'SYLCOM', "Species field exists");
			
		}).then(function () {
				this.fill('form#filters', { municipality: 'LUOPIO'}, false);
				test.assertField('municipality', 'LUOPIO', "Municipality field exists");
			
		}).then(function () {
			var now = moment();
			var lastYear = now.clone().subtract("years", 1);
			var dateFmt = "DD.MM.YYYY";
			var dateSearch = lastYear.format(dateFmt) + "-" + now.format(dateFmt); 
			
			test.assertField('date', dateSearch, "Date search is by default the last 12 months");
		
		}).then(function (){
			this.test.assertExists('form#filters input#form-reset[type=reset][value=Tyhjennä]',
				'The "Tyhjennä" filter button exists.');
			
		}).then(function (){
			this.test.assertExists('form#filters input#form-submit[type=submit][value=OK]', 
				'The "OK" filter button exists.');
			
		}).then(function (){
			this.fill('form#filters', {
				species: 'ABCD',
				municipality: 'Kerava'
			}, false);
			this.click('input#form-reset');	
			formValues = this.getFormValues('form#filters');
			for (var filter in formValues) if (formValues.hasOwnProperty(filter)) {
				test.assertEquals(formValues[filter], "", 'The "' + filter + ' field is cleared.'); 
			}
			test.assertNotVisible('#loader-animation', "Loader animation is not shown.");
		
		}).then(function (){
			this.test.assertExists('button#validate', 
			'The "validate" button exists.');
		});
		
		

	    });
		
    casper.run(function () {
        test.done();
   	});
});
