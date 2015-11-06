'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var leafletHelpers;
  var mainLayers;
  var mainMarkers;

  mainLayers = mainMarkers = leafletHelpers = leafletData = $rootScope = $compile = void 0;
  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletHelpers_) {
      var $timeout;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      leafletData = _leafletData_;
      leafletHelpers = _leafletHelpers_;
      $timeout = _$timeout_;
    }));

  beforeEach(function() {
      mainMarkers = {
        paris: {
          lat: 0.966,
          lng: 2.02,
        },
        madrid: {
          lat: 2.02,
          lng: 4.04,
        },
      };
      return mainLayers = {
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
          trucks: {
            name: 'trucks',
            type: 'group',
            visible: false,
          },
        },
      };
    });

  afterEach(inject(function($rootScope) {
      return $rootScope.$apply();
    }));

  it('should create main marker on the map', function() {
      var element;
      var mainMarker = {
        lat: 0.966,
        lng: 2.02,
      };

      angular.extend($rootScope, {
        markers: {
          mainMarker: mainMarker,
        },
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      return leafletData.getMarkers().then(function(leafletMarkers) {
        var leafletMainMarker;
        leafletMainMarker = leafletMarkers.mainMarker;
        expect(leafletMainMarker.getLatLng().lat).toBeCloseTo(0.966);
        return expect(leafletMainMarker.getLatLng().lng).toBeCloseTo(2.02);
      });
    });

  describe('handles common markers correctly', function() {
      return xit('markers count should be correct post update with no dupes', function() {
        var element;
        var markers1 = [
          {
            lat: 0.966,
            lng: 2.02,
          }, {
            lat: 0.10,
            lng: 5.02,
          }, {
            lat: 0.11,
            lng: 6.02,
          },
        ];

        var markers2 = markers1.concat([
          {
            lat: 26.966,
            lng: 100.02,
          }, {
            lat: -50.10,
            lng: 101.02,
          },
        ]);
        angular.extend($rootScope, {
          markers: markers1,
        });
        element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        return leafletData.getMarkers().then(function(leafletMarkers) {
          return expect(Object.keys(leafletMarkers).length).toBe(markers1.length);
        }).then((function(_this) {
          return function() {
            $rootScope.markers = markers2;
            $rootScope.$digest();
            return leafletData.getMarkers().then(function(leafletMarkers) {
              return expect(Object.keys(leafletMarkers).length).toBe(markers2.length);
            });
          };
        })(this));
      });
    });

  describe('isNested', function() {
      beforeEach(function() {
        var mainMarker;
        mainMarker = {
          lat: 0.966,
          lng: 2.02,
        };
        return this.testRunner = function(postRunnerCb, preRunnerCb) {
          var element;
          var preRunnerRet;
          angular.extend($rootScope, {
            markers: {
              layer1: {
                mainMarker: mainMarker,
              },
            },
          });
          if (preRunnerCb) {
            preRunnerRet = preRunnerCb(mainMarker);
            mainMarker = preRunnerRet ? preRunnerRet : mainMarker;
          }

          element = angular.element('<leaflet markers="markers" markers-nested="true"></leaflet>');
          element = $compile(element)($rootScope);
          $rootScope.$digest();
          return leafletData.getMarkers().then(function(leafletMarkers) {
            var leafletMainMarker;
            leafletMainMarker = leafletMarkers.layer1.mainMarker;
            if (postRunnerCb) {
              return postRunnerCb(mainMarker, leafletMainMarker);
            }
          });
        };
      });

      afterEach(function() {
        var self;
        var _this = this;
        return ['testRunner'].forEach(function(key) {
          return delete _this[key];
        });
      });

      it('should create main marker on the map', function() {
        return this.testRunner(function(mainMarker, leafletMainMarker) {
          expect(leafletMainMarker.getLatLng().lat).toBeCloseTo(mainMarker.lat);
          return expect(leafletMainMarker.getLatLng().lng).toBeCloseTo(mainMarker.lng);
        });
      });

      return it('should bind popup to main marker if message is given', function() {
        return this.testRunner((function(mainMarker, leafletMainMarker) {
          return expect(leafletMainMarker._popup._content).toEqual(mainMarker.message);
        }), function(mainMarker) {

          return angular.extend(mainMarker, {
            message: 'this is paris',
          });
        });
      });
    });

  it('should bind popup to main marker if message is given', function() {
      var element;
      var marker = {
        lat: 0.966,
        lng: 2.02,
        message: 'this is paris',
      };

      angular.extend($rootScope, {
        markers: {
          marker: marker,
        },
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      return leafletData.getMarkers().then(function(leafletMarkers) {
        var leafletMainMarker;
        leafletMainMarker = leafletMarkers.marker;
        return expect(leafletMainMarker._popup._content).toEqual('this is paris');
      });
    });

  it('message should be compiled if angular template is given', function() {
      var element;
      var leafletMainMarker;
      var marker = {
        lat: 0.966,
        lng: 2.02,
        message: '<p>{{model.color}}</p>',
        focus: true,
      };

      angular.extend($rootScope, {
        markers: {
          marker: marker,
        },
      }, {
        model: {
          color: 'blue',
        },
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      leafletMainMarker = void 0;
      leafletData.getMarkers().then(function(leafletMarkers) {
        return leafletMainMarker = leafletMarkers.marker;
      });

      $rootScope.$digest();
      leafletMainMarker.openPopup();
      $rootScope.$digest();
      return expect(leafletMainMarker._popup._contentNode.innerHTML).toEqual('<p class="ng-binding">blue</p>');
    });

  it('message should be compiled in specified scope', function() {
      var arbitraryIsolateScope;
      var element;
      var leafletMainMarker;
      var marker;
      arbitraryIsolateScope = $rootScope.$new(true);
      angular.extend(arbitraryIsolateScope, {
        model: {
          color: 'angular',
        },
      });
      marker = {
        lat: 0.966,
        lng: 2.02,
        getMessageScope: function() {
          return arbitraryIsolateScope;
        },

        message: '<p>{{model.color}}</p>',
        focus: true,
      };
      angular.extend($rootScope, {
        markers: {
          marker: marker,
        },
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      leafletMainMarker = void 0;
      leafletData.getMarkers().then(function(leafletMarkers) {
        return leafletMainMarker = leafletMarkers.marker;
      });

      $rootScope.$digest();
      leafletMainMarker.openPopup();
      $rootScope.$digest();
      return expect(leafletMainMarker._popup._contentNode.innerHTML).toEqual('<p class="ng-binding">angular</p>');
    });

  it('should bind label to main marker if message is given', function() {
      var element;
      var marker;
      spyOn(leafletHelpers.LabelPlugin, 'isLoaded').and.returnValue(true);
      L.Label = L.Class.extend({
        includes: L.Mixin.Events,
      });
      L.BaseMarkerMethods = {
        bindLabel: function(content, options) {
          this.label = new L.Label(options, this);
          this.label._content = content;
          return this;
        },

        updateLabelContent: function(content) {
          return this.label._content = content;
        },
      };
      L.Marker.include(L.BaseMarkerMethods);
      marker = {
        lat: 0.966,
        lng: 2.02,
        message: 'this is paris',
        label: {
          message: 'original',
          options: {
            clickable: true,
          },
        },
      };
      angular.extend($rootScope, {
        markers: {
          marker: marker,
        },
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      $compile(element)($rootScope);
      $rootScope.$digest();
      leafletData.getMarkers().then(function(leafletMarkers) {
        var leafletMainMarker;
        leafletMainMarker = leafletMarkers.marker;
        return expect(leafletMainMarker.label._content).toEqual('original');
      });

      marker.label.message = 'new';
      $rootScope.$digest();
      return leafletData.getMarkers().then(function(leafletMarkers) {
        var leafletMainMarker;
        leafletMainMarker = leafletMarkers.marker;
        return expect(leafletMainMarker.label._content).toEqual('new');
      });
    });

  it('should create markers on the map', function() {
      var element;
      angular.extend($rootScope, {
        markers: mainMarkers,
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      return leafletData.getMarkers().then(function(leafletMarkers) {
        expect(leafletMarkers.paris.getLatLng().lat).toBeCloseTo(0.966);
        expect(leafletMarkers.paris.getLatLng().lng).toBeCloseTo(2.02);
        expect(leafletMarkers.madrid.getLatLng().lat).toBeCloseTo(2.02);
        return expect(leafletMarkers.madrid.getLatLng().lng).toBeCloseTo(4.04);
      });
    });

  describe('when a marker is updated', function() {
      describe('detecting errors in lat-lng', function() {
        it('validates (undefined lat)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          map = leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          delete mainMarkers.madrid.lat;
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (null lat)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lat = null;
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validate (lat is NaN)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lat = 'aak';
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (lat not a number)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lat = 'not a number :P';
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (undefined lng)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          delete mainMarkers.madrid.lng;
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (null lng)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lng = null;
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (lng is NaN)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lng = 'kk';
          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (lng not a number)', function() {
          var element;
          var map;
          var markers;
          angular.extend($rootScope, {
            markers: mainMarkers,
          });
          element = angular.element('<leaflet markers="markers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            markers = leafletMarkers;
          });

          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lng = 'not a number :P';
          $rootScope.$digest();
          return expect(map.hasLayer(markers.madrid)).toBe(false);
        });

        it('validates (lng not a number) for a marker in a layer group', function() {
          var element;
          var layers;
          var map;
          var markers;
          var overlays;
          mainMarkers.paris.layer = 'cars';
          mainMarkers.madrid.layer = 'trucks';
          angular.extend($rootScope, {
            markers: mainMarkers,
            layers: mainLayers,
          });
          element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          layers = void 0;
          leafletData.getLayers().then(function(leafletLayers) {
            return layers = leafletLayers;
          });

          $rootScope.$digest();
          overlays = layers.overlays;
          expect(map.hasLayer(markers.madrid)).toBe(false);
          $rootScope.$digest();
          expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lng = 'not a number :P';
          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(false);
          expect(overlays.trucks.hasLayer(markers.madrid)).toBe(false);
          $rootScope.$digest();
          expect(map.hasLayer(markers.paris)).toBe(true);
          expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
          mainMarkers.paris.lat = 'not a number :P';
          $rootScope.$digest();
          expect(map.hasLayer(markers.paris)).toBe(false);
          return expect(overlays.cars.hasLayer(markers.paris)).toBe(false);
        });

        return it('validates (lng not a number) for a marker in a layer markercluster', function() {
          var element;
          var layers;
          var map;
          var markers;
          var overlays;
          mainMarkers.paris.layer = 'cars';
          mainMarkers.madrid.layer = 'trucks';
          mainLayers.overlays.cars.type = 'markercluster';
          mainLayers.overlays.trucks.type = 'markercluster';
          angular.extend($rootScope, {
            markers: mainMarkers,
            layers: mainLayers,
          });
          element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
          element = $compile(element)($rootScope);
          map = void 0;
          leafletData.getMap().then(function(leafletMap) {
            return map = leafletMap;
          });

          markers = void 0;
          leafletData.getMarkers().then(function(leafletMarkers) {
            return markers = leafletMarkers;
          });

          $rootScope.$digest();
          layers = void 0;
          leafletData.getLayers().then(function(leafletLayers) {
            return layers = leafletLayers;
          });

          $rootScope.$digest();
          overlays = layers.overlays;
          expect(map.hasLayer(markers.madrid)).toBe(false);
          expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
          mainMarkers.madrid.lng = 'not a number :P';
          $rootScope.$digest();
          expect(map.hasLayer(markers.madrid)).toBe(false);
          expect(overlays.trucks.hasLayer(markers.madrid)).toBe(false);
          $rootScope.$digest();
          expect(map.hasLayer(markers.paris)).toBe(false);
          expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
          mainMarkers.paris.lat = 'not a number :P';
          $rootScope.$digest();
          return expect(map.hasLayer(markers.paris)).toBe(false);
        });
      });

      it('updates lat-lng', function() {
        var element;
        var layers;
        var map;
        var markers;
        angular.extend($rootScope, {
          markers: mainMarkers,
        });
        element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        map = void 0;
        leafletData.getMap().then(function(leafletMap) {
          return map = leafletMap;
        });

        markers = void 0;
        leafletData.getMarkers().then(function(leafletMarkers) {
          return markers = leafletMarkers;
        });

        $rootScope.$digest();
        layers = void 0;
        leafletData.getLayers().then(function(leafletLayers) {
          return layers = leafletLayers;
        });

        $rootScope.$digest();
        expect(markers.paris.getLatLng().lat).toBeCloseTo(0.966);
        expect(markers.paris.getLatLng().lng).toBeCloseTo(2.02);
        expect(markers.madrid.getLatLng().lat).toBeCloseTo(2.02);
        expect(markers.madrid.getLatLng().lng).toBeCloseTo(4.04);
        mainMarkers.madrid.lng = 1.23;
        mainMarkers.madrid.lat = 4.56;
        mainMarkers.paris.lng = 7.89;
        mainMarkers.paris.lat = 0.98;
        $rootScope.$digest();
        expect(markers.paris.getLatLng().lat).toBeCloseTo(0.98);
        expect(markers.paris.getLatLng().lng).toBeCloseTo(7.89);
        expect(markers.madrid.getLatLng().lat).toBeCloseTo(4.56);
        return expect(markers.madrid.getLatLng().lng).toBeCloseTo(1.23);
      });

      return it('updates lat-lng for marker in a layer markercluster', function() {
        var element;
        var layers;
        var map;
        var markers;
        var overlays;
        mainMarkers.paris.layer = 'cars';
        mainMarkers.madrid.layer = 'trucks';
        mainLayers.overlays.cars.type = 'markercluster';
        mainLayers.overlays.trucks.type = 'markercluster';
        angular.extend($rootScope, {
          markers: mainMarkers,
          layers: mainLayers,
        });
        element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        map = void 0;
        leafletData.getMap().then(function(leafletMap) {
          return map = leafletMap;
        });

        markers = void 0;
        leafletData.getMarkers().then(function(leafletMarkers) {
          return markers = leafletMarkers;
        });

        layers = void 0;
        leafletData.getLayers().then(function(leafletLayers) {
          return layers = leafletLayers;
        });

        $rootScope.$digest();
        overlays = layers.overlays;
        expect(map.hasLayer(markers.madrid)).toBe(false);
        expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
        expect(map.hasLayer(markers.paris)).toBe(false);
        expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
        expect(markers.paris.getLatLng().lat).toBeCloseTo(0.966);
        expect(markers.paris.getLatLng().lng).toBeCloseTo(2.02);
        expect(markers.madrid.getLatLng().lat).toBeCloseTo(2.02);
        expect(markers.madrid.getLatLng().lng).toBeCloseTo(4.04);
        mainMarkers.madrid.lng = 1.23;
        mainMarkers.madrid.lat = 4.56;
        mainMarkers.paris.lng = 7.89;
        mainMarkers.paris.lat = 0.98;
        $rootScope.$digest();
        expect(map.hasLayer(markers.madrid)).toBe(false);
        expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
        expect(map.hasLayer(markers.paris)).toBe(false);
        expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
        expect(markers.paris.getLatLng().lat).toBeCloseTo(0.98);
        expect(markers.paris.getLatLng().lng).toBeCloseTo(7.89);
        expect(markers.madrid.getLatLng().lat).toBeCloseTo(4.56);
        return expect(markers.madrid.getLatLng().lng).toBeCloseTo(1.23);
      });
    });

  it('should bind popup to marker if message is given', function() {
      var element;
      var map;
      var markers;
      mainMarkers.paris.message = 'this is paris';
      angular.extend($rootScope, {
        markers: mainMarkers,
      });
      element = angular.element('<leaflet markers="markers"></leaflet>');
      element = $compile(element)($rootScope);
      map = void 0;
      leafletData.getMap().then(function(leafletMap) {
        map = leafletMap;
      });

      markers = void 0;
      leafletData.getMarkers().then(function(leafletMarkers) {
        markers = leafletMarkers;
      });

      $rootScope.$digest();
      expect(markers.paris._popup._content).toEqual('this is paris');
    });

  return describe('setting markers watches', function() {
    var DEFAULT_URL;
    var LEAF_URL;
    var defaultIcon;
    var leafIcon;
    var scope;
    mainMarkers = null;
    leafIcon = void 0;
    defaultIcon = void 0;
    mainMarkers = void 0;
    scope = void 0;
    LEAF_URL = 'http://leafletjs.com/docs/images/leaf-green.png';
    DEFAULT_URL = 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png';
    beforeEach(function() {
        leafIcon = {
          iconUrl: LEAF_URL,
          shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
          iconSize: [38, 95],
          shadowSize: [50, 64],
          iconAnchor: [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76],
        };
        defaultIcon = {
          iconUrl: DEFAULT_URL,
          shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 40],
          popupAnchor: [0, 40],
          shadowSize: [41, 41],
          shadowAnchor: [12, 40],
        };
        mainMarkers = {
          m1: {
            lat: 123,
            lng: 456,
            icon: leafIcon,
          },
        };
        scope = $rootScope.$new();
        return scope.markers = mainMarkers;
      });

    it('watches marker icon bindings', function() {
        var element;
        var icon;
        var markers;
        element = angular.element('<leaflet markers="markers" watchMarkers="true"></leaflet>');
        element = $compile(element)(scope);
        markers = void 0;
        leafletData.getMarkers().then(function(leafletMarkers) {
          return markers = leafletMarkers;
        });

        scope.$digest();
        icon = markers.m1.options.icon;
        expect(icon.options.iconUrl).toEqual(LEAF_URL);
        mainMarkers.m1.icon = defaultIcon;
        scope.$apply();
        return expect(markers.m1.options.icon.options.iconUrl).toEqual(DEFAULT_URL);
      });

    return it('does not watch on markers when watch is disabled', function() {
        var element;
        var markers;
        element = angular.element('<leaflet markers="markers" watch-markers="false"></leaflet>');
        element = $compile(element)(scope);
        markers = void 0;
        leafletData.getMarkers().then(function(leafletMarkers) {
          return markers = leafletMarkers;
        });

        scope.$digest();
        expect(markers.m1.options.icon.options.iconUrl).toEqual(LEAF_URL);
        mainMarkers.m1.icon = defaultIcon;
        scope.$apply();
        return expect(markers.m1.options.icon.options.iconUrl).toEqual(LEAF_URL);
      });
  });
});
