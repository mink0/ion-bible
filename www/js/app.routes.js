(function() {
  'use strict';
  angular.module('bq')
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

      // Базовый абстрактный state. Все остальные состояния приложения являются его потомками. 
      // Нужен для:
      //   Удобно подгрузить main layout templates (можно несколько)
      //   Резолвим все промисы, необходимые для работы всем контроллерам приложения
      //   Добавляет урл префиксы, если у нашего приложения есть несколько layouts

        .state('app', {
        // url: '/app',   // strange bugs with ionic 1.0.rc2
        abstract: true,
        templateUrl: 'templates/main.side-menu.html',
        controller: 'SideMenuCtrl as vm',
        // controllerAs: 'vm', // don't work on ionic 1.0.rc2
        resolve: {
          settingsResolved: function(settings) {
            return settings.load();
          },
          bmodules: function(dataService, settingsResolved) {
            return dataService.initBModules();
          }
        }
      })

      .state('app.books', {
        url: '/books/:moduleId',
        parent: 'app',
        views: {
          'menuContent': {
            templateUrl: 'templates/content.books.html',
            controller: 'ContentBooksSelCtrl as vm'
          }
        },
        resolve: {
          // first resolve parent (bmodules), second resolve child (books)
          books: function(bmodules, dataService, $stateParams, mock, common) {
            if (common.debug) return mock.load('books.json');
            return dataService.bmodules[$stateParams.moduleId].loadBooks();
          }
        }
      })

      .state('app.chapters', {
        url: '/books/:moduleId/:bookId',
        parent: 'app',
        views: {
          'menuContent': {
            templateUrl: 'templates/content.books.chapters.html',
            controller: 'ContentChapsSelCtrl as vm'
          }
        },
        resolve: {
          chapters: function(bmodules, dataService, $stateParams, mock, common) {
            if (common.debug) return mock.load('chapters.json');
            return dataService.bmodules[$stateParams.moduleId].loadChapters($stateParams.bookId);
          }
        }
      })

      .state('app.reader', {
        url: '/books/:moduleId/:bookId/:chapterId',
        parent: 'app',
        views: {
          'menuContent': {
            templateUrl: 'templates/content.reader.html',
            controller: 'ContentReaderCtrl as vm'
          }
        },
        resolve: {
          pages: function(bmodules, dataService, $stateParams, common, mock) {
            if (common.debug) return mock.load('pages.json');
            return dataService.loadPages($stateParams.bookId, $stateParams.chapterId);
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        parent: 'app',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl as vm'
          }
        }
      })

      .state('app.about', {
        url: '/about',
        parent: 'app',
        views: {
          'menuContent': {
            templateUrl: 'templates/about.html'
          }
        }
      });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/about');
    });

  angular.module('bq')
    .run(function($rootScope, notify, common) {
      // and don't forget to set $stateChangeError handler. it will save you from budhurt.
      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();
        notify.alert(error);
        //return $state.go('error');
      });

      if (common.debug) {
        // ui router is hard to debug
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        });
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
          console.log('$stateChangeError - fired when an error occurs during transition.');
          console.log(arguments);
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        });
        // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
        //   // runs on individual scopes, so putting it in "run" doesn't work.
        //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
        // });
        $rootScope.$on('$viewContentLoaded', function(event) {
          console.log('$viewContentLoaded - fired after dom rendered', event);
        });
        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
          console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
          console.log(unfoundState, fromState, fromParams);
        });
      }

    });
})();
