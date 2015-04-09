(function() {
  'use strict';

  angular
    .module('bq')
    .factory('navigation', navigation);

  /* @ngInject */
  function navigation(dataService, $stateParams, $state, $ionicScrollDelegate, $ionicSlideBoxDelegate, $rootScope, contentReader, common) {
    var service = {
      nextChapter: nextChapter,
      prevChapter: prevChapter
    };
    $rootScope.$on('onVolumeDown', function() {scroll('down');});
    $rootScope.$on('onVolumeUp', function() {scroll('up');});

    return service;

    ////////////////

    function scroll(arg) {
      console.log('scroll' + arg);
      var mul = 1;
      if (arg === 'up') mul = -1;
      var contentHeight;
      
      if ($state.is('app.reader')) {
        // FIXME
        // https://github.com/driftyco/ionic/issues/1865
        // console.log($window.innerHeight)
        contentHeight = document.getElementsByTagName('ion-content')[0].clientHeight; // hack. fix needed.
        if (common.settings.appFullScreen) contentHeight = window.innerHeight;
        getCurScroll().scrollBy(0, mul * contentHeight, true); // $ionicScrollDelegate.$getByHandle(vm.index).scrollBy(0, ionContentHeight);
      } else {
        if (!common.settings.appFullScreen) {
          var curView = $ionicScrollDelegate.getScrollView();
          contentHeight = curView.__clientHeight;
        } else {
          contentHeight = window.innerHeight;
        }
        $ionicScrollDelegate.scrollBy(0, mul*contentHeight);
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
