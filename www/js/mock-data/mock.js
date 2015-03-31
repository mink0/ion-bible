(function() {
  'use strict';

  angular
    .module('bq')
    .factory('mock', mock);

  /* @ngInject */
  function mock($http, $q) {
    var mdpath = 'js/mock-data/';
    var service = {
      load: load,
      'testData1': true,
    };
    return service;

    ////////////////

    // function data(prop) {
    //   if (prop.indexOf('.json') > -1) {
    //     return loadFromFile(p);
    //   } else {
    //     return mockData[prop];
    //   }
    // }

    function load(filename) {
      var d = $q.defer();
      $http.get(mdpath + filename).success(function(json) {
        d.resolve(json);
      }, function(err){
        alert(err);
      });
      return d.promise;
    }
  }
})();