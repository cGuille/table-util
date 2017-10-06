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


```js
// Call the TableFilter constructor like so:

var filter = TableFilter(tableElt, tolerance);

// Available functions

filter.addEvent(type, fn);

filter.getTolerance();

filter.setTolerance(tolerance);

filter.filter(columnIndex, str);


// Call the TablePager constructor like so:

var pager = TablePager(tableElt, itemsPerPage, page);

// Available functions:

pager.enable();

pager.disable();

pager.addEvent(type, fn);

pager.getItemsPerPage();

pager.setItemsPerPage(itemsPerPage);

pager.back();

pager.next();

pager.goTo(page);

pager.getCurrentPage();
```