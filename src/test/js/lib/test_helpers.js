const JQUERY_VERSION = '2.0.3';
const LOCALE = 'fi_FI';

function browse(path, testCb) {
    casper.start(URL + path, function () {
        casper.page.injectJs('lib/jquery-' + JQUERY_VERSION + '.min.js');
        testCb.apply(null, arguments);
    });
}
