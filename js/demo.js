(function (window, document, $, TableFilter, TablePager, undefined) {
    'use strict';

    window.TOLERANCE = 0;
    window.ITEMS_PER_PAGE = 3;

    window.addEvent('domready', function addFilters() {
        var table = new TableFilter($('demo'), window.TOLERANCE),
            filterElts = {
                '1': $('filter-1'),
                '2': $('filter-2'),
            };

        filterElts[1].addEvent('keyup', filter.bind(null, 1));
        filterElts[2].addEvent('keyup', filter.bind(null, 2));

        function filter(onColumn) {
            var textFilter = filterElts[onColumn].get('value');
            table.filter(onColumn, textFilter);
        }

        var pager = new TablePager($('demo'), window.ITEMS_PER_PAGE),
            paginationElt = $('pagination'),
            paginationBtns = $('pagination-btns'),
            backBtn = $('page-back'),
            nextBtn = $('page-next'),
            goToElt = $('page-goto');

        pager.disable();
        paginationElt.addEvent('change', function () {
            if (paginationElt.checked) {
                pager.goTo(1);
                pager.enable();
                paginationBtns.setStyle('visibility', 'visible');
            } else {
                pager.disable();
                paginationBtns.setStyle('visibility', 'hidden');
            }
        });

        backBtn.addEvent('click', pager.back.bind(pager));
        nextBtn.addEvent('click', pager.next.bind(pager));
        goToElt.addEvent('keyup', function () {
            var page = +goToElt.get('value');
            pager.goTo(page);
        });

        pager.addEvent('pageChange', function (status) {
            if (status.page > status.nbPages) {
                pager.goTo(status.nbPages);
            } else {
                $('page-status').set('text', status.page + '/' + status.nbPages);
            }
        });
    });
}(window, window.document, window.document.id, window.TU.TableFilter, window.TU.TablePager));
