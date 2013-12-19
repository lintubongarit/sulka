/**
 * To allow for "freezing" leftmost columns, there can be a second "shadow" SlickGrid 
 * to the left of the main SlickGrid. The freeze module is responsible for creating, 
 * updating and deconstructing this "shadow" SlickGrid ("the freeze grid").   
 */
sulka.freeze = (function (freeze) { 
freeze = {
	/**
	 * Currently frozen columns.
	 */ 
	columns: [],
	
	/**
	 * Currently frozen columns as a set by column ID.
	 */
	columnsSet: {},
	
	/**
	 * Does the freeze grid currently exist? The invariant is that visible=true iff columns.length > 0
	 */
	visible: false,
	
	/**
	 * Reference to the SlickGrid object of the freeze grid, if visible. 
	 */
	grid: null,
	
	/**
	 * The current total display width of the freeze grid.
	 */
	width: 0,
	
	/**
	 * Reference to the viewport container of the freeze grid.
	 */
	viewport: null,
	
	/**
	 * Reference to the main grid viewport.
	 */
	mainViewport: null,
	
	/**
	 * Freeze grid SlickGrid options. Inherits main grid options. 
	 */
	gridOptions: {
		enableCellNavigation: true,
	    editable: false,
	    enableAddRow: false,
	    asyncEditorLoading: false,
	    autoEdit: false
	},
	
	/**
	 * The CSS selector for the freeze grid container to use.
	 */
	freezeContainer: "#freeze-grid",
	/**
	 * The CSS selectro for the main grid container.
	 */
	mainContainer: "#slick-grid",
	
	/**
	 * String shorthand constants.
	 */
	RIGHT_TRIANGLE: "▶",
	LEFT_TRIANGLE: "◀",
	
	/**
	 * Init the freeze grid (called always from main grid init) 
	 */
	init: function () {
		if (sulka.viewMode != "browsing") return;
		var freezeButton = $("<div></div>")
			.addClass("header-freeze-button")
			.text(freeze.RIGHT_TRIANGLE)
			.click(sulka.freeze.freezeLeftColumn);
		sulka.helpers.disableSelection(freezeButton);
		$(freeze.mainContainer).append(freezeButton);
	},
	
	/**
	 * Freeze the leftmost column of main grid's unfreezed columns.
	 */
	freezeLeftColumn: function () {
		if (!sulka.grid) return;
		
		var cols = sulka.grid.getColumns();
		
		if (cols.length <= 1) {
			return;
		}
		
		var newCol = cols.shift();
		freeze.columns.push(newCol);
		sulka.grid.setColumns(cols);
		freeze.setColumns(freeze.columns);
		
		sulka.events.resizeGrid();
		sulka.reorderToColumnGroups();
	},
	
	/**
	 * Unfreeze the rightmost column of the freezed columns.
	 */
	unfreezeRightColumn: function () {
		if (!freeze.visible) return;
		
		var mainCols = sulka.grid.getColumns();
		var unfrozenColumn = freeze.columns.pop();
		mainCols.unshift(unfrozenColumn);
		sulka.grid.setColumns(mainCols);
		freeze.setColumns(freeze.columns);
	},
	
	/**
	 * Set freeze columns by array.
	 */
	setColumns: function (columns) {
		if (columns.length === 0 && !freeze.visible) return;
		
		freeze.columns = columns;
		if (columns.length === 0) {
			freeze.hideFreeze();
			freeze.columnsSet = {};
		} else {
			freeze.columnsSet = {};
			columns.forEach(function (column) {
				freeze.columnsSet[column.id] = true;
			});
			if (!freeze.visible) {
				freeze.showFreeze();
			} else {
				freeze.grid.setColumns(columns);
			}
		}
		sulka.events.resizeGrid();
		sulka.reorderToColumnGroups();
	},
	
	/**
	 * Position the container's top. Called from main grid positioning routine. 
	 * @param y Top y
	 */
	position: function (y) {
		$(freeze.freezeContainer).css({
			top: y + "px"
		});
		if (freeze.visilbe) {
			setTimeout(function () { freeze.grid.resizeCanvas(); }, 0);
		}
	},
	
	/**
	 * Make the freeze grid visible.
	 */
	showFreeze: function () {
		if (freeze.columns.length == 0 || freeze.visible) return;
		
		var freezeContainer = $(freeze.freezeContainer);
		
		if (freeze.grid === null) {
			freeze.grid = new Slick.Grid(freeze.freezeContainer, sulka.grid.getData(), freeze.columns, 
					$.extend({}, freeze.gridOptions, sulka.gridOptions));
			freeze.grid.$columnGroups = new sulka.groups(freeze.grid, freezeContainer);
			freeze.grid.onColumnsResized.subscribe(sulka.events.resizeGrid);
			freeze.grid.onSort.subscribe(freeze.onGridSort);
			freeze.viewport = freezeContainer.find(".slick-viewport").first();
			freeze.mainViewport = sulka.viewport;
			freeze.viewport.css("overflow", "hidden");
			if (typeof(freezeContainer.mousewheel) === "function") {
				freezeContainer.mousewheel(freeze.onMouseWheel);
			}
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
	 * Hide the freeze grid
	 */
	hideFreeze: function () {
		if (!freeze.visible) return;
		
		sulka.grid.onScroll.unsubscribe(freeze.onMainScroll);
		$(freeze.freezeContainer).hide();
		freeze.visible = false;
	},
	
	/**
	 * Mouse scroll wheel listener on the freeze grid. Synchronizes
	 * the scrolling with main grid.  
	 */
	onMouseWheel: function (event, delta, deltaX, deltaY) {
		if (!freeze.visible) return;
		sulka.events.onMouseWheel(event, delta, deltaX, deltaY);
	},
	
	/**
	 * Called from the main grid to notify of scrolling. Synchronizes
	 * the scrolling with main grid.
	 */
	onMainScroll: function (event, args) {
		freeze.viewport.scrollTop(freeze.mainViewport.scrollTop());
	},
	
	/**
	 * Set current data
	 * @param rows the new data (rows)
	 */
	setData: function(rows) {
		if (!freeze.visible)  return;
		freeze.grid.setData(rows);
		freeze.grid.render();
	},
	
	/**
	 * Redraw. 
	 */
	invalidate: function () {
		if (!freeze.visible)  return;
		freeze.grid.invalidate();
	},
	
	/**
	 * Called from main grid to notify that the freeze grid should resize itself.
	 */
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
	
	/**
	 * Call render on the freeze grid's local column groups module.
	 */
	renderColumnGroups: function () {
		if (freeze.visible && freeze.grid.$columnGroups) freeze.grid.$columnGroups.render();
	},
	
	/**
	 * Notify the freeze grid's local column groups module of column reordering.
	 */
	reorderToColumnGroups: function () {
		if (freeze.visible && freeze.grid.$columnGroups) freeze.grid.$columnGroups.onReordered();
	},
	
	/**
	 * Get the width of freeze-grid.
	 * 
	 * @returns Width of grid.
	 */
	getWidth: function () {
		if (!freeze.visible) return 0;
		return freeze.width;
	},
	
	/**
	 * Listener for the sort event on the freeze grid. Removes sort markers from
	 * the main grid, and then sorts according to the freeze grid.
	 */
	onGridSort: function (event, args) {
		if (!freeze.visible) return;
		
		$(freeze.mainContainer).find(".slick-header-columns .slick-header-column-sorted").removeClass("slick-header-column-sorted");
		$(freeze.mainContainer).find(".slick-header-columns .slick-sort-indicator-asc").removeClass("slick-sort-indicator-asc");
		$(freeze.mainContainer).find(".slick-header-columns .slick-sort-indicator-desc").removeClass("slick-sort-indicator-desc");
		
		sulka.parseSort(args);
	},
	
	/**
	 * Called by the main grid to notify that it is now dictating the sort order, and the
	 * freeze grid should remove its sort markers.  
	 */
	removeSortMarkers: function () {
		if (!freeze.visible) return;
		
		$(freeze.freezeContainer).find(".slick-header-columns .slick-header-column-sorted").removeClass("slick-header-column-sorted");
		$(freeze.freezeContainer).find(".slick-header-columns .slick-sort-indicator-asc").removeClass("slick-sort-indicator-asc");
		$(freeze.freezeContainer).find(".slick-header-columns .slick-sort-indicator-desc").removeClass("slick-sort-indicator-desc");
	},
	
	/**
	 * Returns whether specified column id is currently in the frozen columns set.
	 */
	isFrozen: function (columnId) {
		return freeze.columnsSet.hasOwnProperty(columnId);
	}
}; return freeze; })();