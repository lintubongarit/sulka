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
	
	/**
	 * Called whenever column groups need to be re-rendered.
	 */
	function render() {
		var SLICK_WIDTH_ADJUST = -1000;
		
		var columns = grid.getColumns(),
			groupDivs = [];
		
		var currentGroup = null,
			currentGroupWidth = 0;
		
		$.each(columns, function () {
			if (currentGroup === this.$sulkaGroup) {
				currentGroupWidth += this.width;
			} else {
				if (currentGroup !== null) {
					groupDivs.push(makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
				}
				currentGroup = this.$sulkaGroup;
				currentGroupWidth = this.width;
			}
		});
		if (currentGroup !== null) {
			groupDivs.push(makeColumnGroup(currentGroup.name, currentGroup.description, currentGroupWidth));
		}
		
		columnGroupsDiv.empty().css(
			"width",
			(container.find(".slick-header-columns").width() + SLICK_WIDTH_ADJUST) + "px" 
		).append(
			groupDivs
		);
	}
	
	grid.onColumnsResized.subscribe(render);
	grid.onColumnsReordered.subscribe(render);
	
	$.extend(this, {
		render: render
	});
};