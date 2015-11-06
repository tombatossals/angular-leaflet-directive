'use strict';

describe('Directive: leaflet center', function() {
    var $compile;
    var $location;
    var $rootScope;
    var $timeout;
    var center;
    var directiveName;
    var key;
    var leafletData;
    var ref;
    var results;
    var scope;
    scope = center = leafletData = $location = $timeout = $compile = $rootScope = void 0;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$location_, _leafletData_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      window.ngLeafLetTestGlobals.$timeout = $timeout;
      $location = _$location_;
      leafletData = _leafletData_;
      center = {
        lat: 0.96658,
        lng: 2.02,
        zoom: 4,
      };
    }));

    beforeEach(function() {
      scope = $rootScope.$new();
      scope.center = center;
    });

    afterEach(inject(function($rootScope) {
      if (!$rootScope.$$phase) {
        return $rootScope.$apply();
      }
    }));

    ref = ['center', 'lf-center'];
    results = [];
    for (key in ref) {
      directiveName = ref[key];
      results.push(describe(directiveName, function() {
        describe('sets leaflet from scope', function() {
          it('should have default {[0, 0], 1} parameters on the map if not correctly defined', function() {
            var element;
            scope.center = {};
            element = angular.element('<leaflet ' + directiveName + '=\'center\'></leaflet>');
            element = $compile(element)(scope);
            scope.$digest();
            return leafletData.getMap().then(function(map) {
              expect(map.getZoom()).toEqual(1);
              expect(map.getCenter().lat).toEqual(0);
              return expect(map.getCenter().lng).toEqual(0);
            });
          });

          it('should update the map center if the initial center scope properties are set', function() {
            var element;
            element = angular.element('<leaflet ' + directiveName + '=\'center\'></leaflet>');
            element = $compile(element)(scope);
            scope.$digest();
            return leafletData.getMap().then(function(map) {
              expect(map.getZoom()).toEqual(center.zoom);
              expect(map.getCenter().lat).toBeCloseTo(0.96658, 4);
              return expect(map.getCenter().lng).toBeCloseTo(2.02, 4);
            });
          });

          it('should update the map center if the scope center properties changes', function() {
            var element, map;
            element = angular.element('<leaflet ' + directiveName + '=\'center\'></leaflet>');
            element = $compile(element)(scope);
            map = void 0;
            leafletData.getMap().then(function(leafletMap) {
              return map = leafletMap;
            });

            scope.$apply();
            expect(map.getCenter().lat).toBeCloseTo(0.96658, 4);
            expect(map.getCenter().lng).toBeCloseTo(2.02, 4);
            expect(map.getZoom()).toEqual(4);
            center.lat = 2.02999;
            center.lng = 4.04;
            center.zoom = 8;
            scope.$digest();
            expect(map.getCenter().lat).toBeCloseTo(2.02999, 4);
            expect(map.getCenter().lng).toBeCloseTo(4.04, 4);
            return expect(map.getZoom()).toEqual(8);
          });

          return describe('Using url-hash functionality', function() {
            return it('should update the center of the map if changes the url', function() {
              var centerParams, element, map;
              element = angular.element('<leaflet ' + directiveName + '=\'center\' url-hash-center=\'yes\'></leaflet>');
              element = $compile(element)(scope);
              map = void 0;
              leafletData.getMap().then(function(leafletMap) {
                return map = leafletMap;
              });

              centerParams = {
                c: '30.1' + ':' + '-9.2' + ':' + '4',
              };
              $location.search(centerParams);
              scope.$digest();
              expect(map.getCenter().lat).toBeCloseTo(30.1, 4);
              expect(map.getCenter().lng).toBeCloseTo(-9.2, 4);
              return expect(map.getZoom()).toEqual(4);
            });
          });
        });

        return describe('sets scope from leaflet', function() {
          it('should update the url hash if changes the center', function() {
            var centerUrlHash, element;
            element = angular.element('<leaflet ' + directiveName + '=\'center\' url-hash-center=\'yes\'></leaflet>');
            element = $compile(element)(scope);
            scope.center = {
              lat: 9.52478,
              lng: -1.8,
              zoom: 8,
            };
            centerUrlHash = void 0;
            scope.$on('centerUrlHash', function(event, u) {
              return centerUrlHash = u;
            });

            scope.$digest();
            return expect(centerUrlHash).toBe('9.5248:-1.8000:8');
          });

          return it('should update the scope.center if leaflet map is moved', function(done) {
            var element;
            element = angular.element('<leaflet ' + directiveName + '=\'center\'></leaflet>');
            element = $compile(element)(scope);
            this.digest(scope, function() {
              return leafletData.getMap().then(function(map) {
                expect(map.getZoom()).toEqual(center.zoom);
                expect(map.getCenter().lat).toBeCloseTo(0.96658, 4);
                expect(map.getCenter().lng).toBeCloseTo(2.02, 4);
                return map.setView(L.latLng(50.5, 30.5));
              });
            });

            this.digest(scope, function() {
              return leafletData.getMap().then(function(map) {
                expect(scope.center.lat).toBe(50.5);
                expect(scope.center.lng).toBe(30.5);
                return map.setView(L.latLng(51.5, 31.5));
              });
            });

            return this.digest(scope, function() {
              return leafletData.getMap().then(function(map) {
                expect(scope.center.lat).toBe(51.5);
                expect(scope.center.lng).toBe(31.5);
                return done();
              });
            });
          });
        });
      }));
    }

    return results;
  });
