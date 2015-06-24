(function() {
  'use strict';

  angular
    .module('bq')
    .controller('ContentBooksSelCtrl', ContentBooksSelCtrl);

  /* @ngInject */
  function ContentBooksSelCtrl($state, $stateParams, books, dataService, common, notify, contentBooksSel, checkBookUrl) {
    /*jshint validthis: true */
    var vm = this;
    if (!checkBookUrl()) return;
    vm.rowlen = 4; // numbers of buttons in the row
    vm.bookSel = bookSel;
    vm.moduleId = $stateParams.moduleId;
    vm.module = dataService.bmodules[vm.moduleId];
    //vm.selMask = new common.ListSelectedMask(books.length);
    vm.rbuttons = contentBooksSel.makeButtons(books, vm.rowlen);
    vm.range = function() {
      return new Array(vm.rowlen);
    };

    ////////////////

    function bookSel(book) {
      // vm.selMask.select(index);
      $state.go('app.chapters', {
        bookId: book.book_number,
        moduleId: vm.moduleId
      });
    }

  }
})();
