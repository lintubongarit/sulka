const JQUERY_VERSION = '2.0.3';
const LOCALE = 'fi_FI';

function browse(path, testCb) {
    casper.start(URL + path, function () {
        casper.page.injectJs('./jquery-' + JQUERY_VERSION + '.js');
        testCb.apply(null, arguments);
    });
}
