casper.test.begin('HelperFunctionTests', 5, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
	
	browse('/', function browseToSlickPage() {
    	;
    });

	casper.then(function emptyStringIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("");
		});
		test.assertEquals(parsedDate,
						{startDate: '', endDate: ''}, 
						"Empty string is correctly parsed.");
	});
	
	casper.then(function fourDigitYearNumberIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("2009");
		});
		test.assertEquals(parsedDate,
						{startDate: '1.1.2009', endDate: '31.12.2009'}, 
						"Four digit year number is correctly parsed.");
	});
	
	casper.then(function exactDateIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("04.06.2010");
		});
		test.assertEquals(parsedDate,
						{startDate: '04.06.2010', endDate: ''},
						"Exact date is parsed correctly.");
	});
	
	casper.then(function exactDateWithOneDigitDateAndMonthIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("4.7.2005");
		});
		test.assertEquals(parsedDate,
						{startDate: '4.7.2005', endDate: ''},
						"Exact date with one digit date and month is parsed correctly.");
	});
	
	casper.then(function exactDateRangeIsParsedCorrectly() {
		var parsedDate = this.evaluate(function (){
			return window.apufunktiot.parseDate("3.6.2005 - 5.6.2006");
		});
		test.assertEquals(parsedDate,
						{startDate: '3.6.2005', endDate: '5.6.2006'},
						"Exact date range is parsed correctly.");
	});
	
	casper.run(function () {
        test.done();
    });
});