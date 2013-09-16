var moment = require('./lib/moment.js');

casper.test.begin('Home page tests', 7, function suite(test) {
    browse('/', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Home", "Title is 'Home'");
        test.assertSelectorHasText('body > h1', "Hallo world!", "Has a header containing the greeting 'Hallo world!'");
        
        var now = moment();
        var time = now.format("HH:mm");
        var dayOfMonth = now.format("D");
        var year = now.format("YYYY");
        var dateText = casper.evaluate(function () { return __utils__.findOne('body > p').textContent });
    
        test.assert(dateText.indexOf("The time on the server is ") >= 0, "Page has timestamp");
        test.assert(dateText.indexOf(time) >= 0, "Timestamp has correct time");
        test.assert(dateText.indexOf(dayOfMonth) >= 0, "Timestamp has correct day of month");
        test.assert(dateText.indexOf(year) >= 0, "Timestamp has correct year");
    });
    
    casper.run(function () {
        test.done();
    });
});