casper.test.begin('Setting saving tests', 25, function suite(test) {
    browse('/', function () {
    	
    	casper.then(function () {
    		casper.evaluate(function() {
    			sulka.userSettings.save();
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
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.save();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				var returnWidth = gridColumns[2].width;
				gridColumns[2].width = 50;
				sulka.userSettings.save();
				return returnWidth;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in browsing -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.userSettings.save();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
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
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in browsing -mode.");
		}).then(function(){
//			for(var i = 0; i < 5; i++){
//				casper.evaluate(function(){
//					sulka.freeze.freezeLeftColumn();
//				});
//			}
//			casper.evaluate(function(){
//				sulka.userSettings.save();
//			});
//		}).waitWhileVisible("loader-animation"
//		).then(function(){
//			for(var i = 0; i < 5; i++){
//				casper.evaluate(function(){
//						sulka.freeze.unfreezeRightColumn();
//				});
//			}
//			casper.evaluate(function(){
//				sulka.userSettings.restore();
//			});
//		}).waitWhileVisible("loader-animation"
//		).then(function(){
//			var freezedColumnCount = casper.evaluate(function(){
//				return sulka.freeze.grid.getColumns().length;
//			});
//			test.assertEquals(freezedColumnCount, 5, "Freezed columns are restored.");
//			var count = casper.evaluate(function(){
//				return sulka.freeze.grid.getColumns().length;
//			});
//			for(; count > 0; count--){
//				casper.evaluate(function(){
//					sulka.freeze.unfreezeRightColumn();
//				});
//			}
//		}).then(function() {
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: '',
				ringings: true,
				recoveries: true
				}, false);
			casper.evaluate(function(){
				sulka.userSettings.save();
			});
		}).then(function () {
			this.click('#add-ringings-tab');
		}).then(function () {
    		casper.evaluate(function() {
    			sulka.userSettings.save();
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
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.save();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				var returnWidth = gridColumns[2].width;
				gridColumns[2].width = 50;
				sulka.userSettings.save();
				return returnWidth;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in addRingings -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.userSettings.save();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("loader-animation"
		).then(function() {
			casper.evaluate(function() {
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in addRingings -mode.");
		}).then(function() {
			var isTickVisible = casper.evaluate(function() {
				var name = sulka.columns[4].name;
				var menuItems = $("#header-context-menu .context-menu-item span");
				for(var i=0; i < sulka.columns.length; i++){
					var tickIndex = 2 * i;
					var itemIndex = 2 * i + 1;
					if(menuItems[itemIndex].innerHTML == name)
						return ! menuItems[tickIndex].textContent == "";
				}
			});
			test.assertFalse(isTickVisible, "Tick is removed from context-menu.");
		}).then(function() {
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
			casper.evaluate(function(){
				sulka.columns[4].$sulkaVisible = true;
				sulka.userSettings.save();
			});
		}).then(function () {
			this.click('#add-recoveries-tab');
		}).then(function () {
    		casper.evaluate(function() {
    			sulka.userSettings.save();
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
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.save();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function() {
				var gridColumns = sulka.grid.getColumns();
				gridColumns[2].width = 23;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var columnWidth = casper.evaluate(function(){
				var gridColumns = sulka.grid.getColumns();
				var returnWidth = gridColumns[2].width;
				gridColumns[2].width = 50;
				sulka.userSettings.save();
				return returnWidth;
			});
			test.assertEquals(columnWidth, 555, "Previously saved column width is restored in addRecoveries -mode.");
		}).then(function() {
			casper.evaluate(function() {
				sulka.userSettings.save();
				var gridColumns = sulka.grid.getColumns();
				var tmp = gridColumns[0];
				gridColumns[0] = gridColumns[1];
				gridColumns[1] = tmp;
				sulka.grid.setColumns(gridColumns);
				sulka.updateWidthToSulkaColumns();
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
			});
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
		}).waitWhileVisible("loader-animation"
		).then(function() {
			casper.evaluate(function() {
				sulka.userSettings.restore();
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
				sulka.userSettings.save();
				sulka.columns[4].$sulkaVisible = true;
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			casper.evaluate(function(){
				sulka.userSettings.restore();
			});
		}).waitWhileVisible("loader-animation"
		).then(function(){
			var isColumnVisible = casper.evaluate(function(){
				return sulka.columns[4].$sulkaVisible;
			});
			test.assertFalse(isColumnVisible, "Column visibility status is restored in addRecoveries -mode.");
		}).then(function(){
			this.fill('form#filters', {
				date: '',
				species: '',
				municipality: ''
				}, false);
			casper.evaluate(function(){
				sulka.userSettings.save();
			});
		});
    });
    
    casper.run(function () {
    	test.done();
    });
});