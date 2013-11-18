$(document).ready(function() {
	$(".iframe").colorbox({
		iframe : true,
		width : "80%",
		height : "80%"
	});
	$(".callbacks").colorbox({
		onOpen : function() {
			//alert('onOpen: colorbox is about to open');
		},
		onLoad : function() {
			//alert('onLoad: colorbox has started to load the targeted content');
		},
		onComplete : function() {
			//alert('onComplete: colorbox has displayed the loaded content');
		},
		onCleanup : function() {
			//alert('onCleanup: colorbox has begun the close process');
		},
		onClosed : function() {
			//alert('onClosed: colorbox has completely closed');
			//alert(sulka.koordinaatti);
			sulka.setCoordinateToRows();
		}
	});
});