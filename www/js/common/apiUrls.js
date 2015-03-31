(function() {
  'use strict';

  angular
    .module('bq')
    .constant('apiUrls', {
      basePath: 'templates/bq_parsed/',
      json: 'templates/bq_parsed/bq_settings.json'
    });
})();