casper.test.begin('addRecoveries navigating tests', 3, function suite(test) {
	browse('/addRecoveries', function () {
		casper.then(function () {
			this.click('#add-recoveries-tab');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addRecoveries", "addRecoveries link works on addRecoveries page");
			
		}).then(function () {
			this.click('#browse-tab');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/", "browse link works on addRecoveries page");
			
		}).then(function () {
			this.click('#add-recoveries-tab');
			
		}).then(function () {
			this.click('#add-ringings-tab');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addRingings", "addRingings link works on addRecoveries page");
		}); 

	});
	
	casper.run(function () {
		test.done();
	});
	
});