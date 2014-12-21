angular.module("leaflet-directive").service('leafletData', function ($log, $q, leafletHelpers) {
    var getDefer = leafletHelpers.getDefer,
        getUnresolvedDefer = leafletHelpers.getUnresolvedDefer,
        setResolvedDefer = leafletHelpers.setResolvedDefer;

    var maps = {};
    var tiles = {};
    var layers = {};
    var paths = {};
    var markers = {};
    var geoJSON = {};
    var utfGrid = {};
    var decorations = {};

    this.setMap = function(leafletMap, scopeId) {
        var defer = getUnresolvedDefer(maps, scopeId);
        defer.resolve(leafletMap);
        setResolvedDefer(maps, scopeId);
    };

    this.getMap = function(scopeId) {
        var defer = getDefer(maps, scopeId);
        return defer.promise;
    };

    this.unresolveMap = function (scopeId) {
        var id = leafletHelpers.obtainEffectiveMapId(maps, scopeId);
        maps[id] = undefined;
        tiles[id] = undefined;
        layers[id] = undefined;
        paths[id] = undefined;
        markers[id] = undefined;
        geoJSON[id] = undefined;
        utfGrid[id] = undefined;
        decorations[id] = undefined;
    };

    this.getPaths = function(scopeId) {
        var defer = getDefer(paths, scopeId);
        return defer.promise;
    };

    this.setPaths = function(leafletPaths, scopeId) {
        var defer = getUnresolvedDefer(paths, scopeId);
        defer.resolve(leafletPaths);
        setResolvedDefer(paths, scopeId);
    };

    this.getMarkers = function(scopeId) {
        var defer = getDefer(markers, scopeId);
        return defer.promise;
    };

    this.setMarkers = function(leafletMarkers, scopeId) {
        var defer = getUnresolvedDefer(markers, scopeId);
        defer.resolve(leafletMarkers);
        setResolvedDefer(markers, scopeId);
    };

    this.getLayers = function(scopeId) {
        var defer = getDefer(layers, scopeId);
        return defer.promise;
    };

    this.setLayers = function(leafletLayers, scopeId) {
        var defer = getUnresolvedDefer(layers, scopeId);
        defer.resolve(leafletLayers);
        setResolvedDefer(layers, scopeId);
    };

    this.getUTFGrid = function(scopeId) {
        var defer = getDefer(utfGrid, scopeId);
        return defer.promise;
    };

    this.setUTFGrid = function(leafletUTFGrid, scopeId) {
        var defer = getUnresolvedDefer(utfGrid, scopeId);
        defer.resolve(leafletUTFGrid);
        setResolvedDefer(utfGrid, scopeId);
    };

    this.setTiles = function(leafletTiles, scopeId) {
        var defer = getUnresolvedDefer(tiles, scopeId);
        defer.resolve(leafletTiles);
        setResolvedDefer(tiles, scopeId);
    };

    this.getTiles = function(scopeId) {
        var defer = getDefer(tiles, scopeId);
        return defer.promise;
    };

    this.setGeoJSON = function(leafletGeoJSON, scopeId) {
        var defer = getUnresolvedDefer(geoJSON, scopeId);
        defer.resolve(leafletGeoJSON);
        setResolvedDefer(geoJSON, scopeId);
    };

    this.getGeoJSON = function(scopeId) {
        var defer = getDefer(geoJSON, scopeId);
        return defer.promise;
    };

    this.setDecorations = function(leafletDecorations, scopeId) {
        var defer = getUnresolvedDefer(decorations, scopeId);
        defer.resolve(leafletDecorations);
        setResolvedDefer(decorations, scopeId);
    };

    this.getDecorations = function(scopeId) {
        var defer = getDefer(decorations, scopeId);
        return defer.promise;
    };
});
