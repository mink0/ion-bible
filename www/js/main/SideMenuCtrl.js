(function() {
  'use strict';

  angular
    .module('bq')
    .controller('SideMenuCtrl', SideMenuCtrl);

  /* @ngInject */
  function SideMenuCtrl(dataService, $state, $rootScope, $timeout, $ionicScrollDelegate, common, mainMenu) {
    /*jshint validthis: true */
    var vm = this;
    vm.bmodules = dataService.bmodules;
    vm.hideNavbar = false;
    $rootScope.$on('onDoubleTap', fullScreenToggle);
    $rootScope.$on('app.initBModules', function($event, modules) {
      // FIXME: can't watch dataService.bmodules changes
      // $scope.$watch('vm.bmodules', function(current, original) {
      //   console.log('We changed! |-------------------------------------->>>');
      // });
      vm.bmodules = modules;
    });

    ///////////////////////

    var fullScreen = true;
    function fullScreenToggle() {
      console.log(fullScreen);
      vm.hideNavbar = !vm.hideNavbar;
      fullScreen = !fullScreen;
      $ionicScrollDelegate.resize();
      //$timeout(function() { ionic.Platform.fullScreen(fullScreen, fullScreen); }, 1000);
    }

    /**
     * Tests
     */
    vm.debug = common.debug;
    vm.volumeupbutton = function() {
      $rootScope.$broadcast('onVolumeUp');
    };
    vm.volumedownbutton = function() {
      $rootScope.$broadcast('onVolumeDown');
    };
    vm.ready = function() {
      $rootScope.$broadcast('onReady');
    };
    vm.menu = function() {
      console.log('onMenuButton');
      $rootScope.$broadcast('onMenuButton');
    };
    vm.restore = function() {
      $rootScope.$broadcast('restore');
    };

    console.log(vm.bmodules);
    // $state.go('app.settings');
  }
})();
