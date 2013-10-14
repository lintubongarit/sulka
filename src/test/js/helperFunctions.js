casper.test.begin('HelperFunctionTests', 1, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
	
	browse('/slick', function browseToSlickPage() {
    	;
    });

	casper.run(function () {
        test.done();
    });
});