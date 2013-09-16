var moment = require('./lib/moment.js');

casper.test.begin('Home page tests', 7, function suite(test) {
    browse('/', function () {
        test.assertHttpStatus(200, "HTTP status is OK");
        test.assertTitle("Home", "Title is 'Home'");
        test.assertSelectorHasText('body > h1', "Hello world!", "Has a header containing the greeting 'Hello world!'");
        
        var now = moment();
        var time = now.format("HH:mm");
        var dayOfMonth = now.format("D");
        var year = now.format("YYYY");
        var dateText = casper.evaluate(function () { return __utils__.findOne('body > p').textContent });
    
        test.assertSelectorHasText("body > p", "The time on the server is ", "Page has timestamp");
        test.assertSelectorHasText("body > p", time, "Timestamp has correct time");
        test.assertSelectorHasText("body > p", dayOfMonth, "Timestamp has correct day of month");
        test.assertSelectorHasText("body > p", year, "Timestamp has correct year");
    });
    
    casper.run(function () {
        test.done();
    });
});