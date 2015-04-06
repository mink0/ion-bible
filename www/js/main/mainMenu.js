(function() {
  'use strict';

  angular
    .module('bq')
    .factory('mainMenu', mainMenu);

  /* @ngInject */
  function mainMenu($rootScope, $state, $ionicActionSheet, $ionicSideMenuDelegate) {
    var service = {
      showMenu: showMenu
    };
    var mainContextMenu = null;
    $rootScope.$on('onMenuButton', showMenu);
    return service;

    ////////////////

    function showMenu() {
      // Show the action sheet
      if (!mainContextMenu) {
        mainContextMenu = $ionicActionSheet.show({
          buttons: [{
            text: 'Настройки',
            //cssClass: 'icon ion-settings',
            cb: function() {
              $state.go('app.settings');
            }
          }, {
            text: 'История',
            cb: function() {
              $state.go('app.history'); 
            }
          }, {
            text: 'Выбор модуля',
            cb: function() {
              $ionicSideMenuDelegate.toggleLeft(true);
            }
          }, {
            text: 'Выбор книги',
            cb: function() {
              // only $state is accessible here..
              if ($state.params.hasOwnProperty('moduleId')) {
                $state.go('app.books', $state.params);
              } else {
                $ionicSideMenuDelegate.toggleLeft(true);
              }
            }
          }, {
            text: '<strong>Выход</strong>',
            cb: function() {
              $rootScope.$emit('onExitApp');
            }
          }],
          cancel: function() {
            mainContextMenu = null;
            console.log('Cancel');
          },
          buttonClicked: function(index) {
            $ionicSideMenuDelegate.toggleLeft(false);
            this.buttons[index].cb();
            mainContextMenu = null;
            return true;
          }
        });
      }
    }
  }
})();
