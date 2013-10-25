const correctColumnCount = 33;
const wantedColumns = ["Rengas", "Nimirengas", "Laji", "Rengastaja", "Pvm", "Klo", "Kunta", "Paikka", "Pyyntitapa", "Toimet", "Ikä", "Peruste", "Sukupuoli", "Määritystapa", "Paino", "Siipi", "Mittaustapa", "Poikueen nro", "Poikasia", "Ikä", "Tarkkuus" ];
/* Columns to be added: birdStation, kkj_ddmm_lat, kkj_ddmm_lon, kkj_decimal_lat, kkj_decimal_lon, birdCondition*/


casper.test.begin('SlickGrid tests', 14, function suite(test) {
    browse('/', function browseToSlickPage() {
    	var oldData = null;
    	
		casper.then(function () {
			test.assertHttpStatus(200, "HTTP status is OK");
		}).then(function () {
	        test.assertTitle("Sulka", "Title is 'Sulka'");
		}).then(function () {
			var grid = this.getGlobal('grid');
			test.assertNotEquals(grid, null, "SlickGrid -grid is not null");
	    }).then(function () {
			test.assertNotEquals(get("sulka.grid.getColumns()"), null, "Column variable is not null.");
		}).then(function () {
			test.assert(
					get("sulka.grid.getColumns()").length >= correctColumnCount, 
					"Grid has at least " + correctColumnCount + " columns.");
		}).then(function testThatGridHasCorrectColumns() {
			var columns = get("sulka.grid.getColumns()");
	
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
			test.assertEquals(get("sulka.grid.getDataLength()"), 0, "Grid is empty after init.");
			
		}).then(function () {
			// Fill form
			oldData = get("sulka.grid.getData()");
			this.fill('form[id="filters"]', { municipality: 'VANTAA', }, true);
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			var newData = get("sulka.grid.getData()");
			test.assertNotEquals(oldData, newData, "SlickGrid has been updated.");
			oldData = newData;
			
		}).then(function () {
			this.fill('form[id="filters"]', { municipality: 'Hauho', species: 'BUBBUB'}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function () {
			var newData = get("sulka.grid.getData()");
			test.assertNotEquals(oldData, newData, "SlickGrid has been updated.");
			oldData = newData;
			
		}).then(function () {
			this.fill('form[id="filters"]', { municipality: 'Hauho', date: '2001'}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function () {
			var newData = get("sulka.grid.getData()");
			test.assertNotEquals(oldData, newData, "SlickGrid has been updated.");
			oldData = newData;
			
		}).then(function () {
			this.click('input#form-reset');	
			this.fill('form[id="filters"]', { municipality: 'Luopio', species: 'BUBBUB'}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(get("sulka.grid.getDataLength()"), 7, "Both ringings and recoveries are fetched" +
					" when radio buttons 'ringings' and 'recoveries' aren't checked");
		
	    }).then(function () {
			this.click('input#form-reset');	
			this.fill('form[id="filters"]', { municipality: 'Luopio', species: 'BUBBUB', ringings: true, recoveries: false}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(get("sulka.grid.getDataLength()"), 6, "Only ringings are fetched" +
					" when radio button 'ringings' is checked");
		
		}).then(function () {
			this.click('input#form-reset');	
			this.fill('form[id="filters"]', { municipality: 'Luopio', species: 'BUBBUB', recoveries: true, ringings: false}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(get("sulka.grid.getDataLength()"), 1, "Only recoveries are fetched" +
					" when radio button 'recoveries' is checked");
		
		}).then(function () {
			this.click('input#form-reset');	
			this.fill('form[id="filters"]', { municipality: 'Luopio', species: 'BUBBUB',
				ringings: true, recoveries: true}, true);
		}).waitWhileVisible("#loader-animation")
		.then(function() {
			test.assertEquals(get("sulka.grid.getDataLength()"), 7, "Both ringings and recoveries are fetched" +
					" when radio buttons 'ringings' and 'recoveries' are checked");
	    });
		
		
    });
    
    casper.run(function () {
        test.done();
    });
});
