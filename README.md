What is Table-Util?
===================

A set of JS tools (based on Mootools) to add features (such as filters) to the HTML table element.

How to use it?
==============

Have a look to the demo provided on this repo to know how to use table-util.

For now, two constructors are exposed by the TU module:
* _TU.TableFilter_: make you able to filter tables rows;
* _TU.TablePager_: make you able to add pagination on your tables.

Documentation
=============

TableFilter(tableElt, tolerance);

TableFilter.prototype.addEvent();
TableFilter.prototype.getTolerance();
TableFilter.prototype.setTolerance(tolerance);
TableFilter.prototype.filter(columnIndex, str);

levenshteinDistance(str1, str2);

TablePager(tableElt, itemsPerPage, page);

TablePager.prototype.enable();
TablePager.prototype.disable();
TablePager.prototype.addEvent();
TablePager.prototype.getItemsPerPage();
TablePager.prototype.setItemsPerPage(itemsPerPage);
TablePager.prototype.back();
TablePager.prototype.next();
TablePager.prototype.goTo(page);
TablePager.prototype.getCurrentPage();

refreshPagination()
