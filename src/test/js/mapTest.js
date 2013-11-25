casper.test.begin('Map tests', 11, function suite(test) {
	var TIMEOUT = 300;
	var dataBefore = null;
	browse('/addRingings', function () {
		casper.then(function() {
			test.assertExists("a#mapIFrame", "There is an iframe for map in addRingings-page");
		}).then(function() {
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden in addRingings-page.");
		}).then(function() {
			this.click("a#mapIFrame");
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "block", "The map frame is visible in addRingings-page.");
		}).then(function() {
			this.click("button#cboxClose");
		}).wait(TIMEOUT, function(){
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden after clicking X-button in map-frame.");
		}).then(function(){
			this.click("a#mapIFrame");
			this.click("div#cboxOverlay");
		}).wait(TIMEOUT, function(){
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden after clicking outside of the map.");
		}).then(function() {
			dataBefore = casper.evaluate(function(){
				sulka.lastInputCoordinateLon = "";
				sulka.lastInputCoordinateLat = "";
				sulka.grid.setSelectedRows([0]);
				sulka.setCoordinateToRows();
				var data = sulka.grid.getDataItem(0);
				var lat = data["lat"];
				var lon = data["lon"];
				
				return {"lat":lat, "lon":lon};
			});
		}).then(function(){
			var dataAfter = casper.evaluate(function(){
				sulka.lastInputCoordinateLon = 60;
				sulka.lastInputCoordinateLat = 23;
				sulka.grid.setSelectedRows([0]);
				sulka.setCoordinateToRows();
				var data = sulka.grid.getDataItem(0);
				var lat = data["lat"];
				var lon = data["lon"];
				return {"lat":lat, "lon":lon};
			});
			test.assertNotEquals(dataBefore, dataAfter, "setCoordinateToRows updates coordinate fields.");
		}).then(function () {
		this.click('#add-recoveries-tab');
		}).then(function() {
			test.assertExists("a#mapIFrame", "There is an iframe for map in addRecoveries-page");
		}).then(function() {
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden in addRecoveries-page.");
		}).then(function() {
			this.click("a#mapIFrame");
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "block", "The map frame is visible in addRecoveries-page.");
		}).then(function() {
			this.click("button#cboxClose");
		}).wait(TIMEOUT, function(){
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden after clicking X-button in map-frame.");
		}).then(function(){
			this.click("a#mapIFrame");
			this.click("div#cboxOverlay");
		}).wait(TIMEOUT, function(){
			var frameStatus = casper.evaluate(function() {
				return $("#colorbox").css("display");
			});
			test.assertEquals(frameStatus, "none", "The map frame is hidden after clicking outside of the map.");
		});
	});
	
	casper.run(function () {
		test.done();
	});
	
});