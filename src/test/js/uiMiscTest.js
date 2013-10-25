casper.test.begin('Uitests', 5, function suite(test) {	
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
	
    });
	
    casper.run(function () {
        test.done();
   	});
});
