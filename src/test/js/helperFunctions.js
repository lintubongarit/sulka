casper.test.begin('HelperFunctionTests', 1, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
	
	browse('/slick', function browseToSlickPage() {
    	;
    });

	casper.then(function fourDigitYearNumberIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("2009");
		});
		test.assertEquals(parsedDate,
						{startDate: '1.1.2009', endDate: '31.12.2009'}, 
						"Four digit year number is correctly parsed.");
	});
	
	casper.run(function () {
        test.done();
    });
});