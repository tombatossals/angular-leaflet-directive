angular.module("leaflet-directive").service('leafletData', function ($log) {
    var map;
    var tile;
    var layers;
    var paths;
    var mainMarker;
    var markers;

    this.setMap = function(leafletMap) {
        map = leafletMap;
    };

    this.getMap = function() {
        return map;
    };

    this.getPaths = function() {
        return paths;
    };

    this.setPaths = function(leafletPaths) {
        paths = leafletPaths;
    };

    this.getMarkers = function() {
        return markers;
    };

    this.setMarkers = function(leafletMarkers) {
        markers = leafletMarkers;
    };

    this.getLayers = function() {
        return layers;
    };

    this.setLayers = function(leafletLayers) {
        layers = leafletLayers;
    };

    this.setTile = function(leafletTile) {
        tile = leafletTile;
    };

    this.getTile = function() {
        return tile;
    };

    this.setMainMarker = function(leafletMarker) {
        mainMarker = leafletMarker;
    };

    this.getMainMarker = function() {
        return mainMarker;
    };
});
