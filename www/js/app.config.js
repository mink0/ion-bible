(function() {
  'use strict';

  angular.module('bq', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform, dataService, $rootScope, $ionicConfig, $ionicGesture, appRestoreState, common) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        // add cordova event handlers
        $rootScope.$emit('onReady');

        $ionicPlatform.on('volumedownbutton', function() {
          $rootScope.$emit('onVolumeDown');
        });
        $ionicPlatform.on('volumeupbutton', function() {
          $rootScope.$emit('onVolumeUp');
        });
        $ionicPlatform.on('pause', function() {
          $rootScope.$emit('onPause');
        });
        $ionicPlatform.on('backbutton', function() {
          $rootScope.$emit('onBackButton');
        });
        $ionicPlatform.on('backbutton', function() {
          $rootScope.$emit('onBackButton');
        });
        $ionicPlatform.on('menubutton', function() {
          $rootScope.$emit('onMenuButton');
        });
        $ionicPlatform.on('doubletap', function() {
          $rootScope.$emit('onDoubleTap');
        });
      
        // ionic related config
        $ionicConfig.tabs.position('bottom'); // place tabs

        // app start scripts
        appRestoreState.restoreAppState();
      });
    });

  // enable native scrolling in Andorid
  // To early right now....
  // angular.module('bq')
  //   .config(function($ionicConfigProvider) {
  //     if (!ionic.Platform.isIOS()) $ionicConfigProvider.scrolling.jsScrolling(false);
  //   });

})();
