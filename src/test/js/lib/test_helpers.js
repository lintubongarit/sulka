const JQUERY_VERSION = '2.0.3';
const LOCALE = 'fi_FI';
const TEST_SESSION_CODE = "b0d2cc8b16fc2de6bfbee049f2c62415cdb088ab1983eeafdbc3010f0024bc33";

function browse(path, testCb) {
	casper.start(URL + "/testLogin/" + TEST_SESSION_CODE);
	casper.thenOpen(URL + path, function () {
		casper.page.injectJs('lib/jquery-' + JQUERY_VERSION + '.min.js');
		testCb.apply(null, arguments);
	});
}
