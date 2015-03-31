(function() {
  'use strict';

  angular
    .module('bq')
    .factory('contentBooksSel', contentBooksSel);

  /* @ngInject */
  function contentBooksSel() {
    var service = {
      makeButtons: makeButtons
    };
    return service;

    ////////////////

    function makeButtons(books, rowlen) {
      // create rows with buttons for book selection
      var rbuttons = {
        oldtes: [],
        newtes: []
      };

      for (var b in books) {
        if (books[b].book_number < 470) {
          rbuttons.oldtes.push(books[b]);
        } else {
          rbuttons.newtes.push(books[b]);
        }
      }

      // sorting books
      function compare(a, b) {
        if (a.book_number < b.book_number)
          return -1;
        if (a.book_number > b.book_number)
          return 1;
        return 0;
      }
      rbuttons.oldtes.sort(compare);
      rbuttons.newtes.sort(compare);

      //objs.sort(compare);

      function makeRows(array) {
        var out = [];
        for (var ri = 0; ri < array.length; ri += rowlen) {
          var row = [];
          var rlen = rowlen;
          if (ri + rowlen > array.length) rlen = array.length - ri; // последняя строка может быть неполной
          for (var i = 0; i < rlen; i++) {
            row.push(array[ri + i]);
          }
          out.push(row);
        }
        return out;
      }

      rbuttons.oldtes = makeRows(rbuttons.oldtes);
      rbuttons.newtes = makeRows(rbuttons.newtes);

      // function arrayFill(array, len) {
      //   if (array.length > 0 && array.length < len) {
      //     for (var i = 0; i < (len - array.length); i++) {
      //       array.push(null);
      //     }
      //   }
      // }

      return rbuttons;
    }
  }
})();