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
      load: load
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

    function save(prop) {
      if (prop && typeof prop === 'object') angular.extend(common.settings, prop);
      storage.setObject('settings', common.settings);
    }

    function load() {
      // must be loaded at first state in the app
      var d = $q.defer();
      $ionicPlatform.ready(function() {
        $http.get('js/bmodule/defaultBooks.json')
        .success(function(books) {
          common.defaultBooks = books;
          common.settings = storage.getObject('settings');
          d.resolve(common.settings);
        })
        .error(function(){
          notify.alert('Ошибка загрузки "defaultBooks.json"');
        });
      });
      return d.promise;      
    }
  }
})();