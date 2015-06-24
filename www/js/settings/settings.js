(function() {
  'use strict';

  angular
    .module('bq')
    .factory('settings', settings);

  /* @ngInject */
  function settings(dataService, storage, common, $q, $http, $ionicPlatform, notify) {
    var service = {
      findBModules: findBModules,
      save: save,
      load: load,
      history: {
        maxlen: 30,
        add: historyAdd,
        get: historyGet
      }
    };
    return service;

    ////////////////

    function findBModules() {
      var d = $q.defer();
      var found = [];
      dataService.findBModules(function(err, res) {
        if (err) return;

        for (var fname in res) {
          found.push({
            id: fname,
            load: true
          });
        }

        d.resolve(found);
      });

      return d.promise;
    }
    
    /**
     * save all settings into storage
     * @param  {[Object]} prop
     */
    function save(prop) {
      if (prop && typeof prop === 'object') angular.extend(common.settings, prop);
      storage.setObject('settings', common.settings);
    }

    function load() {
      // must be loaded at first state in the app
      var d = $q.defer();
      $ionicPlatform.ready(function() {
          $http.get('js/settings/defaultBooks.json').success(function(books) {
            common.defaultBooks = books;
            common.settings = storage.getObject('settings');
            if (Object.keys(common.settings).length > 0) {
              return d.resolve(common.settings);
            }
          
            // init vars for the first time
            $http.get('js/settings/defaultSettings.json').success(function(settings) {
              console.log(settings);
              common.settings = settings;
              return d.resolve(common.settings);
            }).error(function(err) {
              notify.alert('Ошибка загрузки "defaultSettings.json"');
            });
          })
          .error(function(err) {
            notify.alert('Ошибка загрузки "defaultBooks.json"');
          });
      });
      return d.promise;
    }

    function historyAdd(item) {
      var hist = common.settings.history;
      if (hist.length === 0 || JSON.stringify(item) != JSON.stringify(hist[0])) {

        // while (hist.length >= service.history.maxlen) {
        //   hist.shift();
        // }
        hist.unshift(item);
        if (hist.length >= service.history.maxlen) {
          var delCount = hist.length - service.history.maxlen;
          hist.splice(service.history.maxlen - 1, delCount);
        }

        service.save();
      }
    }

    function historyGet() {
      return common.settings.history;
    }
  }
})();
