(function() {
  'use strict';

  angular
    .module('bq')
    .controller('ContentChapsSelCtrl', ContentChapsSelCtrl);

  /* @ngInject */
  function ContentChapsSelCtrl($state, $stateParams, dataService, common, notify, checkBookUrl, chapters, $rootScope) {
    /*jshint validthis: true */
    var vm = this;
    if (!checkBookUrl()) return;

    vm.chapSelect = chapSelect;

    vm.moduleId = $stateParams.moduleId;
    vm.bookId = $stateParams.bookId;
    vm.module = dataService.bmodules[vm.moduleId];
    vm.book = {};
    vm.chapterString = vm.module.chapter_string;
    vm.module.getBook(vm.bookId).then(function(book) {
      var off = $rootScope.$on('$ionicView.enter', function(viewInfo, state) {
        //FIXME: strange ion-view behavior. we need to wait the view to activate and then change thi title.
        vm.book = book;
        off();
      });
    });

    //vm.selMask = new common.ListSelectedMask(vm.book.chapQty);
    // init chapters representation for list
    vm.chapters = chapters;


    // var chapQty = vm.book.chapQty;
    // if (vm.module.introExist) {
    //   vm.chapters.push({id: 0, title: 'Introduction'});
    //   chapQty -= 1;
    // }

    // for (var i = 0; i < chapQty; i++) {
    //   vm.chapters.push({
    //     id: i + 1,
    //     title: 'Chapter ' + parseInt(1 + i)
    //   });
    // }

    function chapSelect(chap) {
      //vm.selMask.select(index);
      $state.go('app.reader', {
        bookId: vm.bookId,
        moduleId: vm.moduleId,
        chapterId: chap.chapter
      });
    }
  }
})();
