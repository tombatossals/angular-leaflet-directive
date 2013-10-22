angular.module("leaflet-directive").service('leafletData', function ($log) {
    var map;
    var baselayers;
    var controls;
    var tile;
    var overlays;
    var mainMarker;
    var markers;

    this.setMap = function(leafletMap) {
        map = leafletMap;
    };

    this.getMap = function() {
        return map;
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
