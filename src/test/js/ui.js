var jquery = require('../../main/webapp/resources/js/jquery-1.7.min.js');
var jqueryEvent = require('../../main/webapp/resources/js/jquery.event.drag-2.2.js');
var slickCore = require('../../main/webapp/resources/js/slick.core.js');
var slickGrid = require('../../main/webapp/resources/js/slick.grid.js');

casper.test.begin('Uitests', 4, function suite(test) {
	casper.options.timeout = 600000;
    	casper.start('http://localhost:8080/sulka/slick', function () {
        	test.assertHttpStatus(200, "HTTP status is OK");
        	test.assertTitle("Sulka", "Title is 'Sulka'");
    	});
	
	casper.then(function tiedotform() {
		test.assertExists('form[id="tiedot"]', 'Slick-page has a form with name "tiedot"');		
	});
    	casper.run(function () {
        	test.done();
   	});
});
