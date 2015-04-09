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
    $rootScope.$on('app.initBModules', function($event, modules) {
      // FIXME: can't watch dataService.bmodules changes
      // $scope.$watch('vm.bmodules', function(current, original) {
      //   console.log('We changed! |-------------------------------------->>>');
      // });
      vm.bmodules = modules;
    });

    ///////////////////////

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
