(function() {
  'use strict';

  angular
    .module('bq')
    .controller('ContentReaderCtrl', ContentReaderCtrl);

  /* @ngInject */
  function ContentReaderCtrl(contentReader, dataService, notify, $stateParams, navigation, checkBookUrl, $rootScope, slides, common) {
    var vm = this;
    // if (!checkBookUrl()) return;
    vm.moduleId = $stateParams.moduleId;
    vm.module = dataService.bmodules[vm.moduleId];
    vm.bookId = $stateParams.bookId;
    vm.chapterId = $stateParams.chapterId;
    //vm.sliderPages = dataService.getPages($stateParams);
    vm.slideHasChanged = sliderHasChanged;
    vm.nextChapter = navigation.nextChapter;
    vm.prevChapter = navigation.prevChapter;
    vm.slides = slides;
    vm.title = '';
    vm.isPrevChap = true;
    vm.isNextChap = true;

    activate();

    ////////////////

    function activate() {
      var off = $rootScope.$on('$ionicView.enter', function(viewInfo, state) {
        // FIXME: strange ion-view behavior. we need to wait the view to activate and then change the title.
        // console.log('SERVICE - $ionicView.loaded', viewInfo, state);

        // change title
        sliderHasChanged(0);

        off();
      });
    }

    function sliderHasChanged(index) {
      if (common.debug) return;
      vm.module.getBook(vm.bookId).then(function(book) {
        vm.title = '[' + dataService.bmodules[vm.slides[index].moduleId].name + '] ' + book.short_name + '. ' + vm.chapterId;
      });
    }

  }
})();
