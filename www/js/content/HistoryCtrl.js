(function() {
  'use strict';

  angular
    .module('bq')
    .controller('HistoryCtrl', HistoryCtrl);

  /* @ngInject */
  function HistoryCtrl(common, settings, dataService, $q, $state) {
    var vm = this; /*jshint validthis: true */
    vm.select = select;
    
    activate();

    ////////////////

    function activate () {
      vm.histList = histListInit();
    }

    function select(item) {
      $state.go('app.reader', item.params);
    }

    function histListInit() {
      var hist = settings.history.get();
      var histList = [];
      var promises = [];
      for (var i = 0; i < hist.length; i++) {
        var mname = hist[i].moduleId;
        if (dataService.bmodules.hasOwnProperty(mname)) {
          mname = dataService.bmodules[mname].name;
          promises.push(dataService.bmodules[hist[i].moduleId].loadVerse(hist[i].bookId, hist[i].chapterId, 1));
        }
        var bname = hist[i].bookId;
        if (common.defaultBooks[bname]) {
          bname = common.defaultBooks[bname].short_name;
        }
        histList.push({
          text: mname + ': ' + bname + '. ' + hist[i].chapterId,
          params: hist[i]
        });
      }
      
      $q.all(promises).then(function (verses) {
        vm.verses = verses;
      });
      return histList;
    }
  }
})();
