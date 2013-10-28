casper.test.begin('addRingings navigating tests', 3, function suite(test) {
	browse('/', function () {
		casper.then(function () {
			this.click('#add-ringings-tab');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addRingings", "addRingings link works on addRinging page");
			
		}).then(function () {
			this.click('#browse-tab');
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/", "browsing link works on addRinging page");
			
		}).then(function () {
			this.click('#add-ringings-tab');
			
		}).then(function () {
			this.click('#add-recoveries-tab');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addRecoveries", "addRecoveries link works on addRingings page");
		}); 

	});
	
	casper.run(function () {
		test.done();
	});
	
});