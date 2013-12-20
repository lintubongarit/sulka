const JQUERY_VERSION = '2.0.3';
const LOCALE = 'fi_FI';
const TEST_SESSION_CODE = "b0d2cc8b16fc2de6bfbee049f2c62415cdb088ab1983eeafdbc3010f0024bc33";

// Make the window a bit larger to better fit rows
casper.options.viewportSize = {
	width: 1024,
	height: 768
};

casper.options.logLevel = "info";
casper.options.verbose = true;

// Add some sensible error handlers
casper.on('page.error', function(err, backtrace) {
	var msg = "Uncaught JavaScript Error: " + err + "\nBacktrace: " 
		+ backtrace.map(function (b) { return b.file + ":" + b.line; }).join(",\n\t");
	casper.test.fail(msg);
    casper.log(msg, "error");
});

casper.on('remote.message', function(msg) {
    casper.log("Remote console: " + msg, "info");
});

casper.on('remote.alert', function(msg) {
    casper.log("Remote window.alert(): " + msg, "info");
});

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
 * Evaluate string in the browser environment and but do not return its value.
 * @param codeString JavaScript code snippet to evaluate.
 */
function exec(codeString) {
	casper.evaluate(function (codeString) {
		eval(codeString);
	}, codeString);
};

/**
 * Get selector element count.
 */
function count(selector) {
	return casper.evaluate(function (selector) {
		return __utils__.findAll(selector).length;
	}, selector);
}