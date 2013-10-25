angular.module("leaflet-directive").service('leafletData', function ($log, $q) {
    var map;
    var tile;
    var layers = $q.defer();
    var paths = $q.defer();
    var mainMarker = $q.defer();
    var markers = $q.defer();

    this.setMap = function(leafletMap) {
        map = leafletMap;
    };

    this.getMap = function() {
        return map;
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

    this.setTile = function(leafletTile) {
        tile = leafletTile;
    };

    this.getTile = function() {
        return tile;
    };

    this.setMainMarker = function(leafletMarker) {
        mainMarker.resolve(leafletMarker);
    };

    this.getMainMarker = function() {
        return mainMarker.promise;
    };
});
