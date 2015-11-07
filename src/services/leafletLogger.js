angular.module('leaflet-directive').service('leafletLogger', function($log) {
  var prefix = '[angular-leaflet] ';

  return {
    log: function(msg, section) {
      section = section ? '[' + section + '] ' : '';
      $log.log(prefix + section + msg);
    },

    debug: function(msg, section) {
      section = section ? '[' + section + '] ' : '';
      $log.debug(prefix + section + msg);
    },

    info: function(msg, section) {
      section = section ? '[' + section + '] ' : '';
      $log.info(prefix + section + msg);
    },

    warn: function(msg, section) {
      section = section ? '[' + section + '] ' : '';
      $log.warn(prefix + section + msg);
    },

    error: function(msg, section) {
      section = section ? '[' + section + '] ' : '';
      $log.error(prefix + section + msg);
    },

  };
});
