casper.test.begin('HelperFunctionTests', 69, function suite(test) {
	browse('/', function () {
		var strings = get("sulka.strings");
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2009")'),
				{startDate: '01.01.2009', endDate: '31.12.2009'}, 
				"Four digit year number is correctly parsed.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("04.06.2005")'),
				{ startDate: '04.06.2005' },
				"Exact date is parsed correctly.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4.7.2005")'),
				{ startDate: '04.07.2005' },
				"Exact date with one digit date and month is parsed correctly.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("05.7.2005")'),
				{ startDate: '05.07.2005' },
				"Exact date with one digit month is parsed correctly.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("6.08.2005")'),
				{ startDate: '06.08.2005' },
				"Exact date with one digit date is parsed correctly.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("3.6.2005 - 5.6.2006")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("03.6.2005-5.06.2006")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("3.6.2005-5.6.2006")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("03.6.2005-5.06.2006")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly irrespective of amount of space.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("03.6.2005-5.06.2006  ")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly irrespective of amount of space.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("  03.6.2005    -   5.06.2006  ")'),
				{ startDate: '03.06.2005', endDate: '05.06.2006' },
				"Exact date range is parsed correctly irrespective of amount of space.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4.7.2005  ")'),
				{ startDate: '04.07.2005' },
				"Stray spaces allowed at end.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("  4.7.2005")'),
				{ startDate: '04.07.2005' },
				"Stray spaces allowed at beginning.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput(" 4.7.2005 ")'),
				{ startDate: '04.07.2005' },
				"Stray spaces allowed at end & beginning.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("")'),
				strings.invalidDate, 
				"Empty string yields an error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4. 7.2005")'),
				strings.invalidDate,
				"Stray space yields error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4. 7 .2005")'),
				strings.invalidDate,
				"Stray space yields error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4 .7.2005")'),
				strings.invalidDate,
				"Stray space yields error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("4 .7.2 005")'),
				strings.invalidDate,
				"Stray space yields error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("31.9.2005")'),
				strings.invalidDate, 
				"Non-existent date yields an error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("0.9.2005-30.9.2005")'),
				strings.invalidDate, 
				"Non-existent date yields an error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("1.9.2005-30.9.2005")'),
				{ startDate: '01.09.2005', endDate: '30.09.2005' }, 
				"Good date range yields no error.");
	
		test.assertEquals(
				get('sulka.helpers.parseDateInput("30.9.2005-1.9.2005")'),
				strings.inverseDateRange, 
				"Inverse date range yields an error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2.9.2005-1.9.2005")'),
				strings.inverseDateRange, 
				"Inverse date range yields an error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("1.9.2005-1.9.2005")'),
				{ startDate: '01.09.2005' }, 
				"One day date range is valid.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005")'),
				{ startDate: '01.01.2005', endDate: '31.12.2005' }, 
				"Year returns year range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("09.2005")'),
				{ startDate: '01.09.2005', endDate: '30.09.2005' }, 
				"Month returns month range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("9.2005")'),
				{ startDate: '01.09.2005', endDate: '30.09.2005' }, 
				"Month returns month range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("7.09.2005-9.2005")'),
				{ startDate: '07.09.2005', endDate: '30.09.2005' }, 
				"Partial range is possible.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("7.09.2005-2008")'),
				{ startDate: '07.09.2005', endDate: '31.12.2008' }, 
				"Partial range is possible.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("09.2005-5.2008")'),
				{ startDate: '01.09.2005', endDate: '31.05.2008' }, 
				"Month range returns the month range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2001-2011")'),
				{ startDate: '01.01.2001', endDate: '31.12.2011' }, 
				"Year range returns the year range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.2001-2011")'),
				{ startDate: '01.05.2001', endDate: '31.12.2011' }, 
				"Month-year range returns the correct range.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.2011-2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("12.5.2011-2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2011-12.2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2011-11.12.2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("7.2011-11.12.2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("7.2011-11.12.2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("7.2011-11.12.2001")'),
				strings.inverseDateRange, 
				"Inverse range is detcted.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("1.9.2001-")'),
				strings.invalidDate, 
				"Partial range is not allowed.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("9.2001-")'),
				strings.invalidDate, 
				"Partial range is not allowed.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2001-")'),
				strings.invalidDate, 
				"Partial range is not allowed.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("foobar")'),
				strings.invalidDate, 
				"Non-sense date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005.05")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005.05.05")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005.5.5")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005-5-05")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005-05-05")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("05-05-2005")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("05/05/2005")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005/05/05")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5-2005")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5/2005")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("2005-5-15")'),
				strings.invalidDate, 
				"Foreign date format returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5s.2005")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.2005 s")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.2005 s")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("s 5.5.2005")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.2005s")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.200s")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("s5.5.2005")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5s5.2005")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.2s05")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.e3")'),
				strings.invalidDate, 
				"Stray character in date returns error.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.999")'),
				strings.invalidDate, 
				"Year must have 4 characters.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.5.-1")'),
				strings.invalidDate, 
				"Year must be positive.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("5.-5.2005")'),
				strings.invalidDate, 
				"Month must be positive.");
		
		test.assertEquals(
				get('sulka.helpers.parseDateInput("-5.5.2005")'),
				strings.invalidDate, 
				"Day must be positive.");
    });

	casper.run(function () {
        test.done();
    });
});