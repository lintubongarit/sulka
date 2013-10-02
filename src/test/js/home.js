var moment = require('./lib/moment.js');

const LOKKI_RINGER_ID = 846;

casper.test.begin('Home page tests', 9, function suite(test) {
    browse('/', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Home", "Title is 'Home'");
        test.assertSelectorHasText('body > h1', "Hello world!", "Has a header containing the greeting 'Hello world!'");
        
        var now = moment();
        var time = now.format(":mm");
        var dayOfMonth = now.format("D");
        var year = now.format("YYYY");
        var dateText = casper.evaluate(function () { return __utils__.findOne('body > p').textContent });
    
        test.assertSelectorHasText('body > p', "The time on the server is ", "Page has timestamp");
        test.assertSelectorHasText('body > p', time, "Timestamp has correct time");
        test.assertSelectorHasText('body > p', dayOfMonth, "Timestamp has correct day of month");
        test.assertSelectorHasText('body > p', year, "Timestamp has correct year");
        
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