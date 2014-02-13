'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile = null, $rootScope = null, $timeout, leafletData = null, leafletMapDefaults = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletMapDefaults_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        leafletData = _leafletData_;
        leafletMapDefaults = _leafletMapDefaults_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should have loaded leaflet library inside the directive', function() {
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.text()).toEqual('+-Leaflet | © OpenStreetMap contributors');
    });

    it('should set default center if not center is provided', function() {
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$digest();
        expect(leafletMap.getZoom()).toEqual(1);
        expect(leafletMap.getCenter().lat).toEqual(0);
        expect(leafletMap.getCenter().lng).toEqual(0);
    });

    it('should set default tile if not tiles nor layers are provided', function() {
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        var leafletTiles;
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        $rootScope.$digest();
        var defaults = leafletMapDefaults.getDefaults();
        expect(leafletTiles._url).toEqual(defaults.tileLayer);
    });

    it('should set the max zoom if specified', function() {
        angular.extend($rootScope, { defaults: { maxZoom: 15 } });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$digest();
        expect(leafletMap.getMaxZoom()).toEqual(15);
    });

    it('should set the min zoom if specified', function() {
        angular.extend($rootScope, { defaults: { minZoom: 4 } });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$digest();
        expect(leafletMap.getMinZoom()).toEqual(4);
    });

    it('should set the CSS width and height if they are passed as string attributes', function() {
        var element = angular.element('<leaflet defaults="defaults" width="640px" height="480px"></leaflet>');
        element = $compile(element)($rootScope);

        expect(element.css("width")).toBe("640px");
        expect(element.css("height")).toBe("480px");
    });

    it('should set the CSS width and height if they are passed as number attributes', function() {
        var element = angular.element('<leaflet defaults="defaults" width=640 height=480></leaflet>');
        element = $compile(element)($rootScope);

        expect(element.css("width")).toBe("640px");
        expect(element.css("height")).toBe("480px");
    });

    it('should set tileLayer and tileLayer options if specified', function() {
        angular.extend($rootScope, {
            defaults: {
                tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                tileLayerOptions: {
                    detectRetina: true,
                    opacity: 0.8
                }
            }
        });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletTiles;
        leafletData.getTiles().then(function(tiles) {
            leafletTiles = tiles;
        });
        $rootScope.$digest();
        var defaults = leafletMapDefaults.getDefaults();
        expect(leafletTiles.options.detectRetina).toEqual(true);
        expect(leafletTiles.options.opacity).toEqual(0.8);
        expect(leafletTiles._url).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
        expect(defaults.tileLayer).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
    });

    it('should set zoom control button properly if zoomControlPosition option is set', function() {
        angular.extend($rootScope, {
            defaults: {
                zoomControlPosition: 'topright'
            }
        });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$digest();
        expect(leafletMap.zoomControl.getPosition()).toEqual('topright');
    });

    it('should remove zoom control button if unset on defaults', function() {
        angular.extend($rootScope, {
            defaults: {
                zoomControl: false
            }
        });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$digest();
        expect(leafletMap.zoomControl).toBe(undefined);
    });
});
