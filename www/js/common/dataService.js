(function() {
  'use strict';

  angular
    .module('bq')
    .factory('dataService', dataService);

  /* @ngInject */
  function dataService($http, $q, $cordovaSQLite, $rootScope, $ionicPlatform, $timeout, notify, apiUrls, bmodule, mock, common, storage) {
    var service = {
      bmodules: {},
      initBModules: initBModules,
      defaultModule: null,
      findBModules: findBModules,
      loadPages: loadPages,
    };
    return service;

    ////////////////

    function initBModules() {
      /*
        Init Bible Modules. Must be resolved first in our app.
        Returns promise which will be resolved when all modulea are loaded.
       */
      var d = $q.defer();
      notify.show();
      service.bmodules = {};
      $ionicPlatform.ready(function() {
        if (common.debug) {
          // mocks
          return mock.load('bmodules.json').then(function(data) {
            service.bmodules = data;
            d.resolve(service.bmodules);
            notify.hide();
          });
        }

        // main logic
        // ////////////////////////////
        findFiles().then(function(fnames) {
          var promises = {};
          for (var i = 0; i < fnames.length; i++) {
            promises[fnames[i]] = readDB(fnames[i]);
          }
          $q.all(promises).then(function dbLoaded(modules) {
              // complete
              notify.hide();
              //service.bmodules = modules;
              angular.copy(modules, service.bmodules); // leave all references
              // FIXME: can't watch dataService.bmodules changes in SideMenuCtrl
              $rootScope.$emit('app.initBModules', service.bmodules);
              // select default module
              var defaultModuleId = common.settings.defaultModuleId || common.defaultModuleId;
              if (service.bmodules.hasOwnProperty(defaultModuleId)) {
                service.defaultModule = service.bmodules[defaultModuleId];
              } else {
                notify.flash('Не загружен дефолтный модуль ' + defaultModuleId + ' (полный функционал будет недоступен)');
              }
              d.resolve(service.bmodules);
            },
            function(err) {
              // error in module
              notify.hide();
              notify.alert(err);
              d.reject(err);
              $state.go('app.settings');
            });
        });
        // ////////////////////////////
        
        function findFiles() {
          /*
            find sqlite modules
            first - try to load from settings, otherwise - scan dir
           */

          var d = $q.defer();
          var files = [];
          // we should load our setings before this step
          var mSwitcher = common.settings.moduleSwitcher;
          if (mSwitcher && typeof mSwitcher === 'object' && Object.keys(mSwitcher).length > 0) {
            for (var i = 0; i < mSwitcher.length; i++) {
              if (mSwitcher[i].load) {
                files.push(mSwitcher[i].id);
              }
            }
            d.resolve(files);
          } else {
            service.findBModules(function(err, res) {
              if (err) return d.reject(err);
              for (var fname in res) {
                files.push(fname);
              }
              d.resolve(files);
            });
          }
          return d.promise;
        }

        function readDB(filename) {
          //FIXME: приходится использовать нативный cordova стек, т.к. ngCordova еще не поддерживала pre-filled db load
          var db = window.sqlitePlugin.openDatabase({
            name: filename,
            createFromLocation: 1
          });

          // init new bible module
          return bmodule.newModule(db); // promise
        }
      });
      return d.promise;
    }

    function loadPages(bookId, chapterId) {
      //var cbcount = 0;
      //var pages = {};
      var d = $q.defer();
      var promises = {};

      for (var moduleId in service.bmodules) {
        if (!service.bmodules.hasOwnProperty(moduleId)) return;
        promises[moduleId] = service.bmodules[moduleId].loadPage(bookId, chapterId);
      }

      $q.all(promises).then(function(pages) {
        d.resolve(pages);
      }, function(err) {
        notify.alert(err);
      });

      return d.promise;
    }
  }

  function findBModules(callback) {
    /*
      read all directories and find all bmodules
      https://github.com/007-surajit/Directory-List-PhoneGap-Plugin
     */
    var files = {};
    window.plugins.directoryList.getList('www', onDirectoryReadSuccess, onDirectoryReadError);

    function onDirectoryReadSuccess(directoryList) {
      for (var entry in directoryList) {
        if (!directoryList.hasOwnProperty(entry)) return;

        var fname = directoryList[entry];
        if (fname.toLowerCase().indexOf('.sqlite3') > -1) {
          files[fname] = {
            fname: fname,
            dirname: 'www'
          };
        }
      }
      return callback(null, files);
    }

    function onDirectoryReadError(error) {
      // onError Callback if directory does not exists or it is empty
      notify.alert('Ошибка чтения директории с модулями!\n' + error);
      return callback(error);
    }
  }

})();
