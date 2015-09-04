angular.module("leaflet-directive").service('leafletLogger', function(nemSimpleLogger) {
  return nemSimpleLogger.spawn();
});
