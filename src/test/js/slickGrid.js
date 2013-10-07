var jquery = require('../../main/webapp/resources/js/jquery-1.7.min.js');
var jqueryEvent = require('../../main/webapp/resources/js/jquery.event.drag-2.2.js');
var slickCore = require('../../main/webapp/resources/js/slick.core.js');
var slickGrid = require('../../main/webapp/resources/js/slick.grid.js');

const correctColumnCount = 33;
const wantedColumns = ["Rengas-", "-rengas", "Vanha rengas", "Laji", "Henkilö", "Pvm", "Tark", "Klo", "Kunta", "Paikka", "YKJ p.", "YKJ i.", "Tyyppi", "Reng.kiinnitys", "Pyyntitap.", "Toimet", "Ikä", "Peruste", "Sukupuoli", "Määritystapa", "Paino", "Siipi", "Mittaustapa", "Poikueen nro", "Poikasia", "Ikä", "Tarkkuus" ];
/* Columns to be added: birdStation, kkj_ddmm_lat, kkj_ddmm_lon, kkj_decimal_lat, kkj_decimal_lon, birdCondition*/

casper.test.begin('SlickGrid tests', 6, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
    casper.start('http://localhost:8080/sulka/slick', function browseToSlickPage() {
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
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.grid.getColumns();
		});
		test.assertNotEquals(columns, null, "Column variable is not null.");
	});

	casper.then(function testThatColumnVariableHasRightAmountOfColumns() {
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.grid.getColumns();
		});
		test.assertEquals(columns.length, correctColumnCount, "Grid has " + correctColumnCount + " columns.");
	});

	casper.then(function testThatGridHasCorrectColumns() {
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.grid.getColumns();
		});

		var allColumnsFound = false;
		for(var i = 0; i < wantedColumns.length; i++){
			var columnHasBeenFound = false;
			allColumnsFound= false;
			for(var j = 0; j < columns.length; j++){
				if(wantedColumns[i] == columns[j]['name']){
					columnHasBeenFound = true;
					break;
				}
			}
			if(columnHasBeenFound == false){
				break;
			}
			allColumnsFound = true;
		}
		test.assertEquals(allColumnsFound, true, "Grid has got all wanted columns.");
	});

    casper.run(function () {
        test.done();
    });
});
