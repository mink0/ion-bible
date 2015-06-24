(function() {
  'use strict';

  angular
    .module('bq')
    .controller('ContentReaderCtrl', ContentReaderCtrl);

  /* @ngInject */
  function ContentReaderCtrl($rootScope, $scope, contentReader, dataService, $stateParams, notify, navigation, checkBookUrl, pages, common) {
    var vm = this;
    // if (!checkBookUrl()) return;
    vm.moduleId = $stateParams.moduleId;
    vm.module = dataService.bmodules[vm.moduleId];
    vm.bookId = $stateParams.bookId;
    vm.chapterId = $stateParams.chapterId;
    vm.slideHasChanged = sliderHasChanged;
    vm.nextChapter = navigation.nextChapter;
    vm.prevChapter = navigation.prevChapter;
    vm.slides = contentReader.makeSlides(pages, $stateParams);
    vm.title = '';
    vm.settings = common.settings;
    vm.searchText = $stateParams.searchText;
    
    activate();

    ////////////////

    function activate() {
      // var off1 = $scope.$on('$ionicView.afterLeave', function(viewInfo, state) {
      //   // for hiding notify on pressing back button
      //   console.log('$ionicView.afterLeave');
      //   notify.hide();
      // });

      var off = $scope.$on('$ionicView.afterEnter', function(viewInfo, state) {
        console.log('$ionicView.afterEnter'); //, viewInfo, state);

        // FIXME: strange ion-view behavior. we need to wait the view to activate and only then change the title
        sliderHasChanged(0); // change the title
        
        notify.hide();  // this one is shown in the dataService.loadPages
        //off();
      });
    }

    function sliderHasChanged(index) {
      if (common.debug) return;
      vm.module.getBook(vm.bookId).then(function(book) {
        //vm.title = '[' + dataService.bmodules[vm.slides[index].moduleId].name + '] ' + book.short_name + '. ' + vm.chapterId;
        //vm.titleBook = dataService.bmodules[vm.slides[index].moduleId].description + ': ' + book.short_name + '. ' + vm.chapterId;
        vm.titleBook = 
          '<div>' +
            dataService.bmodules[vm.slides[index].moduleId].description + 
            ': <span class="sub-title-right">' + book.short_name + '. ' + vm.chapterId + '</span></div>';
      });
    }
  }
})();
