(function() {
  'use strict';

  angular
    .module('bq')
    .factory('navigation', navigation);

  /* @ngInject */
  function navigation(dataService, $stateParams, $state, $ionicScrollDelegate, $ionicSlideBoxDelegate, $rootScope, contentReader) {
    var service = {
      nextChapter: nextChapter,
      prevChapter: prevChapter
    };
    $rootScope.$on('onVolumeDown', scrollDown);
    $rootScope.$on('onVolumeUp', scrollUp);


    return service;

    ////////////////

    function scrollDown(e) {
      console.log('page down');
      if ($state.is('app.reader')) {
        // FIXME
        // https://github.com/driftyco/ionic/issues/1865
        // console.log($window.innerHeight)
        var ionContentHeight = document.getElementsByTagName('ion-content')[0].clientHeight; // hack. fix needed.
        getCurScroll().scrollBy(0, ionContentHeight, true); // $ionicScrollDelegate.$getByHandle(vm.index).scrollBy(0, ionContentHeight);
      } else {
        var curView = $ionicScrollDelegate.getScrollView();
        var contentHeight = curView.__clientHeight;
        $ionicScrollDelegate.scrollBy(0, contentHeight);
      }
    }

    function scrollUp(e) {
      console.log('page up');
      var ionContentHeight = document.getElementsByTagName('ion-content')[0].clientHeight; // hack. fix needed.
      if ($state.is('app.reader')) {
        // FIXME
        getCurScroll().scrollBy(0, -ionContentHeight), true; // $ionicScrollDelegate.$getByHandle(vm.index).scrollBy(0, ionContentHeight);
      } else {
        var curView = $ionicScrollDelegate.getScrollView();
        var contentHeight = curView.__clientHeight;
        $ionicScrollDelegate.scrollBy(0, -contentHeight);
      }
    }

    function getCurScroll() {
      // FIXME
      // https://github.com/driftyco/ionic/issues/1865
      var slideIndex = $ionicSlideBoxDelegate.currentIndex();
      //var uid = $stateParams.moduleId + ':' + $stateParams.bookId + ':' + $stateParams.chapterId + ':' + slideIndex;
      var uid = contentReader.slides[slideIndex].moduleId + ':' + $stateParams.bookId + ':' + $stateParams.chapterId;
      var instances = $ionicScrollDelegate._instances;
      var currentScroll;
      for (var i = 0; i < instances.length; i++) {
        if (instances[i].$element[0].id === uid) {
          currentScroll = instances[i];
          break;
        }
      }
      return currentScroll;
    }


    function nextChapter(fromId) {
      var opts = $stateParams;
      opts.moduleId = fromId;
      goToChapter(parseInt(opts.chapterId) + 1);
    }

    function prevChapter(fromId) {
      var opts = $stateParams;
      opts.moduleId = fromId;
      goToChapter(parseInt(opts.chapterId) - 1);
    }

    function goToChapter(newChapId) {
      dataService.bmodules[$stateParams.moduleId].getChapter($stateParams.bookId, newChapId).then(function(chapter) {
        if (chapter) {
          var newOpts = {
            moduleId: $stateParams.moduleId,
            bookId: $stateParams.bookId,
            chapterId: newChapId
          };
          $state.go('app.reader', newOpts);
        }
      });
    }
  }
})();
