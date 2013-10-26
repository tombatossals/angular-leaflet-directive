angular.module("leaflet-directive").service('leafletData', function ($log, $q) {
    var map = $q.defer();
    var tiles = $q.defer();
    var layers = $q.defer();
    var paths = $q.defer();
    var mainMarker = $q.defer();
    var markers = $q.defer();
    var defaults = {};

    this.setMap = function(leafletMap) {
        map.resolve(leafletMap);
    };

    this.getMap = function() {
        return map.promise;
    };

    this.getDefaults = function() {
        return defaults;
    };

    this.setDefaults = function(leafletDefaults) {
        defaults = leafletDefaults;
    };

    this.getPaths = function() {
        return paths.promise;
    };

    this.setPaths = function(leafletPaths) {
        paths.resolve(leafletPaths);
    };

    this.getMarkers = function() {
        return markers.promise;
    };

    this.setMarkers = function(leafletMarkers) {
        markers.resolve(leafletMarkers);
    };

    this.getLayers = function() {
        return layers.promise;
    };

    this.setLayers = function(leafletLayers) {
        layers.resolve(leafletLayers);
    };

    this.setTiles = function(leafletTiles) {
        tiles.resolve(leafletTiles);
    };

    this.getTiles = function() {
        return tiles.promise;
    };

    this.setMainMarker = function(leafletMarker) {
        mainMarker.resolve(leafletMarker);
    };

    this.getMainMarker = function() {
        return mainMarker.promise;
    };
});
