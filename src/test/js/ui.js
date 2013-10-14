casper.test.begin('Uitests', 13, function suite(test) {
	casper.options.timeout = 600000;
	casper.options.logLevel = "debug";
	casper.options.verbose = true;
    browse('/slick', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Sulka", "Title is 'Sulka'");
    });
	
	casper.then(function filtersFormExists() {
		test.assertExists('form[id="filters"]', 'Slick-page has a form with name "filters".');
	});

	casper.then(function ringerFieldExists() {
		this.fill('form[id="filters"]', { ringer: '846' }, false);
		test.assertField('ringer', '846');
	});

	casper.then(function yearFieldExists() {
		this.fill('form[id="filters"]', { year: '1990'}, false);
		test.assertField('year', '1990');
	});

	casper.then(function speciesFieldExists() {
		this.fill('form[id="filters"]', { species: 'SYLCOM'}, false);
		test.assertField('species', 'SYLCOM');
	});

	casper.then(function municipalityFieldExists() {
		this.fill('form[id="filters"]', { municipality: 'HAUHO'}, false);
		test.assertField('municipality', 'HAUHO');
	});
	
	casper.then(function peruutaButtonExists(){
		this.test.assertExists('#tyhjenna', 'The "Tyhjennä" filter button exists.');
	});

	casper.then(function okButtonExists(){
		this.test.assertExists('#ok', 'The "Ok" filter button exists.');
	});

	casper.then(function testTyhjennaButtonClearsFields(){
		this.fill('form[id="filters"]', {
			ringer: '1234',
			year: '12345',
			species: 'ABCD',
			municipality: 'Kerava'
			}, false);
		this.click('button[id="tyhjenna"]');	
		formValues = this.getFormValues('form[id="filters"]');
		for( filter in formValues){
			test.assertEquals(formValues[filter], "", 'The "' + filter + ' field is cleared.'); 	
		}
	});
	
    casper.run(function () {
        test.done();
   	});
});
