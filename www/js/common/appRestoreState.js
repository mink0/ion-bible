(function() {
  'use strict';

  angular
    .module('bq')
    .factory('appRestoreState', appRestoreState);

  /* @ngInject */
  function appRestoreState($window, $rootScope, storage, common, $ionicScrollDelegate, $ionicSlideBoxDelegate, $state, settings, $timeout, notify, contentReader) {
    /*
      Saving and restoring app state
      Don't forget to include this service somewhere in the app!!!
     */
    var service = {
      saveAppState: saveAppState,
      restoreAppState: restoreAppState,
      exitApp: exitApp
    };
    //$rootScope.$on('onReady', restoreAppState);
    //$rootScope.$on('onExitApp', exitApp);
    $rootScope.$on('onPause', saveAppState);
    $rootScope.$on('onBackButton', function() {
      if ($state.is('app.reader')) {
        saveAppState();
      }
    });

    return service;

    function saveAppState() {
      console.log('Saving app state...', $window.location.href);
      storage.set('lastUrl', $window.location.href);

      // save all reader's ionicScrolls
      if ($ionicSlideBoxDelegate.currentIndex() === undefined) return;

      // FIXME: hack, until https://github.com/driftyco/ionic/issues/1865 is fixed
      var instances = $ionicScrollDelegate._instances;
      var readerScrollPos = {};
      for (var i = 0; i < instances.length; i++) {
        var id = instances[i].$element[0].id;
        if (id) {
          readerScrollPos[id] = instances[i].getScrollPosition();
        }
      }

      storage.setObject('readerScrollPos', readerScrollPos);
      storage.set('readerActiveSlide', contentReader.slides[$ionicSlideBoxDelegate.currentIndex()].moduleId);
      settings.save();
    }

    function restoreAppState() {
      console.log('Restoring app state...');
      // last active page
      var url = storage.get('lastUrl');
      if (url) $window.location.href = url;
      // restore all ionic scrolls position
      var readerScrollPos = storage.getObject('readerScrollPos');
      if (readerScrollPos && Object.keys(readerScrollPos).length > 0) {
        var off = $rootScope.$on('$ionicView.afterEnter', function(viewInfo, state) {
          $timeout(restoreFullScreen, 50);
          //FIXME: strange additional timeout is needed
          $timeout(restoreScrollPos, 200);
          off();
        });
      }

      function restoreFullScreen() {
        // restore fullscreen status
        if (common.settings.appFullScreen) {
          ionic.Platform.fullScreen(true, false);
        }
      }

      function restoreScrollPos() {
        // FIXME: hack, until https://github.com/driftyco/ionic/issues/1865 is fixed
        var instances = $ionicScrollDelegate._instances;
        for (var i = 0; i < instances.length; i++) {
          var id = instances[i].$element[0].id;
          if (readerScrollPos.hasOwnProperty(id)) {
            instances[i].scrollTo(readerScrollPos[id].left, readerScrollPos[id].top);
          }
        }
        // activate last slide
        var moduleId = storage.get('readerActiveSlide');
        var sliderIndex;
        for (var i = 0; i < contentReader.slides.length; i++) {
          if (contentReader.slides[i].moduleId == moduleId) {
            sliderIndex = i;
            break;
          }
        }
        if (sliderIndex) {
          $ionicSlideBoxDelegate.slide(sliderIndex);
        }
      }
    }

    function exitApp() {
      saveAppState();
      ionic.Platform.exitApp();
    }
  }
})();
