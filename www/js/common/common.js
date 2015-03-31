(function() {
  'use strict';

  angular
    .module('bq')
    .factory('common', common);

  /* @ngInject */
  function common() {
    var ListSelectedMask = function(listlen) {
      this.mask = [];
      for (var i = 0; i < listlen; i++) {
        this.mask[i] = false;
      }
    };
    ListSelectedMask.prototype.select = function(index) {
      for (var i = 0; i < this.mask.length; i++) {
        this.mask[i] = false;
      }
      this.mask[index] = true;
    };

    ////////////////

    var service = {
      //settings: {},
      defaultModuleId: 'RST77.SQLite3',
      ListSelectedMask: ListSelectedMask, // to highlight last selected element in list
      debug: false, //!!!window.cordova
    };
    return service;
  }
})();
