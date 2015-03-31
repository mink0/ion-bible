(function() {
  'use strict';

  angular
    .module('bq')
    .directive('htmlCompile', function($compile) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.$watch(attrs.htmlCompile, function(newValue, oldValue) {
            element.html(newValue);
            $compile(element.contents())(scope);
          });
        }
      };
    });
})();
