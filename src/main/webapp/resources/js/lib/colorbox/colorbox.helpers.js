$(document).ready(function() {
	$(".iframe").colorbox({
		iframe : true,
		width : "85%",
		height : "85%",
//		closeButton : false,
//		overlayClose :false,
		title : "LUOMUS - Karttakomponentti",
		scrolling : false,
		arrowKey : false,
		className : "mapIframeClass",
		html : true,
		reposition : true
	});
	$(".callbacks").colorbox({
		onOpen : function() {
		},
		onLoad : function() {
		},
		onComplete : function() {
		},
		onCleanup : function() {
		},
		onClosed : function() {
			function confirmation() {
				var answer = confirm("" +
						"Haluatko varmasti kayttaa valitsemaasi koordinaattia?" +
						"Koordinaatti asetetaan kaikkiin valittuihin soluin." +
						"Toimintoa ei voida perua.");
						
					if (answer){
						parent.sulka.setCoordinateToRows();
				}
				else{
					return;
				}
			}
			if (parent.sulka.lastInputCoordinateLon != undefined && parent.sulka.lastInputCoordinateLat != undefined){
				confirmation();
			}
		}
	});
});