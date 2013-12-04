casper.test.begin('Sulka-database tests', 10, function suite(test) {
	
	browse('/addRingings', function () {
		
		var randomSpecies = genRandomString();
		
		var numberOfRows = -1;
		
		var newRow = -1;
		
		
		casper.then(function () {
			
			var addRow = casper.evaluate(function(randomSpecies){
				return sulka.getData()[sulka.getData().length - 1];
			});
			
			test.assertEquals(Object.keys(addRow).length, 1, "addRow exists after page init");

		}).then(function () {
			
			casper.evaluate(function(randomSpecies){
				
				var data = sulka.getData();
				
				data[sulka.getData().length - 1].species = randomSpecies;
				sulka.setData(data);
				
				var args = {};
				args.row = sulka.getData().length - 1;
				
				sulka.grid.setSelectedRows([sulka.getData().length - 1]);
				
				sulka.events.onCellChange(null, args);
				
			}, randomSpecies);

		}).waitWhileVisible("#loader-animation"
		).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	var slickDataLength = casper.evaluate(function () {
				return sulka.getData().length;
	        });
	    	
	    	for (var i = 0; i < slickDataLength; i++){
				var row = casper.evaluate(function(i){
					return sulka.grid.getData().getItem(i);
				}, i);
				if (row.species !== undefined){
					if (row.species.indexOf(randomSpecies) != -1){
						newRow = i;
						break;
					}
				}
			}
	    	
	    	test.assertNotEquals(newRow, -1,
	    	"sulka.core.onCellChange sends to sulka-DB, and sulka.API.fetchSulkaDBRows fetches rows");
	    	
	    	var addRow = casper.evaluate(function(randomSpecies){
				return sulka.getData()[sulka.getData().length - 1];
			});
			
			test.assertEquals(Object.keys(addRow).length, 1, "after editing addRow, new addRow is added to end of rows");
	    	
	    }).then(function () {
	    	
	    	casper.evaluate(function(newRow){
	    		sulka.previousActiveRow = undefined;
	    		sulka.grid.setSelectedRows([newRow]);
	    		sulka.previousActiveRowEdited = false;
	    		sulka.events.onActiveCellChanged(null, {row: newRow});
	    	}, newRow);
	    	
	    }).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	
	    	var editedRow = casper.evaluate(function(newRow){
	    		return sulka.getData()[newRow];
	    	}, newRow);
	    	
	    	test.assertDoesntExist(editedRow.$valid,
	    	"sulka.events.onActiveCellChanged() does nothing if sulka.previousActiveRow is undefined");
	    	
	    }).then(function () {
	    	
	    	casper.evaluate(function(newRow){
	    		sulka.previousActiveRow = newRow;
	    		sulka.grid.setSelectedRows([newRow]);
	    		sulka.previousActiveRowEdited = true;
	    		sulka.events.onActiveCellChanged(null, {row: newRow});
	    	}, newRow);
	    	
	    }).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	
	    	var editedRow = casper.evaluate(function(newRow){
	    		return sulka.getData()[newRow];
	    	}, newRow);
	    	
	    	test.assertDoesntExist(editedRow.$valid,
	    	"sulka.events.onActiveCellChanged() does nothing if previous active row is the same row as current active row");
	    	
	    }).then(function () {

	    	casper.evaluate(function(newRow){
	    		sulka.previousActiveRow = newRow;
	    		sulka.grid.setSelectedRows([-1]);
	    		sulka.previousActiveRowEdited = false;
	    		sulka.events.onActiveCellChanged(null, {row: newRow});
	    	}, newRow);
	    	
	    }).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	
	    	var editedRow = casper.evaluate(function(newRow){
	    		return sulka.getData()[newRow];
	    	}, newRow);
	    	
	    	test.assertDoesntExist(editedRow.$valid,
	    	"sulka.events.onActiveCellChanged() does nothing if previous active row wasn't edited");
	    	
	    }).then(function() {
	    	casper.evaluate(function(newRow){
	    		sulka.previousActiveRow = newRow;
	    		sulka.grid.setSelectedRows([-1]);
	    		sulka.previousActiveRowEdited = true;
	    		sulka.events.onActiveCellChanged(null, {row: newRow});
	    	}, newRow);
	    }).waitWhileVisible("#loader-animation"
	    ).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	
	    	var slickDataLength = casper.evaluate(function () {
				return sulka.getData().length;
	        });
	    	
	    	for (var i = 0; i < slickDataLength; i++){
				var row = casper.evaluate(function(i){
					return sulka.grid.getData().getItem(i);
				}, i);
				if (row.species !== undefined){
					if (row.species.indexOf(randomSpecies) != -1){
						newRow = i;
						break;
					}
				}
			}
	    	
	    	var editedRow = casper.evaluate(function(newRow){
	    		return sulka.getData()[newRow];
	    	}, newRow);
	    	
	    	test.assertEquals(editedRow.$valid, false,
	    	"validated row contains $valid-variable and is not valid");
	    	
	    	test.assertEquals(editedRow.$errors, '["species"]',
	    	"validated row contains $errors-variable which tells which property is invalid");
	    	
	    	test.assertEquals(editedRow.$invalid_msg, 'RIVI EI OLE VALIDI: (species: invalid_enumeration_value), ',
	    	"validated row contains $invalid_msg-variable");
	    	
		}).then(function () {	  //DELETE TEST FOR SINGLE ROW BEGINS
			
			numberOfRows = casper.evaluate(function () {
				return sulka.getData().length;
			});
			
	    	casper.evaluate(function (newRow) {
	    		
				var toBeDeleted = [];
				toBeDeleted.push(sulka.getData()[newRow].databaseId);
				
				console.log(sulka.getData()[newRow].databaseId);
				
		        sulka.helpers.unsetErrorAndShowLoader();
				sulka.API.deleteSulkaDBRows(
					toBeDeleted,
					sulka.helpers.hideLoaderAndUnsetError,
					sulka.helpers.hideLoaderAndSetError
				);
				
	    	}, newRow);
	    	
		}).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    		    	
	    	var slickDataLength = casper.evaluate(function () {
				return sulka.getData().length;
	        });
	    	
	    	test.assertNotEquals(slickDataLength, numberOfRows,
	    	"sulka.API.deleteSulkaDBRows deletes last row.");
		});
	});
	
	casper.run(function () {
		test.done();
	});
});


function genRandomString(){
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
