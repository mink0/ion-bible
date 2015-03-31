(function() {
  'use strict';

  angular
    .module('bq')
    .factory('contentReader', contentReader);

  /* @ngInject */
  function contentReader() {
    var service = {
      slides: [],
      makeSlides: makeSlides
    };
    return service;

    ////////////////

    function makeSlides(pages, vm) {
      // sort pages and generate slider uids
      var slide;
      service.slides = [];
      for (var moduleId in pages) {
        if (pages[moduleId].length === 0) continue;
        slide = {
          verses: pages[moduleId],
          moduleId: moduleId,
          uid: moduleId + ':' + vm.bookId + ':' + vm.chapterId
        };
        if (moduleId === vm.moduleId) {
          service.slides.splice(0, 0, slide);
        } else {
          service.slides.push(slide);
        }
      }

      // for (var i=0; i< slides.length; i++) {
      //   //uid: vm.moduleId + ':' + vm.bookId + ':' + vm.chapterId + ':' + index, // for slider delegatation
      //   slides[i].uid = 'app-reader-'+ i;
      // }

      return service.slides;
    }
  }
})();