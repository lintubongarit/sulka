var jquery = require('../../main/webapp/resources/js/jquery-1.7.min.js');
var jqueryEvent = require('../../main/webapp/resources/js/jquery.event.drag-2.2.js');
var slickCore = require('../../main/webapp/resources/js/slick.core.js');
var slickGrid = require('../../main/webapp/resources/js/slick.grid.js');

casper.test.begin('SlickGrid tests', 4, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
    browse('/slick', function () {
    });

	casper.then(function testHTTPStatusIsOk() {
		test.assertHttpStatus(200, "HTTP status is OK");
	});

	casper.then(function testThatTitleIsCorrect() {
        test.assertTitle("Sulka", "Title is 'Sulka'");
	});

	casper.then(function testThatGridVariableIsNotNull() {
		var grid = this.getGlobal('grid');
		test.assertNotEquals(grid, null, "SlickGrid -grid is not null");
    });
    

	casper.then(function testThatColumnVariableIsNotNull() {
		var grid = this.getGlobal('grid');
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.grid.getColumns();
		});
		test.assertNotEquals(columns, null, "Column variable is not null.");
	});

    casper.run(function () {
        test.done();
    });
});
