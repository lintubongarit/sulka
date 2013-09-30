var moment = require('./lib/moment.js');


casper.test.begin('SlickGrid tests', 2, function suite(test) {
    browse('/slick', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
    });
    
    casper.run(function () {
        test.done();
    });
});
