sulka.freeze = (function (freeze) { freeze = {
	columns: [],
	visible: false,
	grid: null,
	width: 0,
	
	viewport: null,
	mainViewport: null,
	
	gridOptions: {
		enableCellNavigation: true,
		enableColumnReorder: false
	},

	RIGHT_TRIANGLE: "▶",
	init: function () {
		var freezeButton = $("<div></div>")
			.addClass("header-freeze-button")
			.text(freeze.RIGHT_TRIANGLE)
			.click(sulka.freeze.freezeLeftColumn);
		sulka.helpers.disableSelection(freezeButton);
		$("#slick-grid .slick-header-columns").first().before(freezeButton);
	},
	
	rows: [],
	setRows: function (rows) {
		if (!freeze.visible) {
			return;
		}
		freeze.grid.setData(freeze.rows);
	},
	
	freezeLeftColumn: function () {
		if (!sulka.grid) return;
		
		var cols = sulka.grid.getColumns();
		
		if (cols.length == 0) {
			return;
		}
		
		var clone = $.extend({}, cols.shift());
		
		clone.resizable = false;
		freeze.columns.push(clone);
		
		if (!freeze.visible) {
			freeze.showFreeze();
		} else {
			freeze.grid.setColumns(freeze.columns);
		}
		sulka.grid.setColumns(cols);
		sulka.renderColumnGroups();
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
	
	renderColumnGroups: function () {
		if (freeze.visible && freeze.grid.$columnGroups) freeze.grid.$columnGroups.render();
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