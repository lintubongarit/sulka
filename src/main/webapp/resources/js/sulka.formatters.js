/**
 * Formatters for fields and API input/output.
 */
sulka.formatters = (function (formatters) {
formatters = {
	/**
	 * The set of date type fields in the current view.
	 */
	dateFields: {},
	/**
	 * The set of integer type fields in the current view.
	 */
	integerFields: {},
	/**
	 * The set of decimal type fields in the current view.
	 */
	decimalFields: {},
	
	/**
	 * Recognizes date strings as they come from the API
	 */
	DATE_IN_REGEXP: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
	/**
	 * Apply transformations to API row data on input from server. The transformations should happen in-place.
	 * @param data Input rows from the API.
	 */
	formatRowsIn: function (data) {
		var DATE_RE = formatters.DATE_IN_REGEXP;
		var pad2 = sulka.helpers.pad2;
		var dateFields = formatters.dateFields; 
		var integerFields = formatters.integerFields; 
		var decimalFields = formatters.decimalFields; 
		data.forEach(function (row) {
			if (row) {
				for (var field in dateFields) if (dateFields.hasOwnProperty(field)) {
					if (typeof(row[field]) === "string") { 
						// Order dates year-month-day to make string sorting work
						var match = row[field].match(DATE_RE);
						if (match !== null) {
							row[field] = match[3] + "." + pad2(match[2]) + "." + pad2(match[1]);  
						}
					} else {
						delete row[field];
					}
				}
				for (var field in integerFields) if (integerFields.hasOwnProperty(field)) {
					if (typeof(row[field]) === "string") {
						var val = row[field];
						val = parseInt(val, 10);
						if (!isNaN(val)) {
							row[field] = val;
							return;
						}
					}
					delete row[field];
				}
				for (var field in decimalFields) if (decimalFields.hasOwnProperty(field)) {
					if (typeof(row[field]) === "string") {
						var val = row[field];
						val = parseFloat(val);
						// Check that string value as decimal is finite and string representation does not have an exponent 
						if (isFinite(val) && val.toString().indexOf("e") < 0) {
							row[field] = val;
							return;
						}
					}
					delete row[field];
				}
			}
		});
	},
	
	/**
	 * Recognizes date strings as they are stored internally for efficient sorting.
	 */
	DATE_OUT_REGEXP: /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/,
	/**
	 * Apply transformations to an API row on output back to server. Should do the
	 * reverse of formatRowsIn for individual row. Should clone the row instead
	 * of modifying the argument row directly.
	 * @param row Row from the local grid that is being saved to the API.
	 * @return Clone of the row data that conforms to the expectations of the API.
	 */
	formatRowOut: function (row) {
		var copy = {};
		var dateFields = formatters.dateFields; 
		var integerFields = formatters.integerFields; 
		var decimalFields = formatters.decimalFields; 
		for (var field in row) if (row.hasOwnProperty(field)) {
			var val = row[field];
			if (field.match(/^\$/)) {
				// Always pass implementation-private variables through as-is 
				copy[field] = val;
			} else { 
				if (typeof(val) === "string") {
					if (dateFields.hasOwnProperty(field)) {
						var match = val.match(formatters.DATE_OUT_REGEXP);
						if (match !== null) {
							copy[field] = match[3] + "." + match[2] + "." + match[1];  
						}
					} else if (val !== "") {
						copy[field] = val;
					}
				} else if (typeof(row[field]) === "number") {
					if (integerFields.hasOwnProperty(field) || decimalFields.hasOwnProperty(field)) {
						copy[field] = String(row[field]);  
					}
				}
			}
		}
		return copy;
	},
	
	/**
	 * Create a new formatter for date fields.
	 */
	makeDateFieldFormatter: function () {
		var DATE_RE = formatters.DATE_OUT_REGEXP;
		return function (row, cell, date) {
			if (typeof(date) === "string") {
				var match = date.match(DATE_RE);
				if (match !== null) {
					return match[3] + "." + match[2] + "." + match[1];
				}
				return date;
			}
			return "";
		};
	},
	
	/**
	 * Formatter for decimal and integer fields.
	 * @param row Row of the cell
	 * @param cell Column of the cell
	 * @param number The data value of the cell
	 * @returns String(number), or "" of number is not of the number type.
	 */
	numberFieldFormatter: function (row, cell, number) {
		if (typeof(number) === "number") {
			return String(number);
		}
		return "";
	}
};
return formatters; })();