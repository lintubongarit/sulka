casper.test.begin('Setting saving tests', 25, function suite(test) {
    browse('/', function () {
    	
    	var NORMAL_WIDTH = 50;
    	var NEW_WIDTH = 555;
    	var COLUMN = 2;
    	
    	var previousColumnName = null;
    	
    	var saveSettings = function(){
    		casper.evaluate(function() {
    			sulka.userSettings.save();
    		});
    	};
    	
    	var restoreSettings = function(){
    		casper.evaluate(function() {
    			sulka.userSettings.restore();
    		});
    	};
    	
    	var getColumnWidth = function(column){
    		return casper.evaluate(function(column){
    			var gridColumns = sulka.grid.getColumns();
				return gridColumns[column].width;
    		}, column);
    	};
    	
    	var changeColumnWidth = function(column, width){
    		casper.evaluate(function(column, width) {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[column].width = width;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
			}, column, width);
    	};
    	
    	var setColumnVisibility = function(column, state){
    		casper.evaluate(function(column, state) {
				sulka.columns[column].$sulkaVisible = state;
				sulka.grid.setColumns(sulka.getVisibleColumns());
    		}, column, state);
    	};
    	
    	var getColumnVisibility = function(column){
    		return casper.evaluate(function(column){
    			return sulka.columns[column].$sulkaVisible;
    		}, column);
    	};
    	
    	var changeColumnOrder = function(column, anotherColumn){
    		casper.evaluate(function(column, anotherColumn){
    			var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[column];
				gridColumns[column] = gridColumns[anotherColumn];
				gridColumns[anotherColumn] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.updateOrderToSulkaColumns();
    		}, column, anotherColumn);
    	};
    	
    	var getColumnName = function(column){
    		return casper.evaluate(function(column){
    			var sulkaColumns = sulka.grid.getColumns();
				return sulkaColumns[column].field;
    		}, column);
    	};
    	
    	casper.then(function () {
    		saveSettings();
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in browsing -mode.");
		}).then(function(){
			changeColumnWidth(COLUMN, NEW_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var columnWidth = getColumnWidth(COLUMN);
			test.assertEquals(columnWidth, NEW_WIDTH, "Previously saved column width is restored in browsing -mode.");
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			previousColumnName = getColumnName(COLUMN);
			changeColumnOrder(COLUMN, COLUMN +1);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			var currentColumnName = getColumnName(COLUMN);
			test.assertEquals(currentColumnName, previousColumnName, "Changed column order is restored in browsing -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA',
				ringings: false,
				recoveries: true
				}, true);
			casper.evaluate(function() {
				sulka.userSettings.save();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: '',
				ringings: true,
				recoveries: false
				}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in browsing -mode..");
			test.assertField('species', 'BUBBUB', "Species is restored in browsing -mode..");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in browsing -mode..");
			test.assertField('ringings', false, "Ringings is restored in browsing -mode..");
			test.assertField('recoveries', true, "Recoveries is restored in browsing -mode..");
		}).then(function(){
			setColumnVisibility(COLUMN, false);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var isColumnVisible = getColumnVisibility(COLUMN);
			test.assertTrue(isColumnVisible, "Column visibility status is restored in browsing -mode.");
		}).then(function(){
			for(var i = 0; i < 5; i++){
				casper.evaluate(function(){
					sulka.freeze.freezeLeftColumn();
				});
			}
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			for(var i = 0; i < 5; i++){
				casper.evaluate(function(){
						sulka.freeze.unfreezeRightColumn();
				});
			}
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var freezedColumnCount = casper.evaluate(function(){
				return sulka.freeze.grid.getColumns().length;
			});
			test.assertEquals(freezedColumnCount, 5, "Freezed columns are restored.");
			var count = casper.evaluate(function(){
				return sulka.freeze.grid.getColumns().length;
			});
			for(; count > 0; count--){
				casper.evaluate(function(){
					sulka.freeze.unfreezeRightColumn();
				});
			}
		}).then(function() {
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: '',
				ringings: true,
				recoveries: true
				}, false);
    		saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			this.click('#add-ringings-tab');
		}).then(function () {
    		saveSettings();
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in addRingings -mode.");
		}).then(function(){
			changeColumnWidth(COLUMN, NEW_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var columnWidth = getColumnWidth(COLUMN);
			test.assertEquals(columnWidth, NEW_WIDTH, "Previously saved column width is restored in addRingings -mode.");
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			previousColumnName = getColumnName(COLUMN);
			changeColumnOrder(COLUMN, COLUMN+1);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			var currentColumnName = getColumnName(COLUMN);
			test.assertEquals(currentColumnName, previousColumnName, "Changed column order is restored in addRingings -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA'
				}, true);
			saveSettings();
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in addRingings -mode.");
			test.assertField('species', 'BUBBUB', "Species is restored in addRingings -mode.");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in addRingings -mode.");
		}).then(function(){
			setColumnVisibility(COLUMN, false);
			saveSettings();
			setColumnVisibility(COLUMN, true);
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var isColumnVisible = getColumnVisibility(COLUMN);
			test.assertFalse(isColumnVisible, "Column visibility status is restored in addRingings -mode.");
		}).then(function() {
			var isTickVisible = casper.evaluate(function() {
				var name = sulka.columns[2].name;
				var menuItems = $("#header-context-menu .context-menu-item span");
				for(var i=0; i < sulka.columns.length; i++){
					var tickIndex = 2 * i;
					var itemIndex = 2 * i + 1;
					if(menuItems[itemIndex].innerHTML == name)
						return ! menuItems[tickIndex].textContent == "";
				}
			});
			test.assertFalse(isTickVisible, "Tick is removed from context-menu.");
			setColumnVisibility(COLUMN, true);
			saveSettings();	
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
    		saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function () {
			this.click('#add-recoveries-tab');
		}).then(function () {
    		saveSettings();
    	}).waitWhileVisible("#loader-animation"
		).then(function () {
			var returnValue = casper.evaluate(function() {
				return sulka.helpers.getError();
			});
			test.assertNotEquals(returnValue, "Asetusten tallentaminen epäonnistui.", "Saving columns won't fail in addRecoveries -mode.");
		}).then(function(){
			changeColumnWidth(COLUMN, NEW_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var columnWidth = getColumnWidth(COLUMN);
			test.assertEquals(columnWidth, NEW_WIDTH, "Previously saved column width is restored in addRecoveries -mode.");
			changeColumnWidth(COLUMN, NORMAL_WIDTH);
			saveSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			previousColumnName = getColumnName(COLUMN);
			changeColumnOrder(COLUMN, COLUMN + 1);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			var currentColumnName = getColumnName(COLUMN);
			test.assertEquals(currentColumnName, previousColumnName, "Changed column order is restored in addRecoveries -mode.");
		}).then(function() {
			this.fill('form#filters', {
				date: '1990',
				species: 'BUBBUB',
				municipality: 'VANTAA'
				}, true);
			saveSettings();
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("#loader-animation"
		).then(function() {
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			test.assertField('date', '1990', "Date is restored in addRecoveries -mode.");
			test.assertField('species', 'BUBBUB', "Species is restored in addRecoveries -mode.");
			test.assertField('municipality', 'VANTAA', "Municipality is restored in addRecoveries -mode.");
		}).then(function(){
			setColumnVisibility(COLUMN, false);
			restoreSettings();
		}).waitWhileVisible("#loader-animation"
		).then(function(){
			var isColumnVisible = getColumnVisibility(COLUMN);
			test.assertTrue(isColumnVisible, "Column visibility status is restored in addRecoveries -mode.");
		}).then(function(){
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
    		saveSettings();
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});