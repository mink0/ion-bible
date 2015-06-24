(function() {
  'use strict';

  angular
    .module('bq')
    .filter('searchFilter', searchFilter);

  /* @ngInject */
  function searchFilter() {
    return function (input, query) {
      if (query === '') {
        return input;
      }
      return input.replace(RegExp('('+ query + ')', 'gi'), '<span class="search-select">$1</span>');           
    };
  }
})();