(function() {
  'use strict';

  angular
    .module('bq')
    .controller('SearchCtrl', SearchCtrl);

  /* @ngInject */
  function SearchCtrl($state, $scope, dataService, common, search) {
    var vm = this; /*jshint validthis: true */ 
    vm.title = 'SearchCtrl';
    vm.currentModules = common.settings.moduleSwitcher;
    vm.search = search;
    vm.searchText = search.searchText;
    vm.cancel = dismiss;
    vm.doSearch = doSearch;

    //console.log(vm.title);

    ////////////////

    function doSearch() {
      search.doSearch().then(function() {
        $scope.modal.close();
        $state.go('app.search-results');
      });
    }

    function dismiss() {
      $scope.modal.close();
    }
  }
})();