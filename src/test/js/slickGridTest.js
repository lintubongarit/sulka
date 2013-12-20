const correctColumnCount = 33;
const wantedColumns = ["Rengas", "Nimirengas", "Laji", "Rengastaja", "Pvm", "Klo", "Kunta", "Paikka", "Pyyntitapa", "Ikä", "Peruste", "Sukupuoli", "Määritystapa", "Paino", "Siipi", "Mittaustapa", "Poikueen nro", "Poikasia", "Ikä", "Tarkkuus" ];
/* Columns to be added: birdStation, kkj_ddmm_lat, kkj_ddmm_lon, kkj_decimal_lat, kkj_decimal_lon, birdCondition*/


casper.test.begin('SlickGrid tests', 13, function suite(test) {
    browse('/', function browseToSlickPage() {
    	var oldDataLength = null;
    	
    	var getDataLength = function (){
    		return casper.evaluate(function(){
    			return sulka.getData().length;
    		});
    	}
    	
		casper.then(function () {
			test.assertHttpStatus(200, "HTTP status is OK");
		}).then(function () {
			var grid = this.getGlobal('grid');
			test.assertNotEquals(grid, null, "SlickGrid -grid is not null");
	    }).then(function () {
			test.assertEval(function () {
				return sulka.grid.getColumns() !== null;
			}, "Column variable is not null.");
		}).then(function () {
			test.assert(
					get("sulka.grid.getColumns().length") >= correctColumnCount, 
					"Grid has at least " + correctColumnCount + " columns.");
		}).then(function () {
			var columns = casper.evaluate(function () {
				return sulka.grid.getColumns().map(function (column) {
					var clone = $.extend({}, column);
					// Delete $sulkaGroup since it's cyclic and can not be serialized to the CasperJS host
					delete clone.$sulkaGroup;
					return clone;
				});
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
		}).then(function testThatGridDataIsEmptyAfterInit() {
			test.assertEquals(getDataLength(), 0, "Grid is empty after init.");
		}).then(function () {
			// Fill form
			oldDataLength = getDataLength();
			this.fill('form[id="filters"]', { municipality: 'VANTAA'}, true);
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			var newDataLength = getDataLength();
			test.assertNotEquals(oldDataLength, newDataLength, "SlickGrid has been updated after entering municipality.");
			oldDataLength = newDataLength;
		}).then(function () {
			this.fill('form[id="filters"]', { municipality: 'Hauho'}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			this.fill('form[id="filters"]', { species: 'BUBBUB'}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			var newDataLength = getDataLength();
			test.assertNotEquals(oldDataLength, newDataLength, "SlickGrid has been updated after entering new municipality and species.");
			oldDataLength = newDataLength;
		}).then(function () {
			this.fill('form[id="filters"]', { date: '2001'}, true);
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			var newDataLength = getDataLength();
			test.assertNotEquals(oldDataLength, newDataLength, "SlickGrid has been updated after entering municipality, species and date.");
		}).then(function() {
			this.click('input#form-reset');
			this.fill('form[id="filters"]', { municipality: 'Luopio'}, false);
		}).waitWhileVisible('#loader-animation'
		).then(function(){
			this.fill('form[id="filters"]', { species: 'BUBBUB'}, false);
		}).waitWhileVisible('#loader-animation'
		).then(function(){
			this.fill('form[id="filters"]', { ringings: false}, false);
		}).waitWhileVisible('#loader-animation'
		).then(function(){
			this.fill('form[id="filters"]', { recoveries: false}, false);
		}).waitWhileVisible('#loader-animation'
		).then(function() {
			test.assertEquals(getDataLength(), 7, "Both ringings and recoveries are fetched when radio buttons 'ringings' and 'recoveries' aren't checked");
	    }).then(function () {
			this.fill('form[id="filters"]', { ringings: true,}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			test.assertEquals(getDataLength(), 6, "Only ringings are fetched when radio button 'ringings' is checked");
		}).then(function () {
			this.fill('form[id="filters"]', { ringings: false}, false);
		}).waitWhileVisible('#loader-animation'
		).then(function(){
			this.fill('form[id="filters"]', { recoveries: true}, false);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(getDataLength(), 1, "Only recoveries are fetched when radio button 'recoveries' is checked");
		}).then(function () {
			this.fill('form[id="filters"]', { ringings: true}, false);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(getDataLength(), 7, "Both ringings and recoveries are fetched" +
					" when radio buttons 'ringings' and 'recoveries' are checked");
	    });
    });
    
    casper.run(function () {
        test.done();
    });
});
