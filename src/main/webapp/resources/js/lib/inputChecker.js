/**
 * 
 */

function inputLimiter(e, allow) {
	var AllowableCharacters = '';

	if (allow == 'date') {
		AllowableCharacters = '1234567890-.';
	}
	if (allow == 'Letters') {
		AllowableCharacters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	}
	var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
	if (k != 13 && k != 8 && k != 0) {
		if ((e.ctrlKey == false) && (e.altKey == false)) {
			return (AllowableCharacters.indexOf(String.fromCharCode(k)) != -1);
		} else {
			return true;
		}
	} else {
		return true;
	}
}