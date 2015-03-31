(function() {
  'use strict';

  angular
    .module('bq')
    .factory('notify', notify);

  /* @ngInject */
  function notify($ionicLoading, $ionicPopup) {
    var service = {
      show: show,
      hide: hide,
      flash: flash,
      alert: alert
    };
    
    return service;

    ////////////////

    function show(text, duration) {
      var opts = {};
      if (text) opts.template = text;
      opts.duration = duration || 8000;
      $ionicLoading.show(opts);
    }

    function hide() {
      $ionicLoading.hide();
    }

    function flash(text) {
      service.show(text, 2000);
    }

    function alert(text, title) {
      // alert dialog
      if (typeof text === 'object' && JSON.stringify(text) !== '{}') text = JSON.stringify(text);

      $ionicPopup.alert({
        template: text || 'Wait a minute',
        title: title || 'ERROR'
      });
    }
  }


})();
