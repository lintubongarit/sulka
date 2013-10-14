var moment = require('./lib/moment.js');

const LOKKI_RINGER_ID = 846;

casper.test.begin('Home page tests', 4, function suite(test) {
    browse('/', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Home", "Title is 'Home'");
        
        test.assertExists('body > table#ringers-table', "Has ringers-table");
        test.assertEval(function (LOKKI_RINGER_ID) {
            var rows = $('table#ringers-table tr');
            var success = false;
            rows.each(function () {
                if (
                    $(this).find('td:contains("HEIKKI LOKKI")').length > 0 && 
                    $(this).find('td:contains("' + LOKKI_RINGER_ID + '")').length > 0
                ) {
                    success = true;
                }
            });
            return success;
        }, "Has a ringer ID for Heikki Lokki", LOKKI_RINGER_ID);
    });
    
    casper.run(function () {
        test.done();
    });
});