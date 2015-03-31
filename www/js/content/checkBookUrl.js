(function() {
  'use strict';

  angular
    .module('bq')
    .factory('checkBookUrl', checkBookUrl);

  /* @ngInject */
  function checkBookUrl(notify, $stateParams, $state, dataService) {
    return function(stateParams) {
      var stateParams = stateParams || $stateParams;

      var moduleId = stateParams.moduleId;
      var bookId = stateParams.bookId;
      var chapterId = stateParams.chpaterId;

      if (moduleId && !dataService.bmodules.hasOwnProperty(moduleId)) {
        notify.alert('Неизвестный модуль: ' + moduleId);
        return false;
      }

      if (bookId && !dataService.bmodules[moduleId].books.hasOwnProperty(bookId)) {
        notify.alert('Неизвестная книга: ' + bookId);
        return false;
      }

      if (chapterId) {
        var chapQty = parseInt(dataService.bmodules[moduleId].books[bookId].chapQty);
        // save integer!
        dataService.bmodules[moduleId].books[bookId].chapQty = chapQty;
        var introExist = dataService.bmodules[moduleId].introExist;
        var minchap = 1;
        if (introExist) {
          minchap = 0;
          chapQty -= 1;
        }
        if (chapterId > chapQty || chapterId < minchap) {
          notify.alert('Неизвестная глава: ' + chapterId);
          return false;
        }
      }
       return true;
    };
  }
})();
