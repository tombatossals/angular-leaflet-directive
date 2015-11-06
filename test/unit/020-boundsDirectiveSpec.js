'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: bounds', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var bounds;
  var scope;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    leafletData = _leafletData_;
  }));

  beforeEach(function() {
    scope = $rootScope.$new();
    bounds = {
      southWest: {
        lat: 51.508742458803326,
        lng: -0.087890625,
      },
      northEast: {
        lat: 51.508742458803326,
        lng: -0.087890625,
      },
    };
  });

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('updates the map bounds if bounds are provided', function() {
    angular.extend(scope, {
      bounds: bounds,
      center: {},
    });
    var element = angular.element('<leaflet bounds="bounds" lf-center="center"></leaflet>');
    element = $compile(element)(scope);

    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    var mapBounds = map.getBounds();
    expect(mapBounds.getSouthWest().lat).toBeCloseTo(51.508742458803326);
    expect(mapBounds.getSouthWest().lng).toBeCloseTo(-0.087890625);
    expect(mapBounds.getNorthEast().lat).toBeCloseTo(51.508742458803326);
    expect(mapBounds.getNorthEast().lng).toBeCloseTo(-0.087890625);
  });

  it('allows empty bounds initialization', function() {
    angular.extend(scope, {
      bounds: {},
      center: {},
    });
    var element = angular.element('<leaflet bounds="bounds" lf-center="center"></leaflet>');
    element = $compile(element)(scope);

    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    var mapBounds = map.getBounds();
    expect(mapBounds.getSouthWest().lat).toBeCloseTo(0);
    expect(mapBounds.getSouthWest().lng).toBeCloseTo(0);
    expect(mapBounds.getNorthEast().lng).toBeCloseTo(0);
  });

  it('should update map bounds when map initializes', function() {
    angular.extend(scope, {
      bounds: {},
      center: { lat: 5, lng: -3, zoom: 4 },
    });
    var element = angular.element('<leaflet bounds="bounds" lf-center="center"></leaflet>');
    element = $compile(element)(scope);

    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();

    var bounds = scope.bounds;
    var mapBounds = map.getBounds();

    expect(bounds.northEast).toBeDefined();
    expect(bounds.southWest).toBeDefined();

    expect(bounds.northEast.lat).toBe(mapBounds._northEast.lat);
    expect(bounds.northEast.lng).toBe(mapBounds._northEast.lng);
    expect(bounds.southWest.lat).toBe(mapBounds._southWest.lat);
    expect(bounds.southWest.lng).toBe(mapBounds._southWest.lng);
  });

  it('should initialize map with bounds only', function() {
    angular.extend(scope, {
      bounds: bounds,
      center: {},
    });
    var element = angular.element('<leaflet bounds="bounds" lf-center="center"></leaflet>');
    element = $compile(element)(scope);

    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();

    var scopeBounds = scope.bounds;
    var mapBounds = map.getBounds();

    expect(scopeBounds.northEast).toBeDefined();
    expect(scopeBounds.southWest).toBeDefined();

    expect(scopeBounds.northEast.lat).toBe(mapBounds._northEast.lat);
    expect(scopeBounds.northEast.lng).toBe(mapBounds._northEast.lng);
    expect(scopeBounds.southWest.lat).toBe(mapBounds._southWest.lat);
    expect(scopeBounds.southWest.lng).toBe(mapBounds._southWest.lng);
  });

  it('updates the map bounds with options if bounds are provided', function() {
    bounds.options = {
      padding: [50, 50],
    };
    angular.extend(scope, {
      bounds: bounds,
      center: {},
    });
    var element = angular.element('<leaflet bounds="bounds" lf-center="center"></leaflet>');
    element = $compile(element)(scope);

    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    var mapBounds = map.getBounds();
    /* Since there is no clean way to verify if the options have been used by leaflet,
       we just verify that the bounds we provided to the directive are different from the map's bounds.
       Other tests already ensure, that the bounds are correct without the options...
     */
    expect(mapBounds.getSouthWest().lat).not.toEqual(bounds.southWest.lat);
    expect(mapBounds.getSouthWest().lng).not.toEqual(bounds.southWest.lng);
    expect(mapBounds.getNorthEast().lat).not.toEqual(bounds.northEast.lat);
    expect(mapBounds.getNorthEast().lng).not.toEqual(bounds.northEast.lng);
  });

});
