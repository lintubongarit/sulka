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
			$completions.empty().append(holder).show();
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
		    			if (e.keyCode === $.ui.keyCode.DOWN) {
		    				selectedCompletion = Math.min(curCompletions.length-1, selectedCompletion + 1);
		    			} else {
		    				selectedCompletion--;
		    			}
						if (selectedCompletion < 0) {
							hideCompletions();
							return;
						} else if (oldCompletion !== selectedCompletion) {
	    					$completions.find('div div').removeClass("selected-completion");
	    					$completions.find('div div:nth-child(' + (selectedCompletion+1) + ')').addClass("selected-completion");
	    				}
		    		} else if (e.keyCode === $.ui.keyCode.ENTER && 0 <= selectedCompletion) {
		    			setCompletionValue(curCompletions[Math.min(curCompletions.length-1, selectedCompletion)]);
		    		}
		    	}
		    });
		    
		    // Prevent inputting invalid chars
		    $input.keypress(function (e) {
		    	if (e.which >= 0x20 && !legalChars.hasOwnProperty(String.fromCharCode(e.which))) {
		    		e.preventDefault();
		    	}
		    });
	
		    showCompletions();
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
	
	// Exported just for testing
	_PrefixTree: PrefixTree
}; 
return editors; })();