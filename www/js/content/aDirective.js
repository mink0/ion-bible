(function() {
  'use strict';

  angular
    .module('bq')
    .directive('a', function(notify, dataService, $ionicPopup) {

      return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
          //if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
          if (attrs.href && attrs.href.match(/(\d+) (\d+):(\d+)/))         
            elem.on('click', function(e) {
              e.preventDefault();
              var parse = attrs.href.match(/(\d+) (\d+):(\d+)/);
              var bookId = parse[1], chapterId = parse[2], verseId = parse[3];
              dataService.defaultModule.loadVerse(bookId, chapterId, verseId).then(function(verse) {
                $ionicPopup.alert({
                  template: verse,
                  title: attrs.href,
                  cssClass: 'modal-verse',
                  buttons: [{
                    text: 'OK',
                    type: 'button-energized'
                  }]
                });
              });
            });
          //}
        }
      };
    });
})();
