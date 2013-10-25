casper.test.begin('Browsing navigating tests', 3, function suite(test) {
	browse('/', function () {
		casper.then(function () {
			this.click('input#browsing');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/?", "browsing link works on browsing page");
			
		}).then(function () {
			this.click('input#addRinging');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addringing?", "addRinging link works on browsing page");
			
		}).then(function () {
			this.click('input#browsing');
			
		}).then(function () {
			this.click('input#addRecovery');
			
		}).then(function() {
			test.assertEquals(this.getCurrentUrl(), URL + "/addrecovery?", "addRecovery link works on browsing page");
		});
	});
	
	casper.run(function () {
		test.done();
	});
	
});