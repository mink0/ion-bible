(function() {
  'use strict';

  angular.module('bq')
    .directive('dynamicHeight', function() {
      // hack for viewing full height ion-slider inside side-menu
      //
      return {
        require: ['^ionSlideBox'],
        link: function(scope, elem, attrs, slider) {
          scope.$watch(function() {
            return slider[0].__slider.selected();
          }, function(val) {
            //getting the heigh of the container that has the height of the viewport
            // var newHeight = window.getComputedStyle(elem.parent()[0], null).getPropertyValue('height');
            var newHeight = window.getComputedStyle(elem.parent().parent().parent()[0], null).getPropertyValue('height');
            if (newHeight) {
              elem.find('ion-scroll')[0].style.height = newHeight;
            }
          });
        }
      };
    });
})();
