casper.test.begin('addRinging navigating tests', 3, function suite(test) {
	browse('/', function () {
		casper.then(function () {
			this.click('input#addRinging');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addringing?", "addRinging link works on addRinging page");
			
		}).then(function () {
			this.click('input#browsing');
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/?", "browsing link works on addRinging page");
			
		}).then(function () {
			this.click('input#addRinging');
			
		}).then(function () {
			this.click('input#addRecovery');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addrecovery?", "addRecovery link works on addRinging page");
		}); 

	});
	
	casper.run(function () {
		test.done();
	});
	
});