casper.test.begin('Uitests', 9, function suite(test) {
	var RINGING_BG_IMAGE = "resources/img/ringing.png";
	var RECOVERY_BG_IMAGE = "resources/img/recovery.png";
	
    browse('/', function () {
    	// Generic
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Sulka - Selaa rivejä", "Title is right");
        
    	casper.
    	waitWhileVisible("#loader-animation").
    	then(function () {
	        test.assertTrue(count("#slick-grid .slick-header-column") >= 10, "There are at least ten columns");
	        test.assertTrue(count("#slick-grid .column-group-header") >= 3, "There are at least three column groups");
			
			casper.fill('form#filters', {
				date: '2005'
			}, false);
			
			casper.click("#form-submit");
    	}).
    	waitWhileVisible("#loader-animation").
    	then(function () {
    		test.assertExists("#slick-grid .recovery-row .rowtype-column", "There is at least one recovery row");
    		test.assertExists("#slick-grid .ringing-row .rowtype-column", "There is at least one ringing row");
	    	test.assertTrue(
				casper.evaluate(function () {
					return $.map($("#slick-grid .rowtype-column"), function (item) {
						return $(item).text().trim();
					}).every(function (itemText) {
						return itemText.length == 0; 
					});
				}), 
				"No rowtype columns have text"
			);
	    	
	    	test.assertTrue(
	    		casper.evaluate(function (bgImage) {
	    			var bgImageEnd1 = bgImage + '")';
	    			var bgImageEnd2 = bgImage + "')";
	    			var bgImageEnd3 = bgImage + ")";
	    			return $.map($("#slick-grid .ringing-row .rowtype-column"), function (rowTypeColumn) {
	    				return String($(rowTypeColumn).css("backgroundImage"));
	    			}).every(function (bgImageActual) {
	    				var endsWith = function(str, end) {
	    					return str.length >= end.length && str.indexOf(end) == str.length - end.length;
	    				};

	    				return endsWith(bgImageActual, bgImageEnd1) || 
	    					endsWith(bgImageActual, bgImageEnd2) || 
	    					endsWith(bgImageActual, bgImageEnd3);
	    			});
	    		}, RINGING_BG_IMAGE),
	    		"every ringing row's type column has correct background image"
	    	);
	    	
	    	test.assertTrue(
	    		casper.evaluate(function (bgImage) {
	    			var bgImageEnd1 = bgImage + '")';
	    			var bgImageEnd2 = bgImage + "')";
	    			var bgImageEnd3 = bgImage + ")";
	    			return $.map($("#slick-grid .recovery-row .rowtype-column"), function (rowTypeColumn) {
	    				return String($(rowTypeColumn).css("backgroundImage"));
	    			}).every(function (bgImageActual) {
	    				var endsWith = function(str, end) {
	    					return str.length >= end.length && str.indexOf(end) == str.length - end.length;
	    				};

	    				return endsWith(bgImageActual, bgImageEnd1) || 
	    					endsWith(bgImageActual, bgImageEnd2) || 
	    					endsWith(bgImageActual, bgImageEnd3);
	    			});
	    		}, RECOVERY_BG_IMAGE), 
	    		"every ringing row's type column has correct background image"
	    	);
		});
    });
	
    casper.run(function () {
        test.done();
   	});
});
