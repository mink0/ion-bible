(function() {
  'use strict';

  angular
    .module('bq')
    .controller('SearchResultsCtrl', SearchResultsCtrl);

  /* @ngInject */
  function SearchResultsCtrl(dataService, common, search) {
    var vm = this; /*jshint validthis: true */
    vm.title = 'SearchResultsCtrl';
    vm.search = search;
    vm.getTitle = getTitle;
    vm.onSearchFocus = onSearchFocus;
    vm.onSearchBlur = onSearchBlur;
    //console.log(vm.title);

    ////////////////

    function dismiss() {
      $scope.modal.close();
    }

    function onSearchFocus() {
      if (common.settings.appFullScreen) {
        // disable fullscreen. otherwise keyboard will hide input
        ionic.Platform.fullScreen(false, true);
      }
    }

    function onSearchBlur() {
      if (common.settings.appFullScreen) {
        ionic.Platform.fullScreen(true, false);
      }
    }

    function getTitle(bookId, chapterId, verseId) {
      var title = '';
      if (dataService.defaultModule.hasOwnProperty('books') && dataService.defaultModule.books.hasOwnProperty(bookId)) {
        title = dataService.defaultModule.books[bookId].short_name + ' ' + chapterId + ': ' + verseId;
      } else {
        title = bookId + ' ' + chapterId + ': ' + verseId;
      }
      return title;
    }
  }
})();
