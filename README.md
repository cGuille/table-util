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

TableFilter(tableElt, tolerance);

// Available functions

TableFilter.addEvent(type, fn);

TableFilter.getTolerance();

TableFilter.setTolerance(tolerance);

TableFilter.filter(columnIndex, str);


// Call the TablePager constructor like so:

TablePager(tableElt, itemsPerPage, page);

// Available functions:

TablePager.enable();

TablePager.disable();

TablePager.addEvent(type, fn);

TablePager.getItemsPerPage();

TablePager.setItemsPerPage(itemsPerPage);

TablePager.back();

TablePager.next();

TablePager.goTo(page);

TablePager.getCurrentPage();
```