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
	 * Sets the user-visible error text to a given value, or removes
	 * the text if a false-like value is given.
	 * @param errorMsg New error string.
	 */
	setError: function (errorMsg) {
		if (errorMsg) {
			if (errorMsg.length > 50) {
				errorMsg = errorMsg.substring(0, 50) + "...";
			} 
			$("#last-error").text(errorMsg);
		} else {
			$("#last-error").text("");
		}
	},
	
	/**
	 * Removes user-visible error text, if any. 
	 */
	unsetError: function () {
		helpers.setError("");
	},
	
	/**
	 * @returns the current error text.
	 */
	getError: function () {
		return $.trim($("#last-error").text());
	},
	
	/**
	 * Show the loader animation.
	 */
	showLoader: function () {
		$("#loader-animation").show();
	},
	
	/**
	 * Hide the loader animation.
	 */
	hideLoader: function () {
		$("#loader-animation").hide();
	},
	
	/**
	 * Hide the loader animation and set the error text.
	 */
	hideLoaderAndSetError: function (errorMsg) {
		helpers.hideLoader();
		helpers.setError(errorMsg);
	},
	
	/**
	 * Hide the loader animation and unset the error text.
	 * @param errorMsg New error string.
	 */
	hideLoaderAndUnsetError: function () {
		helpers.hideLoader();
		helpers.unsetError();
	},
	
	/**
	 * Unset the error text and show the loader animation.
	 * @param errorMsg New error string.
	 */
	unsetErrorAndShowLoader: function () {
		helpers.unsetError();
		helpers.showLoader();
	},
	
	/**
	 * A generic function that will cancel the jQuery or DOM event it is
	 * supplied with. */
	cancelEvent: function (event) {
		event.stopPropagation();
		event.preventDefault();
	},

	/**
	 * Parse user input date to a date range suitable for API.
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
	
    disableSelection: function ($target) {
      if ($target && $target.jquery) {
        $target
            .attr("unselectable", "on")
            .css("MozUserSelect", "none")
            .bind("selectstart.ui", function () {
              return false;
            }); // from jquery:ui.core.js 1.7.2
      }
    }
};

return helpers; }();
