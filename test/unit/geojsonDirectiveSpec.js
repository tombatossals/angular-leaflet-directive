'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: geojson', function() {
    var $compile = null, $rootScope = null, leafletData = null, leafletMapDefaults = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletMapDefaults_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        leafletMapDefaults = _leafletMapDefaults_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should not create a geoJSON tilelayer if a bad structure is provided', function() {
        angular.extend($rootScope, { geojson: {} });
        var element = angular.element('<leaflet geojson="geojson"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getGeoJSON().then(function(geoJSON) {
            expect(geoJSON).not.toBeDefined();
        });
    });

    it('should create a geoJSON tilelayer if a good structure is provided', function() {
        angular.extend($rootScope, {
            geojson: {
                data: {
                    "type": "FeatureCollection",
                    "features": [ {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                        "properties": {"prop0": "value0"}
                    }, {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [ [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0] ]
                        },
                        "properties": { "prop0": "value0", "prop1": 0.0 }
                    }, {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ] ]
                        },
                        "properties": { "prop0": "value0", "prop1": {"this": "that"} }
                    } ]
                }
            }
        });
        var element = angular.element('<leaflet geojson="geojson"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getGeoJSON().then(function(geoJSON) {
            expect(geoJSON).toBeDefined();
        });
    });

    it('should remove the geoJSON layer from the map if geojson object removed from scope', function() {
        angular.extend($rootScope, {
            geojson: {
                data: {
                    "type": "FeatureCollection",
                    "features": [ {
                        "type": "Feature",
                        "geometry": { "type": "Point", "coordinates": [102.0, 0.5] },
                        "properties": {"prop0": "value0"}
                    }, {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [ [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0] ]
                        },
                        "properties": { "prop0": "value0", "prop1": 0.0 }
                    }, {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ] ]
                        },
                        "properties": { "prop0": "value0", "prop1": {"this": "that"} }
                    } ]
                }
            }
        });

        var element = angular.element('<leaflet geojson="geojson"></leaflet>');
        element = $compile(element)($rootScope);

        var leafletGeoJSON = {},
            leafletMap = {};

        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        leafletData.getGeoJSON().then(function(geoJSON) {
            leafletGeoJSON = geoJSON;
        });

        $rootScope.$digest();
        expect(leafletMap.hasLayer(leafletGeoJSON)).toBe(true);
        $rootScope.geojson = {};
        $rootScope.$digest();
        expect(leafletMap.hasLayer(leafletGeoJSON)).toBe(false);
    });
});
