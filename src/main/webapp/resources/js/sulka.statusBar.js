/**
 * Loader animation and status bar handling.
 */
sulka.statusBar = function (statusBar) {
/**
 * Sets the user-visible status bar error text to a given value, 
 * or removes the text if a false-like value is given.
 * @param errorMsg New error string.
 */
function setStatusBar(errorMsg) {
	if (errorMsg) {
		if (errorMsg.length > 500) {
			errorMsg = errorMsg.substring(0, 500) + "...";
		} 
		$("#last-error").text(errorMsg);
	} else {
		$("#last-error").text("");
	}
}

/**
 * Removes user-visible status bar error text, if any. 
 */
function clearStatusBar() {
	setStatusBar("");
}

statusBar = {
	/**
	 * Current errors. The error message precedence (order of importance) is as listed. 
	 */
	currentErrors: {
		gridValidationError: null,
		validationServiceError: null,
		loadingError: null
	},
	
	/**
	 * Reflect currentErrors to the status bar. 
	 */
	updateStatusBar: function () {
		var currentErrors = statusBar.currentErrors;
		var errorArray = [];
		
		if (currentErrors.gridValidationError !== null) {
			errorArray.push(currentErrors.gridValidationError);
		}
		if (currentErrors.validationServiceError !== null) {
			errorArray.push(currentErrors.validationServiceError);
		}
		if (currentErrors.loadingError !== null) {
			errorArray.push(currentErrors.loadingError);
		}
		
		if (errorArray.length > 0) {
			setStatusBar(sulka.strings.joinStatusBarErrors(errorArray));
		} else {
			clearStatusBar();
		}
	},
	
	/**
	 * Set the loading error text.
	 * 
	 * @param str New error text, or falsy value to clear error.
	 */
	setLoadingError: function (str) {
		if (str) {
			statusBar.currentErrors.loadingError = str;
		} else {
			statusBar.currentErrors.loadingError = null;
		}
		statusBar.updateStatusBar();
	},
	
	/**
	 * Clear loading errors.
	 */
	clearLoadingError: function () {
		statusBar.setLoadingError(false);
	},
	
	/**
	 * Set the validation service error text.
	 * 
	 * @param str New error text, or falsy value to clear error.
	 */
	setValidationServiceError: function (str) {
		if (str) {
			statusBar.currentErrors.validationServiceError = str;
		} else {
			statusBar.currentErrors.validationServiceError = null;
		}
		statusBar.updateStatusBar();
	},
	
	/**
	 * Clear validation service errors.
	 */
	clearValidationServiceError: function () {
		statusBar.setValidationServiceError(false);
	},
	
	/**
	 * Set the grid validation error text.
	 * 
	 * @param str New error text, or falsy value to clear error.
	 */
	setGridValidationError: function (str) {
		if (str) {
			statusBar.currentErrors.gridValidationError = str;
		} else {
			statusBar.currentErrors.gridValidationError = null;
		}
		statusBar.updateStatusBar();
	},
	
	/**
	 * Clear loading errors.
	 */
	clearGridValidationError: function () {
		statusBar.setGridValidationError(false);
	},
	
	/**
	 * How many calls to showLoader() there has been?
	 */
	loaderCounter: 0,
	
	/**
	 * Show the loader animation. Each caller to this function MUST make sure that
	 * it eventually calls hideLoader() (or calls a function that calls hideLoader) 
	 */
	showLoader: function () {
		statusBar.loaderCounter++;
		$("#loader-animation").show();
	},
	
	/**
	 * Hide the loader animation.
	 */
	hideLoader: function () {
		if (--statusBar.loaderCounter <= 0) {
			if (statusBar.loaderCounter < 0) {
				sulka.helpers.log("hideLoader called without preceding showLoader!");
			}
			$("#loader-animation").hide();
		}
	},
	
	/**
	 * Hide the loader animation and set the error text.
	 */
	hideLoaderAndSetError: function (errorMsg) {
		statusBar.hideLoader();
		statusBar.setLoadingError(errorMsg);
	},
	
	/**
	 * Hide the loader animation and unset the error text.
	 * 
	 * @param errorMsg New error string.
	 */
	hideLoaderAndUnsetError: function () {
		statusBar.hideLoader();
		statusBar.clearLoadingError();
	},
	
	/**
	 * Unset the error text and show the loader animation.
	 * 
	 * @param errorMsg New error string.
	 */
	unsetErrorAndShowLoader: function () {
		statusBar.clearLoadingError();
		statusBar.showLoader();
	}
}; return statusBar; }();