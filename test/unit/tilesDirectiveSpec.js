'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile, $rootScope, leafletData, leafletMapDefaults, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletMapDefaults_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        leafletMapDefaults = _leafletMapDefaults_;
        scope = $rootScope.$new();
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should set default tiles if bad tiles structure is provided', function() {
        angular.extend(scope, { tiles: {} });
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getTiles().then(function(leafletTiles) {
            var defaults = leafletMapDefaults.getDefaults();
            expect(leafletTiles._url).toEqual(defaults.tileLayer);
        });
    });

    it('should update the map tiles if the scope tiles properties changes', function() {
        var tiles = {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        };
        angular.extend(scope, { tiles: tiles });
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)(scope);
        var leafletTiles;
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        scope.$digest();
        expect(leafletTiles._url).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
        scope.tiles.url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        scope.$digest();
        expect(leafletTiles._url).toEqual("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    });

    it('should remove the map tiles if the scope tiles are changed into an empty value', function() {
        var tiles = {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        };
        angular.extend(scope, { tiles: tiles });
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)(scope);

        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });

        var leafletTiles;
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        scope.$digest();

        expect(leafletTiles._url).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
        expect(leafletMap.hasLayer(leafletTiles)).toBe(true);
        scope.tiles = {};
        scope.$digest();
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        scope.$digest();
        expect(leafletMap.hasLayer(leafletTiles)).toBe(false);
    });

    it('should remove the old tiles from the map and add a new one if the scope tiles options are changed', function() {
        var tiles = {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        };
        angular.extend(scope, { tiles: tiles });
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)(scope);

        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });

        var leafletTiles;
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        scope.$digest();

        expect(leafletTiles._url).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
        expect(leafletMap.hasLayer(leafletTiles)).toBe(true);
        scope.tiles.options = { maxZoom: 19 };
        scope.$digest();
        expect(leafletMap.hasLayer(leafletTiles)).toBe(false);
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        scope.$digest();
        expect(leafletTiles.options.maxZoom).toEqual(19);
    });
});
