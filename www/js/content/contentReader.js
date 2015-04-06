(function() {
  'use strict';

  angular
    .module('bq')
    .factory('contentReader', contentReader);

  /* @ngInject */
  function contentReader($q, dataService) {
    var service = {
      slides: [],
      makeSlides: makeSlides
    };
    return service;

    ////////////////

    function makeSlides(pages, sparams) {
      // sort pages and generate slider uids
      // next and prev chapters buttons
      service.slides = [];
      var slide;
      var d = $q.defer();
      var promises = [];
      //var sparams = $state.params;

      for (var moduleId in pages) {
        if (pages[moduleId].length === 0) continue;

        slide = {
          verses: pages[moduleId],
          moduleId: moduleId,
          uid: moduleId + ':' + sparams.bookId + ':' + sparams.chapterId,
          nextChapAvail: dataService.bmodules[moduleId].getChapter(sparams.bookId, parseInt(sparams.chapterId) + 1),
          prevChapAvail: dataService.bmodules[moduleId].getChapter(sparams.bookId, parseInt(sparams.chapterId) - 1)
        };
        // promises[moduleId] = {
        //   nextChapAvail: slide.nextChapAvail,
        //   prevChapAvail: slide.prevChapAvail
        // };
        promises.push(slide.nextChapAvail);
        promises.push(slide.prevChapAvail);

        if (moduleId === sparams.moduleId) {
          service.slides.splice(0, 0, slide);
        } else {
          service.slides.push(slide);
        }
      }

      $q.all(promises).then(function(resolved) {
        for (var i = 0; i < service.slides.length; i++) {
          service.slides[i].nextChapAvail = !!service.slides[i].nextChapAvail.$$state.value;
          service.slides[i].prevChapAvail = !!service.slides[i].prevChapAvail.$$state.value;
        }
      
        d.resolve(service.slides);
      });
      
      // for (var i=0; i< slides.length; i++) {
      //   //uid: sparams.moduleId + ':' + sparams.bookId + ':' + sparams.chapterId + ':' + index, // for slider delegatation
      //   slides[i].uid = 'app-reader-'+ i;
      // }

      //return service.slides;
      return d.promise;
    }
  }
})();