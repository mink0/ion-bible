(function() {
  'use strict';

  angular
    .module('bq')
    .factory('search', search);

  /* @ngInject */
  function search(dataService, $q, common, notify) {
    var searchModuleId;
    if (common.settings.history.length > 0) {
      searchModuleId = common.settings.history[0].moduleId;
    } else if (common.settings.hasOwnProperty('defaultModuleId')) {
      searchModuleId = common.settings.defaultModuleId;
    } else {
      searchModuleId = '';
    }
    var service = {
      searchModuleId: searchModuleId,
      searchText: common.settings.searchText,
      searchResults: [],
      doSearch: doSearch
    };
    return service;

    ////////////////

    function doSearch() {
      var d = $q.defer();
      // save last search
      common.settings.searchText = service.searchText;
      if (!dataService.bmodules.hasOwnProperty(service.searchModuleId)) {
        d.reject();
        notify.alert('Не выбран модуль для поиска!');
      } else {
        dataService.bmodules[service.searchModuleId].search(service.searchText).then(function(res) {
          service.searchResults = res;
          return d.resolve(service.searchResults);
        });
      }
      return d.promise;
    }
  }
})();