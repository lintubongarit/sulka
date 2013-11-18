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
						"\n" +
						"Longitude: " + parent.sulka.lastInputCoordinateLon +
						"\n" +
						"Latitude: " + parent.sulka.lastInputCoordinateLat);
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