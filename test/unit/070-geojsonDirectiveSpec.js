'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: geojson', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var leafletMapDefaults;
  var scope;
  leafletMapDefaults = leafletData = scope = $compile = $rootScope = null;
  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletMapDefaults_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      leafletData = _leafletData_;
      leafletMapDefaults = _leafletMapDefaults_;
      scope = $rootScope.$new();
    }));

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('should not create a geoJSON tilelayer if a bad structure is provided', function() {
      var element;
      angular.extend(scope, {
        geojson: {},
      });
      element = angular.element('<leaflet geojson="geojson"></leaflet>');
      element = $compile(element)(scope);
      leafletData.getGeoJSON().then(function(geoJSON) {
        return expect(geoJSON).not.toBeDefined();
      });
    });

  it('should create a geoJSON tilelayer if a good structure is provided', function() {
      var element;
      angular.extend(scope, {
        geojson: {
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [102.0, 0.5],
                },
                properties: {
                  prop0: 'value0',
                },
              }, {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]],
                },
                properties: {
                  prop0: 'value0',
                  prop1: 0.0,
                },
              }, {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                },
                properties: {
                  prop0: 'value0',
                  prop1: {
                    this: 'that',
                  },
                },
              },
            ],
          },
        },
      });
      element = angular.element('<leaflet geojson="geojson"></leaflet>');
      element = $compile(element)(scope);
      leafletData.getGeoJSON().then(function(geoJSON) {
        expect(geoJSON).toBeDefined();
        expect(Object.keys(geoJSON._layers).length).toBe(3);
      });
    });

  it('should remove the geoJSON layer from the map if geojson object removed from scope', function() {
      var element;
      var leafletGeoJSON;
      var leafletMap;
      angular.extend(scope, {
        geojson: {
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [102.0, 0.5],
                },
                properties: {
                  prop0: 'value0',
                },
              }, {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]],
                },
                properties: {
                  prop0: 'value0',
                  prop1: 0.0,
                },
              }, {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                },
                properties: {
                  prop0: 'value0',
                  prop1: {
                    this: 'that',
                  },
                },
              },
            ],
          },
        },
      });
      element = angular.element('<leaflet geojson="geojson"></leaflet>');
      element = $compile(element)(scope);
      leafletGeoJSON = void 0;
      leafletMap = void 0;
      leafletData.getMap().then(function(map) {
        return leafletMap = map;
      });

      scope.$digest();
      leafletData.getGeoJSON().then(function(geoJSON) {
        return leafletGeoJSON = geoJSON;
      });

      scope.$digest();
      scope.$digest();
      expect(leafletMap.hasLayer(leafletGeoJSON)).toBe(true);
      scope.geojson = {};
      scope.$digest();
      expect(leafletMap.hasLayer(leafletGeoJSON)).toBe(false);
    });

  describe('nested', function() {
      it('should create a geoJSON tilelayer if a good structure is provided', function() {
        var element;
        angular.extend(scope, {
          geojson: {
            one: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [102.0, 0.5],
                    },
                    properties: {
                      prop0: 'value0',
                    },
                  },
                ],
              },
            },
            two: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]],
                    },
                    properties: {
                      prop0: 'value0',
                      prop1: 0.0,
                    },
                  },
                ],
              },
            },
            three: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    },
                    properties: {
                      prop0: 'value0',
                      prop1: {
                        this: 'that',
                      },
                    },
                  },
                ],
              },
            },
          },
        });
        element = angular.element('<leaflet geojson="geojson" geojson-nested="true"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getGeoJSON().then(function(geoJSON) {
          expect(geoJSON).toBeDefined();
          expect(Object.keys(geoJSON).length).toBe(3);
          angular.forEach(function(lObject) {
            expect(Object.keys(lObject._layers).length).toBe(1);
          });
        });
      });

      it('should remove the geoJSON layer from the map if geojson object removed from scope', function() {
        var element;
        var leafletGeoJSON;
        var leafletMap;
        angular.extend(scope, {
          geojson: {
            one: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [102.0, 0.5],
                    },
                    properties: {
                      prop0: 'value0',
                    },
                  },
                ],
              },
            },
            two: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]],
                    },
                    properties: {
                      prop0: 'value0',
                      prop1: 0.0,
                    },
                  },
                ],
              },
            },
            three: {
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    },
                    properties: {
                      prop0: 'value0',
                      prop1: {
                        this: 'that',
                      },
                    },
                  },
                ],
              },
            },
          },
        });
        element = angular.element('<leaflet geojson="geojson" geojson-nested="true"></leaflet>');
        element = $compile(element)(scope);
        leafletGeoJSON = void 0;
        leafletMap = void 0;
        leafletData.getMap().then(function(map) {
          return leafletMap = map;
        });

        scope.$digest();
        leafletData.getGeoJSON().then(function(geoJSON) {
          return leafletGeoJSON = geoJSON;
        });

        scope.$digest();
        expect(leafletMap.hasLayer(leafletGeoJSON.one)).toBe(true);
        scope.geojson = {};
        scope.$digest();
        expect(leafletMap.hasLayer(leafletGeoJSON.one)).toBe(false);
      });
    });
});
