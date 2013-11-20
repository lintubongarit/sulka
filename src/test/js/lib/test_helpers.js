const JQUERY_VERSION = '2.0.3';
const LOCALE = 'fi_FI';
const TEST_SESSION_CODE = "b0d2cc8b16fc2de6bfbee049f2c62415cdb088ab1983eeafdbc3010f0024bc33";

// Make the window a bit larger to better fit rows
casper.options.viewportSize = {
	width: 1024,
	height: 768
};

/**
 * Create login session, browse to path in tested deployment, inject jQuery and execute testCb when done. 
 * @param path Web page path to test
 * @param testCb Callback to execute when ready.
 */
function browse(path, testCb) {
	casper.start(URL + "/testLogin/" + TEST_SESSION_CODE);
	casper.thenOpen(URL + path, function () {
		casper.page.injectJs('lib/jquery-' + JQUERY_VERSION + '.min.js');
		testCb.apply(null, arguments);
	});
};
/**
 * Create admin login session, browse to path in tested deployment, inject jQuery and execute testCb when done. 
 * @param path Web page path to test
 * @param testCb Callback to execute when ready.
 */
function browseAdmin(path, testCb) {
	casper.start(URL + "/testAdminLogin/" + TEST_SESSION_CODE);
	casper.thenOpen(URL + path, function () {
		casper.page.injectJs('lib/jquery-' + JQUERY_VERSION + '.min.js');
		testCb.apply(null, arguments);
	});
};

/**
 * Evaluate string in the browser environment and return its value (value must be 
 * serializeable to JSON.)   
 * @param codeString JavaScript code snippet to evaluate.
 */
function get(codeString) {
	var json = casper.evaluate(function (codeString) {
		return JSON.stringify(eval("var v=" + codeString + "; v"));
	}, codeString);
	return JSON.parse(json);
};

/**
 * Get selector element count.
 */
function count(selector) {
	return casper.evaluate(function (selector) {
		return __utils__.findAll(selector).length;
	}, selector);
}