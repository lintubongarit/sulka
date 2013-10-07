casper.test.begin('Uitests', 8, function suite(test) {
	casper.options.timeout = 600000;
	casper.options.logLevel = "debug";
	casper.options.verbose = true;
    	browse('/slick', function () {
        	test.assertHttpStatus(200, "HTTP status is OK");
        	test.assertTitle("Sulka", "Title is 'Sulka'");
    	});
	
	casper.then(function tiedotform() {
		test.assertExists('form[id="tiedot"]', 'Slick-page has a form with name "tiedot"');		
	});

	casper.then(function ringerFieldExists() {
		this.fill('form[id="tiedot"]', { ringer: '846' }, false);
		test.assertField('ringer', '846');	
	});

	casper.then(function yearFieldExists() {
		this.fill('form[id="tiedot"]', { year: '1990'}, false);			
		test.assertField('year', '1990');	
	});

	casper.then(function speciesFieldExists() {
		this.fill('form[id="tiedot"]', { species: 'SYLCOM'}, false);			
		test.assertField('species', 'SYLCOM');	
	});

	casper.then(function stateFieldExists() {
		this.fill('form[id="tiedot"]', { state: 'HAUHO'}, false);			
		test.assertField('state', 'HAUHO');	
	});
	
	casper.then(function peruutaButtonExists(){
		this.test.assertExists('#peru', 'the peruuta filter button exists');
});

    	casper.run(function () {
        	test.done();
   	});
});
