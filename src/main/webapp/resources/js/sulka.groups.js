/**
 * The groups implementation is a hack that draws a different, aligned set of "group columns" above the SlickGrid columns, 
 * and enforces that the defined groups can not be broken.  
 */
sulka.groups = function (grid, container) {
	var COL_GROUP_OUTSIDE_WIDTH = 9;
	
	var columnGroupsDiv = $(
		'<div></div>'
	).addClass(
		'column-group-headers'
	).insertBefore(
		container.find('div.slick-header div.slick-header-columns:first-child')
	);
	sulka.helpers.disableSelection(columnGroupsDiv);
	
	/**
	 * Create column group element. 
	 */
	function makeColumnGroup(name, description, width) {
		return $(
			'<div></div>'
		).addClass(
			'column-group-header'
		).append(
			$(
				'<span></span>'
			).addClass(
				'column-group-name'
			).text(
				description
			).attr(
				"title",
				description
			)
		).css(
			"width",
			(width - COL_GROUP_OUTSIDE_WIDTH) + "px"
		).data(
			"sulka.group.id",
			name
		);
	}
	
	var groupFirsts = {};
	var groupLasts = {};
	/**
	 * Called whenever column groups need to be re-rendered.
	 */
	function render() {
		var SLICK_WIDTH_ADJUST = -1000;
		
		var columns = grid.getColumns(),
			groupDivs = [],
			newGroupFirsts = {},
			newGroupLasts = {};
		
		var currentGroup = null,
			currentGroupWidth = 0;
		
		columns.forEach(function (column) {
			newGroupLasts[column.$sulkaGroup.name] = column;
			
			if (currentGroup === column.$sulkaGroup) {
				currentGroupWidth += column.width;
			} else {
				if (currentGroup !== null) {
					groupDivs.push(makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
				}
				currentGroup = column.$sulkaGroup;
				currentGroupWidth = column.width;
				if (!newGroupFirsts.hasOwnProperty(currentGroup.name)) {
					newGroupFirsts[currentGroup.name] = column;
				}
			}
		});
		if (currentGroup !== null) {
			groupDivs.push(makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
		}
		
		columnGroupsDiv.empty().width(
			container.find(".slick-header-columns").width() + SLICK_WIDTH_ADJUST 
		).append(
			groupDivs
		);
		groupFirsts = newGroupFirsts;
		groupLasts = newGroupLasts;
	}
	
	/**
	 * Called after columns have been reordered to enforce that groups have not been broken.
	 */
	function onReordered() {
		var curGroupIndex = 0;
		var groups = {};
		var columns = sulka.grid.getColumns().slice();
		var lastGroup = null;
		
		columns.forEach(function (column) {
			var curGroup = column.$sulkaGroup;
			
			if (!groups.hasOwnProperty(curGroup.name)) {
				groups[curGroup.name] = {
					columns: [ column ],
					index: curGroupIndex++
				};
			} else {
				groups[curGroup.name].columns.push(column);
			}
			
			if (lastGroup !== curGroup) {
				// Set index by stray first/last 
				if (groupFirsts.hasOwnProperty(curGroup.name) && groupFirsts[curGroup.name].id === column.id) {
					groups[curGroup.name].index = curGroupIndex++;
				}
				else if (groupLasts.hasOwnProperty(curGroup.name) && groupLasts[curGroup.name].id === column.id) {
					groups[curGroup.name].index = curGroupIndex++;
				}
			}
			
			lastGroup = curGroup;
		});
		
		var groupArray = [];
		for (var group in groups) if (groups.hasOwnProperty(group)) {
			groupArray.push(groups[group]);
		}
		groupArray.sort(function(x, y) { return x.index - y.index; });
		var newCols = groupArray.reduce(function (cols, group) { return cols.concat(group.columns); }, []);
		sulka.grid.setColumns(newCols);
		
		render();
	}
	
	grid.onColumnsResized.subscribe(render);
	grid.onColumnsReordered.subscribe(onReordered);
	render();
	
	$.extend(this, {
		render: render,
		onReordered: onReordered
	});
};