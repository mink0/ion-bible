(function() {
  'use strict';

  angular.module('bq')
    .directive('getHeight', function($timeout, $window) {
      // get container element height and store it in the scope
      return {
        replace: true,
        restrict: 'A',
        scope: {
          control: '='
        },
        link: function(scope, elem, attrs) {
          // need to wait until content will init
          $timeout(function() {
            var padding = parseInt($window.getComputedStyle(elem[0], null)['padding']);
            scope.height = elem[0].offsetHeight - 2 * padding;
            console.log(scope.height);
          }, 500);
          scope.height = elem[0].offsetHeight;
          // scope.width = elem.prop('offsetWidth');
        }
      };
    });
})();
