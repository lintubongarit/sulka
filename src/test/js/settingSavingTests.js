casper.test.begin('Setting saving tests', 1, function suite(test) {
    browse('/', function () {
    	
    	casper.then(function () {
    		casper.evaluate(function() {
    			sulka.onColumnChange();
    		});
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertEquals(returnValue, "Asetukset tallennettu.", "Saving columns won't fail.");
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});