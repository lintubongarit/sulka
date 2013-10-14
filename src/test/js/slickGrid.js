var jquery = require('../../main/webapp/resources/js/jquery-1.7.min.js');
var jqueryEvent = require('../../main/webapp/resources/js/jquery.event.drag-2.2.js');
var slickCore = require('../../main/webapp/resources/js/slick.core.js');
var slickGrid = require('../../main/webapp/resources/js/slick.grid.js');

const correctColumnCount = 33;
const wantedColumns = ["Rengas", "Nimirengas", "Laji", "Rengastaja", "Pvm", "Klo", "Kunta", "Paikka", "Pyyntitapa", "Toimet", "Ikä", "Peruste", "Sukupuoli", "Määritystapa", "Paino", "Siipi", "Mittaustapa", "Poikueen nro", "Poikasia", "Ikä", "Tarkkuus" ];
/* Columns to be added: birdStation, kkj_ddmm_lat, kkj_ddmm_lon, kkj_decimal_lat, kkj_decimal_lon, birdCondition*/


casper.test.begin('SlickGrid tests', 9, function suite(test) {
	casper.options.logLevel = "debug";
	casper.options.verbose =  true;
	casper.options.timeout = 600000;
    browse('/slick', function browseToSlickPage() {
    	;
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
			return window.sulka.grid.getColumns();
		});
		test.assertNotEquals(columns, null, "Column variable is not null.");
	});

	casper.then(function testThatColumnVariableHasRightAmountOfColumns() {
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.sulka.grid.getColumns();
		});
		test.assert(columns.length >= correctColumnCount, "Grid has at least " + correctColumnCount + " columns.");
	});

	casper.then(function testThatGridHasCorrectColumns() {
		var columns = this.evaluate(function getColumnsFromDOM() {
			return window.sulka.grid.getColumns();
		});

		var allColumnsFound = false;
		for(var i = 0; i < wantedColumns.length; i++){
			var columnHasBeenFound = false;
			allColumnsFound= false;
			for(var j = 0; j < columns.length; j++){
				if(wantedColumns[i] == columns[j]['name']){
					columnHasBeenFound = true;
					break;
				};
			}
			if(columnHasBeenFound == false){
				console.warn("Warning: missing column: " + wantedColumns[i]);
				break;
			}
			allColumnsFound = true;
		}
		test.assertEquals(allColumnsFound, true, "Grid has got all wanted columns.");
	});

	casper.then(function testThatGridDataIsEmptyAfterInit() {
		var rowCount = this.evaluate(function getRowCountFromDOM() {
			return window.sulka.grid.getDataLength();
		});
		test.assertEquals(rowCount, 0, "Grid is empty after init.");
	});

	casper.then(function testThatChangedMunicipalityFilterAndOkChangesGridData() {
		var oldData= this.evaluate(function getRowsFromDOM() {
			return window.sulka.grid.getData();
		});
		this.fill('form[id="filters"]', { municipality: 'VANTAA', }, false);
		this.click('button[id="ok"]');
		var newData = this.evaluate(function getRowsFromDOM() {
			return window.sulka.grid.getData();
		}).length;
		test.assertNotEquals(oldData, newData, "SlickGrid has been updated.");
	});

	casper.then(function testThatSpeciesFilterLimitsResults() {
		this.fill('form[id="filters"]', { municipality: 'Hauho', species: 'bubbub'}, false);
		this.click('button[id="ok"]');
		var rowCount = this.evaluate(function getRowCountFromDOM() {
			return window.sulka.grid.getDataLength();
		});
		test.assertTruthy(rowCount > 0, "Species filter works.");
	})
	
    casper.run(function () {
        test.done();
    });
});
