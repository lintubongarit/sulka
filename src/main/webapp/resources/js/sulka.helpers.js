sulka.helpers = function (helpers){
/**
 * Helper function name space.
 */
helpers = {
	/**
	 * Just calls console.log with the same arguments, if it exists.
	 * @param string Log message.
	 * @param obj Additional objects to print.
	 */
	log: function (string, obj) {
		if (console && console.log) {
			console.log.apply(console, arguments);
		}
	},

	/**
	 * A generic function that will cancel the jQuery or DOM event it is
	 * supplied with. 
	 * 
	 * @param event Event to be stopped.
	 * */
	cancelEvent: function (event) {
		event.stopImmediatePropagation();
		event.preventDefault();
	},

	/**
	 * Parse user input date to a date range suitable for API.
	 * 
	 * @param date User input date string.
	 * @returns API filter object with startDate and endDate from user input,
	 * or a string describing the error if parsing failed. 
	 */
	parseDateInput: function (date) {
		date = $.trim(date);
		
		var start = null,
			end = null;
		
		var rangeMatch = date.match(/^([^\-]+)-([^\-]+)$/);
		if (rangeMatch) {
			start = helpers.parseDate(rangeMatch[1]);
			end = helpers.parseDate(rangeMatch[2], true);
		} else {
			start = helpers.parseDate(date);
			end = helpers.parseDate(date, true);
		}
		
		if (start === null || end === null) return sulka.strings.invalidDate;
		if (end.isBefore(start)) return sulka.strings.inverseDateRange;
		
		if (start.isSame(end)) {
			return { startDate: start.format("DD.MM.YYYY") };
		} 
		return { startDate: start.format("DD.MM.YYYY"), endDate: end.format("DD.MM.YYYY") };
	},
	
	_dateFormat: /^((\d{1,2}\.)?\d{1,2}\.)?\d{4}$/,
	/**
	 * Parse user input date.
	 * 
	 * @param date String of date such as "1.6.2005", "6.2005" or "2005".
	 * @param ceil Convert shorthands dates (2005, 6.2005 etc.) to end of 
	 * the era, rather than beginning, which is the default.
	 * @return Moment.js object, or null if parsing failed.
	 */
	parseDate: function (date, ceil) {
		date = $.trim(date);
		
		// Moment.js is too lenient on separators, so we 
		// must manually enforce strict date format.
		if (!helpers._dateFormat.test(date)) {
			return null;
		}
			
		var mom; 
		mom = moment(date, "DD.MM.YYYY", true);
		if (mom.isValid()) {
			return mom;
		}
		
		mom = moment(date, "MM.YYYY", true);
		if (mom.isValid()) {
			if (ceil) {
				return mom.endOf('month');
			} else {
				return mom.startOf('month');
			}
		}
		
		mom = moment(date, "YYYY", true);
		if (mom.isValid()) {
			if (ceil) {
				return mom.endOf('year');
			} else {
				return mom.startOf('year');
			}
		}
		
		return null;
	},

	/**
	 * Make target not selected.
	 * 
	 * @param $target Item not to be selected.
	 */
    disableSelection: function ($target) {
    	if ($target && $target.jquery) {
    		$target
	            .attr("unselectable", "on")
	            .css("UserSelect", "none")
	            .css("MozUserSelect", "none")
	            .css("WebkitUserSelect", "none")
	            .css("IeUserSelect", "none")
	            .bind("selectstart.ui", function () {
	            	return false;
	            }); // from jquery:ui.core.js 1.7.2
      }
    },
    
    /**
     * Can be used as a callback to .sort() to sort JavaScript arrays numerically. 
     */
    numericSort: function (item1, item2) {
    	return item1 - item2;
    },
    
    /**
     * Can be used as a callback to .sort() to sort JavaScript arrays numerically in reverse. 
     */
    numericReverseSort: function (item1, item2) {
    	return item2 - item1;
    },
    
    /**
     * Pad string to two zeroes.
     * 
     * @param str The string to pad.
     */
    pad2: function (str) {
    	if (str.length === 1) return "0" + str;
    	if (str.length === 0) return "00";
    	return str;
    }
};

return helpers; }();
