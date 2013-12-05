/**
 * This file should contain all frontend user-visible messages, so that they
 * can be localized should the need arise at some point. Parametized strings 
 * can be defined as functions that return strings.  
 */
sulka.strings = {
	noResults: "Ei hakutuloksia!",
	invalidDate: "Virheellinen päivämäärä!",
	inverseDateRange: "Virheellinen päivämäärä (alku>loppu)!",
	validRow: "Rivi OK",
	couldNotInsert: "Riviä ei voitu lisätä",
	settingsSaveFailed: "Asetusten tallentaminen epäonnistui.",
	settingsReceivedFailed: "Asetusten nouto epäonnistui.",
	invalidEnum: "Tuntematon sarakkeen arvo",
	coordinateConversionFailed: "Koordinaattien konvertointi WGS84 muodosta YKJ muotoon epäonnistui",
	invalidDateInput: "Virheellinen päivämäärä (syötä muodossa pp.kk.vvvv)",
	dragToDelete: function (amount) {
		if (amount == 1) {
			return "Raahaa roskakrooin poistaaksesi rivin";
		} else {
			return "Raahaa roskakrooin poistaaksesi " + amount + " riviä";
		}
	},
	fieldErrorString: function (fieldName, fieldErrors) {
		return fieldName + ": " + fieldErrors.join(sulka.strings.listSeparator);
	},
	validationFailed: function (errors) {
		return "Rivillä on virheitä (" + sulka.strings.listJoin(errors) + ")";
	},
	invalidInteger: "Virheellinen kokonaislukusyöte.",
	negativeInteger: "Syötä positiivinen kokonaisluku.",
	joinStatusBarErrors: function (errorArray) {
		return errorArray.join(" – ");
	},
	spaceAndSpace: " ja ",
	listSeparator: ", ",
	listJoin: function (listOfStrings) {
		if (listOfStrings.length > 1) {
			return listOfStrings.slice(0, -1).join(sulka.strings.listSeparator) + 
				sulka.strings.spaceAndSpace + 
				listOfStrings.slice(-1);
		}
		if (listOfStrings.length > 0) {
			return listOfStrings[0];
		}
		return "";
	}
};