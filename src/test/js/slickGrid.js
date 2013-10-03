var jquery = require('../../main/webapp/resources/js/jquery-1.7.min.js');
var jqueryEvent = require('../../main/webapp/resources/js/jquery.event.drag-2.2.js');
var slickCore = require('../../main/webapp/resources/js/slick.core.js');
var slickGrid = require('../../main/webapp/resources/js/slick.grid.js');

casper.test.begin('SlickGrid tests', 3, function suite(test) {
	casper.options.timeout = 600000;
    browse('/slick', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Sulka", "Title is 'Sulka'");
    });

	casper.then(function() {
		var grid = this.getGlobal('grid');
		test.assertNotEquals(grid, null, "SlickGrid -grid is not null");
    });
    
    casper.run(function () {
        test.done();
    });
});
