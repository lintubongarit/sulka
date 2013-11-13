sulka.freeze = (function (freeze) { freeze = {
	columns: [],
	visible: false,
	grid: null,
	width: 0,
	
	viewport: null,
	mainViewport: null,
	
	gridOptions: {
		enableCellNavigation: true,
	    editable: false,
	    enableAddRow: false,
	    asyncEditorLoading: false,
	    autoEdit: false
	},
	
	freezeContainer: "#freeze-grid",
	mainContainer: "#slick-grid",
	
	RIGHT_TRIANGLE: "▶",
	LEFT_TRIANGLE: "◀",
	
	init: function () {
		if (sulka.viewMode != "browsing") return;
		var freezeButton = $("<div></div>")
			.addClass("header-freeze-button")
			.text(freeze.RIGHT_TRIANGLE)
			.click(sulka.freeze.freezeLeftColumn);
		sulka.helpers.disableSelection(freezeButton);
		$(freeze.mainContainer).append(freezeButton);
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
		
		freeze.columns.push(cols.shift());
		
		sulka.grid.setColumns(cols);
		if (!freeze.visible) {
			freeze.showFreeze();
		} else {
			freeze.grid.setColumns(freeze.columns);
		}
		sulka.resizeGrid();
		sulka.renderColumnGroups();
	},
	
	unfreezeRightColumn: function () {
		if (!freeze.visible) return;
		
		var mainCols = sulka.grid.getColumns();
		mainCols.unshift(freeze.columns.pop());
		
		sulka.grid.setColumns(mainCols);
		if (freeze.columns.length === 0) {
			freeze.hideFreeze();
		} else {
			freeze.grid.setColumns(freeze.columns);
		}
		sulka.resizeGrid();
		sulka.renderColumnGroups();
	},
	
	position: function (y) {
		$(freeze.freezeContainer).css({
			top: y + "px"
		});
		if (freeze.visilbe) {
			setTimeout(function () { freeze.grid.resizeCanvas(); }, 0);
		}
	},
	
	showFreeze: function () {
		if (freeze.columns.length == 0 || freeze.visible) return;
		
		var freezeContainer = $(freeze.freezeContainer);
		
		if (freeze.grid === null) {
			freeze.grid = new Slick.Grid(freeze.freezeContainer, sulka.grid.getData(), freeze.columns, 
					$.extend({}, freeze.gridOptions, sulka.gridOptions));
			freeze.grid.$columnGroups = new sulka.groups(freeze.grid, freezeContainer);
			freeze.grid.onColumnsResized.subscribe(sulka.resizeGrid);
			freeze.grid.onSort.subscribe(freeze.onGridSort);
			freeze.viewport = freezeContainer.find(".slick-viewport").first();
			freeze.mainViewport = sulka.viewport;
			freeze.viewport.css("overflow", "hidden");
			freezeContainer.mousewheel(freeze.onMouseWheel);
			var unfreezeButton = $("<div></div>")
				.addClass("header-unfreeze-button")
				.text(freeze.LEFT_TRIANGLE)
				.click(sulka.freeze.unfreezeRightColumn);
			sulka.helpers.disableSelection(unfreezeButton);
			freezeContainer.append(unfreezeButton);
		}
		
		sulka.grid.onScroll.subscribe(freeze.onMainScroll);
		freeze.onMainScroll();
		
		freezeContainer.show();
		freeze.visible = true;
	},
	
	/**
	 * Scrolls main container on mouse wheel.
	 */
	onMouseWheel: function (event, delta, deltaX, deltaY) {
		if (!freeze.visible) return;
		sulka.onMouseWheel(event, delta, deltaX, deltaY);
	},
	
	setData: function(rows) {
		if (!freeze.visible)  return;
		freeze.grid.setData(rows);
		freeze.grid.render();
	},
	
	invalidate: function () {
		if (!freeze.visible)  return;
		freeze.grid.invalidate();
	},
	
	resize: function () {
		if (!freeze.visible) return;
		
		var width = 0;
		$.each(freeze.columns, function () {
			width += this.width;
		});
		freeze.width = Math.min($(window).width(), width);
		
		$(freeze.freezeContainer).width(freeze.width);
		setTimeout(function () { freeze.grid.resizeCanvas(); }, 0);
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
		$(freeze.freezeContainer).hide();
		freeze.visible = false;
	},
	
	getWidth: function () {
		if (!freeze.visible) return 0;
		return freeze.width;
	},
	
	onGridSort: function (event, args) {
		if (!freeze.visible) return;
		
		$(freeze.mainContainer).find(".slick-header-columns .slick-header-column-sorted").removeClass("slick-header-column-sorted");
		$(freeze.mainContainer).find(".slick-header-columns .slick-sort-indicator-asc").removeClass("slick-sort-indicator-asc");
		$(freeze.mainContainer).find(".slick-header-columns .slick-sort-indicator-desc").removeClass("slick-sort-indicator-desc");
		
		console.log($(freeze.mainContainer).find(".slick-header-columns .slick-sort-indicator-asc").length);
		
		sulka.sort(args);
	},
	
	removeSortMarkers: function () {
		if (!freeze.visible) return;
		
		$(freeze.freezeContainer).find(".slick-header-columns .slick-header-column-sorted").removeClass("slick-header-column-sorted");
		$(freeze.freezeContainer).find(".slick-header-columns .slick-sort-indicator-asc").removeClass("slick-sort-indicator-asc");
		$(freeze.freezeContainer).find(".slick-header-columns .slick-sort-indicator-desc").removeClass("slick-sort-indicator-desc");
	}
}; return freeze; })();