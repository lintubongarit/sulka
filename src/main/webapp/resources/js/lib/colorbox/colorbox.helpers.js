$(document).ready(function() {
	$(".iframe").colorbox({
		iframe : true,
		width : "80%",
		height : "80%"
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
					
				}
			}
			if (parent.sulka.lastInputCoordinateLon != undefined && parent.sulka.lastInputCoordinateLat != undefined){
				confirmation();
			}
		}
	});
});