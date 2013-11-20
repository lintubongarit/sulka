casper.test.begin('Sulka-database tests', 2, function suite(test) {
	
	
	browse('/addRingings', function () {
		
		var randomSpecies = genRandomString();
		
		var newRow = -1;

		casper.then(function () {
			
			casper.evaluate(function(randomSpecies){
				
				var args = {};
				args.item = {};
				args.item.species = randomSpecies;
				
				sulka.onAddNewRow(null, args);
				
			}, randomSpecies);

		}).then(function() {
			this.reload(function() {
	        });
	    }).waitWhileVisible("#loader-animation"
	    ).then(function () {
	    	var slickDataLength = casper.evaluate(function () {
				return sulka.grid.getData().getLength();
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
	    	"sulka.core.onAddNewRow adds new row with wanted data to slickgrid and DB, and sulka.API.fetchSulkaDBRows fetches rows");
	   
	    });
		
	});
	
	casper.run(function () {
		test.done();
	});
	
	
});


function genRandomString()
{
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
