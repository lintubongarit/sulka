sulka.editors = (function (editors) {
/**
 * Find the smallest common prefix of two strings starting from an index.
 * @param s1 String
 * @param s2 String
 * @param i Index to start finding the common prefix at.
 * @return The length of the substring s so that both s1 and s2 have s in position i. 
 */
function longestPrefix(s1, s2, i) {
	for (var j=i, l=Math.min(s1.length, s2.length); j<l && s1[j] == s2[j]; j++) ;
	return j-i;
};
	
/**
 * Create a prefix tree of strings in enumValues.
 */
function PrefixTree(enumValues) {
	/**
	 * Add children for node. Values must be a sort()'ed array of Strings. Add by prefixes starting
	 * at prefixLen.
	 */
	function addChildren(node, values, prefixLen) {
		var currentGroup = null;
		var currentGroupPrefix = null;
		
		values.forEach(function (cur) {
			if (currentGroup === null) {
				currentGroup = [cur];
				currentGroupPrefix = cur;
			} else {
				var common = longestPrefix(cur, currentGroupPrefix, prefixLen);
				if (common > 0) {
					currentGroup.push(cur);
					currentGroupPrefix = cur.substr(0, prefixLen+common);
				} else {
					if (currentGroup.length > 1) {
						node[currentGroupPrefix.slice(prefixLen)] = 
							addChildren({}, currentGroup, currentGroupPrefix.length);
					} else {
						node[currentGroupPrefix.slice(prefixLen)] = true;
					}
					currentGroup = [cur];
					currentGroupPrefix = cur;
				}
			}
		});
		if (currentGroup !== null) {
			if (currentGroup.length > 1) {
				node[currentGroupPrefix.slice(prefixLen)] = 
					addChildren({}, currentGroup, currentGroupPrefix.length);
			} else {
				node[currentGroupPrefix.slice(prefixLen)] = true;
			}
		}
		return node;
	};
	
	var root = addChildren({}, Array.prototype.slice.call(enumValues).sort(), 0);
	
	/**
	 * Add matching completions to completions (an Array) that match the String
	 * match at the tree node node, which is for completions from the prefix String 
	 * nodePrefix. Assumes that match starts with nodePrefix.substr(0, match.length)
	 * already.
	 */
	function addCompletions(completions, match, node, nodePrefix) {
		for (var nextPrefix in node) if (node.hasOwnProperty(nextPrefix)) {
			// Does nextPrefix start with the relevant part of match?
			var matchPart = match.substr(nodePrefix.length, nextPrefix.length);
			if (nextPrefix.substr(0, matchPart.length) === matchPart) {
				if (node[nextPrefix] === true) {
					if (match.length <= nodePrefix.length + nextPrefix.length) {
						completions.push(nodePrefix + nextPrefix);
					}
				} else {
					addCompletions(completions, match, node[nextPrefix], nodePrefix + nextPrefix);
				}
			}
		} 
	}
	
	// Returns possible completions for a prefix 
	this.getCompletions = function (prefix) {
		var completions = [];
		addCompletions(completions, prefix, root, "");
		return completions;
	};
	
	// Exported only for testing
	this._root = root;
};

// Offsets for completions list
var COMPLETIONS_TOP = 23,
	COMPLETIONS_BOTTOM = 25; // Reverse (too close to bottom)

editors = {
	/**
	 * Editor for enumerations field.
	 */
	EnumerationEditor: function(args) {
	    var $input = null;
	    var $completions = null;
	    // Maximum number of completions to show
	    var MAX_COMPLETIONS = 10;
	    
	    var defaultValue = null;
	    var enumValues = args.column.$sulkaEnumValues;
	    var valueSet = {};
	    var legalChars = {};
	    var caseSensitive = !!args.$caseSensitive;
	    var disallowEmpty = !!args.$disallowEmpty;
	    
	    var completionsVisible = false;
	    var completionsString = null;
	    var curCompletions = null;
	    var selectedCompletion = -1;
	    var completionsReverse = false;
	    
	    if (!caseSensitive) {
	    	enumValues = enumValues.map(function (enumValue) { return enumValue.toUpperCase(); });
	    } else {
	    	enumValues = enumValues.slice();
	    }
	    
	    enumValues.forEach(function (enumValue) {
	    	for (var i=0, l=enumValue.length; i<l; i++) {
	    		legalChars[enumValue[i]] = true;
	    		if (!caseSensitive) {
	    			legalChars[enumValue[i].toLowerCase()] = true;
	    		}
	    	}
	    	valueSet[enumValue] = true;
	    });
	    if (!disallowEmpty) {
	    	valueSet[""] = true;
	    }
	
	    var prefixTree = new PrefixTree(enumValues);
	    
	    function showCompletions() {
			var curVal = $input.val();
			if (!caseSensitive) curVal = curVal.toUpperCase();
			
			if (completionsVisible && curVal === completionsString) return;
			
			var completions = prefixTree.getCompletions(curVal);
			if (completions.length == 0) {
				hideCompletions();
				return;
			}
			
			completions = completions.slice(0, MAX_COMPLETIONS);
			$completions.empty();
			var holder = $("<div></div>");
			completions.forEach(function (completion) {
				holder.append(
					$("<div></div>").text(completion).click(setCompletionValue.bind(null, completion))
				);
			});
			$completions.empty().css({
				top: COMPLETIONS_TOP + "px",
				bottom: "auto"
			}).append(holder).show();
			
			var topY = $completions.offset().top;
			var height = $completions.outerHeight();
			var bottomY = topY + height;
			
			var viewportTop = sulka.viewport.offset().top; 
			var viewportBottom = viewportTop + sulka.viewport.innerHeight(); 
			
			// Show reverse list if full list can't fit under the text field and there is more space on top
			if (bottomY > viewportBottom && 
					bottomY - viewportBottom > 
					viewportTop - (topY - COMPLETIONS_TOP - COMPLETIONS_BOTTOM - height)) {
				$completions.hide();
				var reversedHolder = $("<div></div>");
				holder.find('>div').each(function () { reversedHolder.prepend(this); });
				$completions.empty().append(reversedHolder).show();
				$completions.css({
					bottom: COMPLETIONS_BOTTOM + "px",
					top: "auto"
				});
				completionsReverse = true;
			} else {
				completionsReverse = false;
			}
			selectedCompletion = -1;
			curCompletions = completions;
			completionsString = curVal;
			completionsVisible = true;
	    }
	    
	    function hideCompletions() {
	    	$completions.hide();
			completionsVisible = false;
	    }

	    function setCompletionValue(value) {
	    	$input.val(value);
	    	hideCompletions();
	    }
	    
	    this.init = function () {
		    $input = $('<INPUT type="text" class="editor-text editor-completions" />');
		    $completions = $('<DIV class="sulka-completions"></DIV>');
		    
		    $input.keyup(function (e) {
		    	if (e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT || 
		    			e.keyCode === $.ui.keyCode.ENTER) {
		    		return;
		    	}
		    	showCompletions();
		    });
		    
		    $input.bind("keydown.nav", function (e) {
		    	if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
		    		e.stopImmediatePropagation();
		    	}
		    	else if (completionsVisible) {
		    		if (e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.DOWN) {
		    			e.stopImmediatePropagation();
		    			
	    				var oldCompletion = selectedCompletion;
		    			if (e.keyCode === (completionsReverse ? $.ui.keyCode.UP : $.ui.keyCode.DOWN)) {
		    				selectedCompletion = Math.min(curCompletions.length-1, selectedCompletion + 1);
		    			} else {
		    				selectedCompletion--;
		    			}
						if (selectedCompletion < 0) {
							hideCompletions();
							return;
						} else if (oldCompletion !== selectedCompletion) {
	    					$completions.find('div div.selected-completion').removeClass();
	    					$completions.find('div div:nth-child(' + 
	    							(completionsReverse ? (curCompletions.length-selectedCompletion) : (selectedCompletion+1)) + 
	    					')').addClass("selected-completion");
	    				}
		    		} else if (e.keyCode === $.ui.keyCode.ENTER) {
		    			if (0 <= selectedCompletion) {
		    				setCompletionValue(curCompletions[Math.min(curCompletions.length-1, selectedCompletion)]);
		    			} else if (curCompletions.length === 1) {
		    				setCompletionValue(curCompletions[0]);
		    			}
		    		}
		    	}
		    });
		    
		    // Prevent inputting invalid chars
		    $input.keypress(function (e) {
		    	if (e.which >= 0x20 && !legalChars.hasOwnProperty(String.fromCharCode(e.which))) {
		    		e.preventDefault();
		    	}
		    });
	
		    $('<div></div>').append($completions).append($input).appendTo(args.container);
		    $input.focus().select();
	    };
	
	    this.destroy = function () {
	    	$input.remove();
	    	$completions.remove();
	    };
	
	    this.focus = function () {
	    	$input.focus();
	    };
	
	    this.loadValue = function (item) {
	    	defaultValue = item[args.column.field] || "";
	    	if (!caseSensitive) defaultValue = defaultValue.toUpperCase();
	    	$input.val(defaultValue);
	    	$input[0].defaultValue = defaultValue;
		    showCompletions();
	    	$input.select();
	    };
	
	    this.serializeValue = function () {
	    	if (caseSensitive)
	    		return $input.val();
	    	else
	    		return $input.val().toUpperCase();
	    };
	
	    this.applyValue = function (item, state) {
	    	item[args.column.field] = state;
	    };
	
	    this.isValueChanged = function () {
	    	if (caseSensitive)
	    		return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
	    	else
	    		return (!($input.val() == "" && defaultValue == null)) && ($input.val().toUpperCase() != defaultValue);
	    };
	
	    this.validate = function () {
	    	var curVal = $input.val();
	    	if (!caseSensitive) {
	    		curVal = curVal.toUpperCase();
	    	}
	    	
	    	if (!valueSet.hasOwnProperty(curVal)) {
		    	return {
		    		valid: false,
		    		msg: sulka.strings.invalidEnum
		    	};
	    	} else {
		    	return {
		    		valid: true,
		    		msg: null
		    	};
	    	}
	    };
	
	    this.init();
	},
	
	/**
	 * Editor for date fields.
	 */
	DateEditor: function (args) {
	    var $input = null;
	    var $completions = null;
	    // Maximum number of completions to show
	    var MAX_COMPLETIONS = 1;
	    
	    var defaultValue = null;
	    var legalChars = {
	    	1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 
	    	7: true, 8: true, 9: true, 0: true, ".": true
	    };
	    
	    var completionsVisible = false;
	    var completionsString = null;
	    var curCompletions = null;
	    var selectedCompletion = -1;
	    var completionsReverse = false;
	    
	    var EDIT_REGEXP = sulka.formatters.DATE_IN_REGEXP; 
	    var DATA_REGEXP = sulka.formatters.DATE_OUT_REGEXP;
	    function detectFormat(date) {
	    	if (typeof(date) === "string") {
	    		if (date.match(EDIT_REGEXP)) {
	    			return date;
	    		}
	    		var match = date.match(DATA_REGEXP);
	    		if (match !== null) {
	    			return match[3] + "." + match[2] + "." + match[1]; 
	    		}
	    	}
	    	return null;
	    }
	    function normalizeDate(date) {
	    	var formatted = detectFormat(date);
	    	return formatted === null ? date : formatted;
	    }
	    
	    var dateInputRe = /^((\d{1,2})\.)?((\d{1,2})\.)?(\d{1,4})(\.)?$/;
	    
	    /**
	     * Returns whether str considered as integer is in given closed range.
	     */
	    function inRange(str, start, end) {
	    	var int = parseInt(str, 10);
	    	return !isNaN(int) && start <= int && int <= end;
	    }
	    
	    function getCompletions(curVal) {
	    	curVal = curVal.trim();
	    	
	    	var suggestDate = moment();
	    	if (curVal.length === 0) {
	    		return [suggestDate.format("D.M.YYYY")];
	    	}
	    	
	    	var match = curVal.match(dateInputRe);
	    	if (match === null) {
	    		return [];
	    	}
	    	
	    	var val1 = match[2];
	    	var val2 = match[4];
	    	var val3 = match[5];
	    	var trailingDot = match[6] !== undefined;
	    	
	    	if (trailingDot && val3.length > 2) {
	    		// Year can not be followed by a dot
	    		return [];
	    	}
	    	
	    	var year = suggestDate.format("YYYY");
	    	var month = suggestDate.format("M");
	    	var day = suggestDate.format("D");
	    	
	    	if (val1 === undefined) {
	    		if (val3.length <= 2) {
	    			day = inRange(val3, 1, 31) ? val3 : day;
	    		} else {
	    			year = inRange(val3, 1, 9999) ? val3 : year;  
	    		}
	    	}
	    	else if (val2 === undefined) {
	    		if (val3.length <= 2) {
	    			day = inRange(val1, 1, 31) ? val1 : day;
	    			month = inRange(val3, 1, 12) ? val3 : month;
	    		} else {
	    			month = inRange(val1, 1, 12) ? val1 : month;
	    			year = inRange(val3, 1, 9999) ? val3 : year;
	    		}
	    	} else {
	    		day = inRange(val1, 1, 31) ? val1 : day;
	    		month = inRange(val2, 1, 12) ? val2: month;
	    		if (inRange(val3, 100, 9999)) {
	    			year = val3;
	    		} else if (inRange(val3, 1, 99)) {
	    			year = String(100*(Math.floor(suggestDate.year() / 100)) + parseInt(val3, 10));
	    		} 
	    	}
	    	
	    	return [ day + "." + month + "." + year ];
	    }
	    
	    function showCompletions() {
			var curVal = $input.val();
			
			if (completionsVisible && curVal === completionsString) return;
			
			var completions = getCompletions(curVal);
			if (completions.length == 0) {
				hideCompletions();
				return;
			}
			
			completions = completions.slice(0, MAX_COMPLETIONS);
			$completions.empty();
			var holder = $("<div></div>");
			completions.forEach(function (completion) {
				holder.append(
					$("<div></div>").text(completion).click(setCompletionValue.bind(null, completion))
				);
			});
			$completions.empty().css({
				top: COMPLETIONS_TOP + "px",
				bottom: "auto"
			}).append(holder).show();
			
			var topY = $completions.offset().top;
			var height = $completions.outerHeight();
			var bottomY = topY + height;
			
			var viewportTop = sulka.viewport.offset().top; 
			var viewportBottom = viewportTop + sulka.viewport.innerHeight(); 
			
			// Show reverse list if full list can't fit under the text field and there is more space on top
			if (bottomY > viewportBottom && 
					bottomY - viewportBottom > 
					viewportTop - (topY - COMPLETIONS_TOP - COMPLETIONS_BOTTOM - height)) {
				$completions.hide();
				var reversedHolder = $("<div></div>");
				holder.find('>div').each(function () { reversedHolder.prepend(this); });
				$completions.empty().append(reversedHolder).show();
				$completions.css({
					bottom: COMPLETIONS_BOTTOM + "px",
					top: "auto"
				});
				completionsReverse = true;
			} else {
				completionsReverse = false;
			}
			selectedCompletion = -1;
			curCompletions = completions;
			completionsString = curVal;
			completionsVisible = true;
	    }
	    
	    function hideCompletions() {
	    	$completions.hide();
			completionsVisible = false;
	    }

	    function setCompletionValue(value) {
	    	$input.val(value);
	    	hideCompletions();
	    }
	    
	    this.init = function () {
		    $input = $('<INPUT type="text" class="editor-text editor-completions editor-date" />');
		    $completions = $('<DIV class="sulka-completions"></DIV>');
		    
		    $input.keyup(function (e) {
		    	if (e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT || 
		    			e.keyCode === $.ui.keyCode.ENTER) {
		    		return;
		    	}
		    	showCompletions();
		    });
		    
		    $input.bind("keydown.nav", function (e) {
		    	if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
		    		e.stopImmediatePropagation();
		    	}
		    	else if (completionsVisible) {
		    		if (e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.DOWN) {
		    			e.stopImmediatePropagation();
		    			
	    				var oldCompletion = selectedCompletion;
		    			if (e.keyCode === (completionsReverse ? $.ui.keyCode.UP : $.ui.keyCode.DOWN)) {
		    				selectedCompletion = Math.min(curCompletions.length-1, selectedCompletion + 1);
		    			} else {
		    				selectedCompletion--;
		    			}
						if (selectedCompletion < 0) {
							hideCompletions();
							return;
						} else if (oldCompletion !== selectedCompletion) {
	    					$completions.find('div div.selected-completion').removeClass();
	    					$completions.find('div div:nth-child(' + 
	    							(completionsReverse ? (curCompletions.length-selectedCompletion) : (selectedCompletion+1)) + 
	    					')').addClass("selected-completion");
	    				}
		    		} else if (e.keyCode === $.ui.keyCode.ENTER) {
		    			if (0 <= selectedCompletion) {
		    				setCompletionValue(curCompletions[Math.min(curCompletions.length-1, selectedCompletion)]);
		    			} else if (curCompletions.length === 1) {
		    				setCompletionValue(curCompletions[0]);
		    			}
		    		}
		    	}
		    });
		    
		    // Prevent inputting invalid chars
		    $input.keypress(function (e) {
		    	if (e.which >= 0x20 && !legalChars.hasOwnProperty(String.fromCharCode(e.which))) {
		    		e.preventDefault();
		    	}
		    });
	
		    $('<div></div>').append($completions).append($input).appendTo(args.container);
		    $input.focus().select();
	    };
	
	    this.destroy = function () {
	    	$input.remove();
	    	$completions.remove();
	    };
	
	    this.focus = function () {
	    	$input.focus();
	    };
	
	    this.loadValue = function (item) {
	    	defaultValue = normalizeDate(item[args.column.field] || "");
	    	$input.val(defaultValue);
	    	$input[0].defaultValue = defaultValue;
		    showCompletions();
	    	$input.select();
	    };
	
	    this.serializeValue = function () {
	    	var trimmed = $input.val().trim();
	    	if (trimmed !== "") {
	    		var match = trimmed.match(EDIT_REGEXP);
	    		if (match !== null) {
	    			return match[3] + "." + match[2] + "." + match[1]; 
	    		}
	    	}
	    	return trimmed;
	    };
	
	    this.applyValue = function (item, state) {
	    	item[args.column.field] = state;
	    };
	
	    this.isValueChanged = function () {
    		return (!($input.val().trim() === "" && defaultValue === null)) && ($input.val().trim() !== defaultValue);
	    };
	
	    this.validate = function () {
	    	var curVal = $input.val();
	    	
	    	if (curVal.trim() !== "" && !curVal.match(EDIT_REGEXP)) {
		    	return {
		    		valid: false,
		    		msg: sulka.strings.invalidDateInput
		    	};
	    	}
	    	
	    	return {
	    		valid: true,
	    		msg: null
	    	};
	    };
	
	    this.init();
	},
	
	// This is expanded from Slick.Editors version with key handling (doesn't allow illegal chars to be inputted) 
	IntegerEditor: function (args) {
	    var $input;
	    var legalChars = {
	    	1: true, 2: true, 3: true, 4: true, 5: true, 
	    	6: true, 7: true, 8: true, 9: true, 0: true
	    };
	    var allowNegative = !!args.allowNegative;
	    if (allowNegative) {
	    	legalChars['-'] = true;
	    }
	    var defaultValue;

	    this.init = function () {
			$input = $('<INPUT type="text" class="editor-text editor-integer" />');
			
			$input.bind("keydown.nav", function (e) {
				if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
			    	e.stopImmediatePropagation();
			    }
			});
			
		    // Prevent inputting invalid chars
		    $input.keypress(function (e) {
		    	if (e.which >= 0x20 && !legalChars.hasOwnProperty(String.fromCharCode(e.which))) {
		    		e.preventDefault();
		    	}
		    });
		    
			$input.appendTo(args.container);
			$input.focus().select();
	    };

	    this.destroy = function () {
	    	$input.remove();
	    };

	    this.focus = function () {
	    	$input.focus();
	    };

	    this.loadValue = function (row) {
	    	var val = row[args.column.field];
	    	if (typeof(val) === "number" && isFinite(val)) {
	    		defaultValue = val;
		    	$input.val(String(defaultValue));
		    	$input[0].defaultValue = String(defaultValue);
	    	} else {
	    		defaultValue = null;
	    	}
	    	$input.select();
	    };

	    this.serializeValue = function () {
	    	var str = $input.val().trim();
	    	var int = parseInt(str, 10);
	    	if (!isNaN(int)) {
	    		if (int.toString().indexOf('e') >= 0) {
	    			return undefined; // Value has too many numbers
	    		}
	    		return int;
	    	}
	    	return undefined;
	    };

	    this.applyValue = function (item, state) {
	    	item[args.column.field] = state;
	    };

	    this.isValueChanged = function () {
	    	return (!($input.val().trim() === "" && defaultValue === null)) && 
	    		(parseInt($input.val().trim(), 10) !== defaultValue);
	    };

	    this.validate = function () {
	    	var str = $input.val().trim();
	    	if (str !== "") {
		    	var int = parseInt(str, 10);
		    	
		    	if (isNaN(int)) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.invalidInteger
		    		};
		    	} else if (!allowNegative && int < 0) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.negativeValue
		    		};
		    	} else if (int.toString().indexOf('e') >= 0) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.tooManyNumbers
		    		};
		    	}
	    	}

	    	return {
	    		valid: true,
	    		msg: null
	    	};
	    };

	    this.init();
	},
	
	DecimalEditor: function (args) {
	    var $input;
	    var legalChars = {
	    	1: true, 2: true, 3: true, 4: true, 5: true, 
	    	6: true, 7: true, 8: true, 9: true, 0: true,
	    	'.': true
	    };
	    var allowNegative = !!args.allowNegative;
	    if (allowNegative) {
	    	legalChars['-'] = true;
	    }
	    var defaultValue;

	    this.init = function () {
			$input = $('<INPUT type="text" class="editor-text editor-integer" />');
			
			$input.bind("keydown.nav", function (e) {
				if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
			    	e.stopImmediatePropagation();
			    }
			});
			
		    // Prevent inputting invalid chars
		    $input.keypress(function (e) {
		    	if (e.which >= 0x20 && !legalChars.hasOwnProperty(String.fromCharCode(e.which))) {
		    		e.preventDefault();
		    	}
		    });
		    
			$input.appendTo(args.container);
			$input.focus().select();
	    };

	    this.destroy = function () {
	    	$input.remove();
	    };

	    this.focus = function () {
	    	$input.focus();
	    };

	    this.loadValue = function (row) {
	    	var val = row[args.column.field];
	    	if (typeof(val) === "number" && isFinite(val)) {
	    		defaultValue = val;
		    	$input.val(String(defaultValue));
		    	$input[0].defaultValue = String(defaultValue);
	    	} else {
	    		defaultValue = null;
	    	}
	    	$input.select();
	    };

	    this.serializeValue = function () {
	    	var str = $input.val().trim();
	    	var float = parseFloat(str);
	    	if (isFinite(float)) {
	    		if (float.toString().indexOf('e') >= 0) {
	    			return undefined; // Value has too many numbers
	    		}
	    		return float;
	    	}
	    	return undefined;
	    };

	    this.applyValue = function (item, state) {
	    	item[args.column.field] = state;
	    };

	    this.isValueChanged = function () {
	    	return (!($input.val().trim() === "" && defaultValue === null)) && 
    			(parseFloat($input.val().trim()) !== defaultValue);
	    };

	    this.validate = function () {
	    	var str = $input.val().trim().replace(',', '.');
	    	if (str !== "") {
	    		var float = parseFloat(str);
		    	
		    	if (!isFinite(float)) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.invalidDecimal
		    		};
		    	} else if (!allowNegative && float < 0) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.negativeValue
		    		};
		    	} else if (float.toString().indexOf('e') >= 0) {
		    		return {
		    			valid: false,
		    			msg: sulka.strings.tooManyNumbers
		    		};
		    	}
	    	}

	    	return {
	    		valid: true,
	    		msg: null
	    	};
	    };

	    this.init();
	},

	// Exported just for testing
	_PrefixTree: PrefixTree
}; 
return editors; })();