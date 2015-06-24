(function() {
  'use strict';

  angular
    .module('bq')
    .controller('SettingsCtrl', SettingsCtrl);

  /* @ngInject */
  function SettingsCtrl($rootScope, $state, settings, common, $scope, $ionicHistory, dataService, notify, appRestoreState) {
    var vm = this; /*jshint validthis: true */

    vm.rescan = rescan;
    vm.foundModules = common.settings.moduleSwitcher;
    vm.defaultModuleId = common.settings.defaultModuleId || common.defaultModuleId;
    vm.modulesChange = modulesChange;
    vm.defModChange = defModChange;
    vm.restartApp = restartApp;
    
    vm.settings = common.settings;
    vm.settingsSave = settings.save;
    //vm.fullScreen = common.settings.appFullScreen;
    vm.fullScreenChange = fullScreenChange;
    $scope.$watch('vm.defaultModuleId', defModChange);
    var isFirst = false;

    activate();

    ////////////////

    function activate() {
      if (!(vm.foundModules && typeof vm.foundModules === 'object' && Object.keys(vm.foundModules).length > 0)) { rescan(); }
    }

    function rescan() {
      notify.show();
      settings.findBModules().then(function(modules) {
        notify.hide();
        vm.foundModules = modules;
        settings.save({'moduleSwitcher': vm.foundModules});
      });
    }

    function modulesChange() {
      settings.save({'moduleSwitcher': vm.foundModules});
      // dataService.initBModules();
    }

    function defModChange(oldval, newval) {
      if (oldval !== newval) {
        settings.save({'defaultModuleId': vm.defaultModuleId});
        dataService.initBModules();
      }
    }

    function restartApp() {
      appRestoreState.saveAppState();
      window.location.reload(true);
      //$ionicHistory.clearHistory();
    }

    function fullScreenChange() {
      settings.save();
      ionic.Platform.fullScreen(true, !vm.settings.appFullScreen);
    }
  }
})();
