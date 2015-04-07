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

    function makeSlides(pages, sparams) {
      // sort pages and generate slider uids
      var slide;
      service.slides = [];
      for (var moduleId in pages) {
        if (pages[moduleId].length === 0) continue;
        
        slide = {
          verses: pages[moduleId],
          moduleId: moduleId,
          uid: moduleId + ':' + sparams.bookId + ':' + sparams.chapterId,
          nextChapAvail: sparams.chapterId < pages[moduleId].maxChapNo,
          prevChapAvail: sparams.chapterId > pages[moduleId].minChapNo
        };
        if (moduleId === sparams.moduleId) {
          service.slides.splice(0, 0, slide);
        } else {
          service.slides.push(slide);
        }
      }

      // for (var i=0; i< slides.length; i++) {
      //   //uid: sparams.moduleId + ':' + sparams.bookId + ':' + sparams.chapterId + ':' + index, // for slider delegatation
      //   slides[i].uid = 'app-reader-'+ i;
      // }

      return service.slides;
    }
  }
})();