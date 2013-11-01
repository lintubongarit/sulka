(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "RowSelectionModel": RowSelectionModel
    }
  });

  function RowSelectionModel(options) {
    var _grid;
    var _ranges = [];
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _inHandler;
    var _options;
    var _defaults = {
      selectActiveRow: true
    };

    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _handler.subscribe(_grid.onActiveCellChanged,
          wrapHandler(handleActiveCellChange));
      _handler.subscribe(_grid.onKeyDown,
          wrapHandler(handleKeyDown));
      _handler.subscribe(_grid.onClick,
          wrapHandler(handleClick));
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function wrapHandler(handler) {
      return function () {
<<<<<<< HEAD
        if (!sulka.inHandler) {
          sulka.inHandler = true;
          handler.apply(this, arguments);
          sulka.inHandler = false;
=======
        if (!_inHandler) {
          _inHandler = true;
          handler.apply(this, arguments);
          _inHandler = false;
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
        }
      };
    }

    function rangesToRows(ranges) {
      var rows = [];
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          rows.push(j);
        }
      }
      return rows;
    }

    function rowsToRanges(rows) {
      var ranges = [];
<<<<<<< HEAD
      var lastCell = sulka.grid.getColumns().length - 1;
=======
      var lastCell = _grid.getColumns().length - 1;
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
      for (var i = 0; i < rows.length; i++) {
        ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
      }
      return ranges;
    }

    function getRowsRange(from, to) {
      var i, rows = [];
      for (i = from; i <= to; i++) {
        rows.push(i);
      }
      for (i = to; i < from; i++) {
        rows.push(i);
      }
      return rows;
    }

    function getSelectedRows() {
      return rangesToRows(_ranges);
    }

    function setSelectedRows(rows) {
      setSelectedRanges(rowsToRanges(rows));
    }

    function setSelectedRanges(ranges) {
      _ranges = ranges;
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    function handleActiveCellChange(e, data) {
<<<<<<< HEAD
      if (sulka.options.selectActiveRow && data.row != null) {
        setSelectedRanges([new Slick.Range(data.row, 0, data.row, sulka.grid.getColumns().length - 1)]);
=======
      if (_options.selectActiveRow && data.row != null) {
        setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
      }
    }

    function handleKeyDown(e) {
<<<<<<< HEAD
      var activeRow = sulka.grid.getActiveCell();
      if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
        var selectedRows = getSelectedRows();
        selectedRows.sort(function (x, y) {
          return x - y;
=======
      var activeRow = _grid.getActiveCell();
      if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
        var selectedRows = getSelectedRows();
        selectedRows.sort(function (x, y) {
          return x - y
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
        });

        if (!selectedRows.length) {
          selectedRows = [activeRow.row];
        }

        var top = selectedRows[0];
        var bottom = selectedRows[selectedRows.length - 1];
        var active;

        if (e.which == 40) {
          active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
        } else {
          active = activeRow.row < bottom ? --bottom : --top;
        }

<<<<<<< HEAD
        if (active >= 0 && active < sulka.grid.getDataLength()) {
          sulka.grid.scrollRowIntoView(active);
=======
        if (active >= 0 && active < _grid.getDataLength()) {
          _grid.scrollRowIntoView(active);
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
          _ranges = rowsToRanges(getRowsRange(top, bottom));
          setSelectedRanges(_ranges);
        }

        e.preventDefault();
        e.stopPropagation();
      }
    }

    function handleClick(e) {
<<<<<<< HEAD
      var cell = sulka.grid.getCellFromEvent(e);
      if (!cell || !sulka.grid.canCellBeActive(cell.row, cell.cell)) {
        return false;
      }

      if (!sulka.grid.getOptions().multiSelect || (
=======
      var cell = _grid.getCellFromEvent(e);
      if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)) {
        return false;
      }

      if (!_grid.getOptions().multiSelect || (
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
          !e.ctrlKey && !e.shiftKey && !e.metaKey)) {
        return false;
      }

      var selection = rangesToRows(_ranges);
      var idx = $.inArray(cell.row, selection);

      if (idx === -1 && (e.ctrlKey || e.metaKey)) {
        selection.push(cell.row);
<<<<<<< HEAD
        sulka.grid.setActiveCell(cell.row, cell.cell);
=======
        _grid.setActiveCell(cell.row, cell.cell);
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
      } else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
        selection = $.grep(selection, function (o, i) {
          return (o !== cell.row);
        });
<<<<<<< HEAD
        sulka.grid.setActiveCell(cell.row, cell.cell);
=======
        _grid.setActiveCell(cell.row, cell.cell);
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
      } else if (selection.length && e.shiftKey) {
        var last = selection.pop();
        var from = Math.min(cell.row, last);
        var to = Math.max(cell.row, last);
        selection = [];
        for (var i = from; i <= to; i++) {
          if (i !== last) {
            selection.push(i);
          }
        }
        selection.push(last);
<<<<<<< HEAD
        sulka.grid.setActiveCell(cell.row, cell.cell);
=======
        _grid.setActiveCell(cell.row, cell.cell);
>>>>>>> ff80a0de351870895168e108dea3a553708b099a
      }

      _ranges = rowsToRanges(selection);
      setSelectedRanges(_ranges);
      e.stopImmediatePropagation();

      return true;
    }

    $.extend(this, {
      "getSelectedRows": getSelectedRows,
      "setSelectedRows": setSelectedRows,

      "getSelectedRanges": getSelectedRanges,
      "setSelectedRanges": setSelectedRanges,

      "init": init,
      "destroy": destroy,

      "onSelectedRangesChanged": new Slick.Event()
    });
  }
})(jQuery);