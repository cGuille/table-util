(function (window, document, $, undefined) {
    'use strict';

    // Table Util module:
    var exports = window.TU = {};
    exports.TableFilter = TableFilter;
    exports.TablePager = TablePager;
    /////////////////////

    // ----- TablePager implementation ----- 
    function TablePager(tableElt, itemsPerPage, page) {
        if (!this) {
            return new TablePager(tableElt, itemsPerPage, page);
        }
        this._root = tableElt;
        this._page = typeOf(page) === 'number' ? page : 1;
        if (this._page < 1) {
            this._page = 1;
        }
        this._itemsPerPage = typeOf(itemsPerPage) === 'number' ? itemsPerPage : 10;
        refreshPagination.call(this);
    }
    TablePager.prototype.enable = function() {
        refreshPagination.call(this);
    };
    TablePager.prototype.disable = function() {
        var rows = [],
            tds = this._root.getElements('td:first-child');

        tds.each(function (td) {
            rows.push(td.getParent());
        });

        rows.each(function (row) {
            row.removeClass('tp-hidden');
        });
    };
    TablePager.prototype.addEvent = function(type, fn) {
        this._root.addEvent(type, fn);
    };
    TablePager.prototype.getItemsPerPage = function () {
        return this._itemsPerPage;
    };
    TablePager.prototype.setItemsPerPage = function (itemsPerPage) {
        this._itemsPerPage = typeOf(itemsPerPage) === 'number' ? itemsPerPage : 10;
        refreshPagination.call(this);
    };
    TablePager.prototype.back = function () {
        var newPage = this.getCurrentPage() - 1;
        this._root.fireEvent('pageBack', newPage);
        this.goTo(newPage);
    };
    TablePager.prototype.next = function () {
        var newPage = this.getCurrentPage() + 1;
        this._root.fireEvent('pageNext', newPage);
        this.goTo(newPage);
    };
    TablePager.prototype.goTo = function (page) {
        this._page = typeOf(page) === 'number' ? page : 1;
        if (this._page < 1) {
            this._page = 1;
        }
        var status = refreshPagination.call(this);
        this._root.fireEvent('pageChange', status);
    };
    TablePager.prototype.getCurrentPage = function () {
        return this._page;
    };
    function refreshPagination() {
        var rows = [],
            tds = this._root.getElements('td:first-child'),
            first = (this.getCurrentPage() - 1) * this.getItemsPerPage(),
            last = first + this.getItemsPerPage() - 1;

        tds.each(function (td) {
            rows.push(td.getParent());
        });

        rows.each(function (trElt, index) {
            if (index < first || index > last) {
                trElt.addClass('tp-hidden');
            } else {
                trElt.removeClass('tp-hidden');
            }
        });

        return { page: this.getCurrentPage(), nbPages: Math.ceil(rows.length / this.getItemsPerPage()) };
    }
    /////////////////////////////////////////

    // ----- TableFilter implementation -----
    function TableFilter(tableElt, tolerance) {
        if (!this) {
            return new TableFilter(tableElt, tolerance);
        }
        this._root = tableElt;
        this.setTolerance(tolerance);
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].title === 'TU') {
                this._styleSheet = document.styleSheets[i];
            }
        }

        var firstRow = this._root.getElement('tr:first-child'),
            nbColumns;
        if (!firstRow) {
            console.error('This table seems to be empty.');
        } else {
            nbColumns = firstRow.getChildren().length;
            if (!this._styleSheet) {
                console.error('Cannot found the table-util.css stylesheet.');
            } else {
                for (var i = 1; i <= nbColumns; i++) {
                    this._styleSheet.insertRule('.tf-hidden-' + i + '{ display: none; }', 0);
                }
            }
        }
    }

    TableFilter.prototype.addEvent = function(type, fn) {
        this._root.addEvent(type, fn);
    };

    TableFilter.prototype.getTolerance = function () {
        return this._tolerance;
    };

    TableFilter.prototype.setTolerance = function (tolerance) {
        this._tolerance = typeOf(tolerance) === 'number' ? tolerance : 0;
    };

    TableFilter.prototype.filter = function (columnIndex, str) {
        var filter = this,
            toHide = [],
            tds = this._root.getElements('td:nth-child(' + columnIndex + ')');

            str = str.replace(/\s/g, '').toLowerCase();
            this._root.fireEvent('beforeFilter', { columnIndex: columnIndex, value: str });

            if (str === '') {
                this._root.getElements('tr').each(function (tr) {
                    tr.removeClass('tf-hidden-' + columnIndex);
                });
            } else {
                tds.each(function (td) {
                    var cleanedTdText = td.get('text').replace(/\s/g, '').toLowerCase(),
                        shortenedText = cleanedTdText.substr(0, str.length),
                        distance;

                    if (filter.getTolerance() > 0) {
                        // console.time && console.time('distance computing');
                        distance = levenshteinDistance(str, shortenedText);
                        // console.time && console.timeEnd('distance computing');

                        if (distance > filter.getTolerance()) {
                            toHide.push(td.getParent());
                        }
                    } else {
                        if (str !== shortenedText) {
                            toHide.push(td.getParent());
                        }
                    }
                });

                this._root.getElements('tr').each(function (tr) {
                    tr.removeClass('tf-hidden-' + columnIndex);
                });
                toHide.each(function (tr) {
                    tr.addClass('tf-hidden-' + columnIndex);
                });
            }
        this._root.fireEvent('afterFilter', { columnIndex: columnIndex, value: str, hiddenElts: toHide });
    };

    function levenshteinDistance(str1, str2) {
        if (str1.length === 0) {
            return str2.length;
        }
        if (str2.length === 0) {
            return str1.length;
        }

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= str2.length; i++) {
            for (j = 1; j <= str1.length; j++) {
                if (str2.charAt(i-1) == str1.charAt(j-1)) {
                   matrix[i][j] = matrix[i-1][j-1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i-1][j-1] + 1, // substitution
                        Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1) // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
    /////////////////////////////////////////
}(window, window.document, window.document.id));
