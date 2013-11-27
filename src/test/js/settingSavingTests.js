casper.test.begin('Setting saving tests', 23, function suite(test) {
    browse('/', function () {
    	
    	casper.then(function () {
    		casper.evaluate(function() {
    			sulka.saveSettings();
    		});
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in browsing -mode.");
		}).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 555;
				sulka.grid.setColumns(gridColumns);
				sulka.saveSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				return gridColumns[2].width;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in browsing -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.saveSettings();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function() {
			var columnName = casper.evaluate(function() {
				var sulkaColumns = sulka.grid.getColumns();
				return sulkaColumns[0].field;
			});
			test.assertEquals(columnName, "type", "Changed column order is restored in browsing -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA',
				ringings: false,
				recoveries: true
				}, true);
			casper.evaluate(function() {
				sulka.saveSettings();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: '',
				ringings: true,
				recoveries: false
				}, false);
		}).waitWhileVisible("loader-animation"
		).then(function() {
			casper.evaluate(function() {
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in browsing -mode..");
			test.assertField('species', 'BUBBUB', "Species is restored in browsing -mode..");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in browsing -mode..");
			test.assertField('ringings', false, "Ringings is restored in browsing -mode..");
			test.assertField('recoveries', true, "Recoveries is restored in browsing -mode..");
		}).then(function(){
			casper.evaluate(function(){
				sulka.columns[4].$sulkaVisible = false;
				sulka.grid.setColumns(sulka.getVisibleColumns());
				sulka.saveSettings();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in browsing -mode.");
		}).then(function () {
			this.click('#add-ringings-tab');
		}).then(function () {
    		casper.evaluate(function() {
    			sulka.saveSettings();
    		});
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in addRingings -mode.");
		}).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 555;
				sulka.grid.setColumns(gridColumns);
				sulka.saveSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				return gridColumns[2].width;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in addRingings -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.saveSettings();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function() {
			var columnName = casper.evaluate(function() {
				var sulkaColumns = sulka.grid.getColumns();
				return sulkaColumns[0].field;
			});
			test.assertEquals(columnName, "ring", "Changed column order is restored in addRingings -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA'
				}, true);
			casper.evaluate(function() {
				sulka.saveSettings();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("loader-animation"
		).then(function() {
			casper.evaluate(function() {
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in addRingings -mode.");
			test.assertField('species', 'BUBBUB', "Species is restored in addRingings -mode.");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in addRingings -mode.");
		}).then(function(){
			casper.evaluate(function(){
				sulka.columns[4].$sulkaVisible = false;
				sulka.grid.setColumns(sulka.getVisibleColumns());
				sulka.saveSettings();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in addRingings -mode.");
		}).then(function () {
			this.click('#add-recoveries-tab');
		}).then(function () {
    		casper.evaluate(function() {
    			sulka.saveSettings();
    		});
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in addRecoveries -mode.");
		}).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 555;
				sulka.grid.setColumns(gridColumns);
				sulka.saveSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				return gridColumns[2].width;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in addRecoveries -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.saveSettings();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function() {
			var columnName = casper.evaluate(function() {
				var sulkaColumns = sulka.grid.getColumns();
				return sulkaColumns[0].field;
			});
			test.assertEquals(columnName, "ring", "Changed column order is restored in addRecoveries -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA'
				}, true);
			casper.evaluate(function() {
				sulka.saveSettings();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("loader-animation"
		).then(function() {
			casper.evaluate(function() {
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in addRecoveries -mode.");
			test.assertField('species', 'BUBBUB', "Species is restored in addRecoveries -mode.");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in addRecoveries -mode.");
		}).then(function(){
			casper.evaluate(function(){
				sulka.columns[4].$sulkaVisible = false;
				sulka.grid.setColumns(sulka.getVisibleColumns());
				sulka.saveSettings();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.fetchSettings();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in addRecoveries -mode.");
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});