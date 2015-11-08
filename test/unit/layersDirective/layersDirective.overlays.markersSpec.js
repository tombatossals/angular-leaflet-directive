/*
jshint -W117
jshint globalstrict: true
jasmine specs for directives go here
 */

describe('Directive: leaflet: layers.overlays.markers', function() {
  var $compile;
  var $q;
  var $rootScope;
  var $timeout;
  var leafletData;
  var leafletMarkersHelper;
  var scope;
  $timeout = $q = scope = leafletData = $rootScope = $compile = leafletMarkersHelper = void 0;
  beforeEach(function() {
    module('leaflet-directive');
    inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletMarkersHelpers_, _$q_, _$timeout_) {
      $timeout = _$timeout_;
      $q = _$q_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      leafletData = _leafletData_;
      leafletMarkersHelper = _leafletMarkersHelpers_;
      scope = $rootScope.$new();
    });
  });

  afterEach(inject(function($rootScope) {
    if (!scope.$$phase) {
      return $rootScope.$apply();
    }
  }));

  describe('marker isNested', function() {
    it('should check for a marker in the layer group that is visible', function(done) {
      var element;
      angular.extend(scope, {
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              layerOptions: {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true,
              },
            },
          },
          overlays: {
            cars: {
              name: 'cars',
              type: 'group',
              visible: true,
            },
          },
        },
        markers: {
          cars: {
            m1: {
              lat: 1.2,
              lng: 0.3,
            },
            m2: {
              lat: 1.2,
              lng: 0.3,
            },
          },
        },
      });
      element = angular.element('<leaflet lf-layers="layers" lf-markers="markers" markers-nested="true"></leaflet>');
      element = $compile(element)(scope);

      scope.$digest();
      $q.all([leafletData.getMap(), leafletData.getLayers(), leafletData.getMarkers()]).then(function(promiseArray) {
        var layers;
        var map;
        var markerToCheck;
        var markers;

        map = promiseArray[0], layers = promiseArray[1], markers = promiseArray[2];
        expect(Object.keys(markers).length).toEqual(1);
        expect(Object.keys(markers.cars).length).toEqual(2);
        markerToCheck = markers.cars.m1;
        expect(markerToCheck instanceof L.Marker).toBe(true);
        expect(map.hasLayer(markerToCheck)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markerToCheck)).toBe(true);
        done();
      });

      $rootScope.$digest();
    });

    it('should check for a marker in a wrong layer group', function() {
      var element;
      angular.extend(scope, {
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              layerOptions: {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true,
              },
            },
          },
          overlays: {
            cars: {
              name: 'cars',
              type: 'group',
              visible: true,
            },
          },
        },
        markers: {
          bikes: {
            m1: {
              lat: 1.2,
              lng: 0.3,
            },
          },
        },
      });
      element = angular.element('<leaflet lf-layers="layers" lf-markers="markers" markers-nested="true"></leaflet>');
      element = $compile(element)(scope);
      leafletData.getMarkers().then(function(markers) {
        expect(Object.keys(markers).length).toEqual(0);
      });
    });
  });

  describe('marker', function() {
    it('should check for a marker in the layer group that is visible', function() {
      var element;
      var map;
      var markers;
      angular.extend(scope, {
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              layerOptions: {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true,
              },
            },
          },
          overlays: {
            cars: {
              name: 'cars',
              type: 'group',
              visible: true,
            },
          },
        },
        markers: {
          m1: {
            lat: 1.2,
            lng: 0.3,
            layer: 'cars',
          },
        },
      });
      element = angular.element('<leaflet lf-layers="layers" lf-markers="markers"></leaflet>');
      element = $compile(element)(scope);
      map = void 0;
      leafletData.getMap().then(function(leafletMap) {
        map = leafletMap;
      });

      scope.$digest();

      markers = void 0;
      leafletData.getMarkers().then(function(leafletMarkers) {
        markers = leafletMarkers;
      });

      scope.$digest();
      leafletData.getLayers().then(function(layers) {
        expect(Object.keys(markers).length).toEqual(1);
        expect(markers.m1 instanceof L.Marker).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(map.hasLayer(markers.m1)).toBe(true);
      });
    });

    it('should check for a marker in a wrong layer group', function() {
      var element;
      angular.extend(scope, {
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              layerOptions: {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true,
              },
            },
          },
          overlays: {
            cars: {
              name: 'cars',
              type: 'group',
              visible: true,
            },
          },
        },
        markers: {
          m1: {
            lat: 1.2,
            lng: 0.3,
            layer: 'bikes',
          },
        },
      });
      element = angular.element('<leaflet lf-layers="layers" lf-markers="markers"></leaflet>');
      element = $compile(element)(scope);
      leafletData.getMarkers().then(function(markers) {
        expect(Object.keys(markers).length).toEqual(0);
      });
    });

    it('should check for a marker the old way', function() {
      var element;
      var map;
      angular.extend(scope, {
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              layerOptions: {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true,
              },
            },
          },
          overlays: {
            cars: {
              name: 'cars',
              type: 'group',
              visible: true,
            },
          },
        },
        markers: {
          m1: {
            lat: 1.2,
            lng: 0.3,
          },
        },
      });
      element = angular.element('<leaflet lf-layers="layers" lf-markers="markers"></leaflet>');
      element = $compile(element)(scope);
      map = void 0;
      leafletData.getMap().then(function(leafletMap) {
        map = leafletMap;
      });

      scope.$digest();
      leafletData.getMarkers().then(function(markers) {
        expect(Object.keys(markers).length).toEqual(1);
        expect(map.hasLayer(markers.m1)).toBe(true);
      });
    });
  });
});
