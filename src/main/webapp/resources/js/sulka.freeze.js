sulka.freeze = (function (freeze) { freeze = {
	columns: [],
	visible: false,
	grid: null,
	width: 0,
	
	viewport: null,
	mainViewport: null,
	
	initFreeze: function (columns) {
		freeze.columns = columns;
		if (freeze.columns.length > 0) {
			freeze.showFreeze();
		}
	},
	
	rows: [],
	setRows: function (rows) {
		if (!freeze.visible) {
			return;
		}
		freeze.grid.setData(freeze.rows);
	},
	
	freezeColumn: function (col) {
		freeze.columns.push(col);
		if (!freeze.visible) {
			freeze.showFreeze();
		} else {
			freeze.setColumns(freeze.columns);
		}
	},
	
	unfreezeColumn: function (col) {
		if (!freeze.shown) {
			return;
		}
		
		for (var i=0; i<freeze.columns.length; i++) {
			if (freeze.columns[i].id == col.id) {
				freeze.columns.splice(i, 1);
				if (freeze.columns.length > 0) {
					freeze.grid.setColumns(freeze.columns);
				} else {
					freeze.hideFreeze();
				}
			}
		}
	},
	
	position: function (y) {
		$("#freeze-grid").css({
			top: y + "px"
		});
		if (freeze.visilbe) {
			freeze.grid.resizeCanvas();
		}
	},
	
	showFreeze: function () {
		if (freeze.columns.length == 0 || freeze.visible) return;
		
		var freezeContainer = $("#freeze-grid");
		var mainContainer = $("#slick-grid");
		
		freeze.width = 0;
		$.each(freeze.columns, function () {
			freeze.width += this.width;
		});
		
		mainContainer.css("left", freeze.width + "px");
		mainContainer.css("width", mainContainer.width() - freeze.width + "px");
		sulka.grid.resizeCanvas();
		freezeContainer.width(freeze.width);
		
		freeze.grid = new Slick.Grid("#freeze-grid", sulka.grid.getData(), freeze.columns, sulka.gridOptions);
		
		freeze.viewport = freezeContainer.find(".slick-viewport").first();
		freeze.mainViewport = mainContainer.find(".slick-viewport").first();
		freeze.viewport.css("overflow", "hidden");
		sulka.grid.onScroll.subscribe(freeze.onMainScroll);
		freeze.onMainScroll();
		
		freezeContainer.show();
		
		freeze.visible = true;
	},
	
	onMainScroll: function (event, args) {
		freeze.viewport.scrollTop(freeze.mainViewport.scrollTop());
	},
	
	hideFreeze: function () {
		if (!freeze.visible) return;
		sulka.grid.onScroll.unsubscribe(freeze.onMainScroll);
	},
	
	getWidth: function () {
		if (!freeze.visible) return 0;
		return freeze.width;
	}
}; return freeze; })();