(function() {
  'use strict';

  angular
    .module('bq')
    .factory('mainMenu', mainMenu);

  /* @ngInject */
  function mainMenu($rootScope, $state, $ionicActionSheet, $ionicSideMenuDelegate, appRestoreState, $ionicPopup) {
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
          // titleText: '<strong>Actions</strong>',
          buttons: [{
            text: '<i class="icon royal ion-ios-gear-outline"></i> Настройки',
            //cssClass: 'icon ion-settings',
            cb: function() {
              $state.go('app.settings');
            }
          }, {
            text: '<i class="icon royal ion-ios-paper-outline"></i> Выбор модуля',
            cb: function() {
              $ionicSideMenuDelegate.toggleLeft(true);
            }
          }, {
            text: '<i class="icon royal ion-ios-list-outline"></i> Выбор книги',
            cb: function() {
              // only $state is accessible here..
              if ($state.params.hasOwnProperty('moduleId')) {
                $state.go('app.books', $state.params);
              } else {
                $ionicSideMenuDelegate.toggleLeft(true);
              }
            }
          }, {
            text: '<i class="icon royal ion-ios-search"></i> Поиск',
            cb: function() {
              var scopePopup = $rootScope.$new(true); // new isolated scope
              var searchPopup = $ionicPopup.show({
                templateUrl: 'templates/search-modal.html',
                title: 'Поиск',
                subTitle: 'Поиск по всем книгам модуля',
                scope: scopePopup,
                // buttons: [{
                //   text: 'Отмена'
                // }, {
                //   text: '<b>Поиск</b>',
                //   type: 'button-positive',
                //   onTap: function(e) {
                //     if (!$scope.data.wifi) {
                //       //don't allow the user to close unless he enters wifi password
                //       e.preventDefault();
                //     } else {
                //       return $scope.data.wifi;
                //     }
                //   }
                // }]
              });
              scopePopup.modal = searchPopup; // inject popup instance to have all logic in the SearchCtrl
            }
          }, {
            text: '<i class="icon royal ion-ios-glasses-outline"></i> История просмотра',
            cb: function() {
              $state.go('app.history');
            }
          }, {
            text: '<i class="icon assertive ion-ios-close-outline"></i> Выход',
            cb: function() {
              //$rootScope.$emit('onExitApp');
              appRestoreState.exitApp();
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
