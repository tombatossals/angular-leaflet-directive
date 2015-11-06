'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
  var $compile;
  var $rootScope;
  var $timeout;
  var leafletData;
  var leafletMapDefaults;
  var scope;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletMapDefaults_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    leafletData = _leafletData_;
    leafletMapDefaults = _leafletMapDefaults_;
    scope = $rootScope.$new();
  }));

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('should have loaded leaflet library inside the directive', function() {
    var element = angular.element('<leaflet></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toEqual('+-Leaflet | © OpenStreetMap contributors');
  });

  it('should set default center if not center is provided', function() {
    var element = angular.element('<leaflet></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.getZoom()).toEqual(1);
    expect(leafletMap.getCenter().lat).toEqual(0);
    expect(leafletMap.getCenter().lng).toEqual(0);
  });

  it('should set default tile if not tiles nor layers are provided', function() {
    var element = angular.element('<leaflet></leaflet>');
    element = $compile(element)(scope);
    var leafletTiles;
    leafletData.getTiles().then(function(tiles) {
      leafletTiles = tiles;
    });

    scope.$digest();
    var defaults = leafletMapDefaults.getDefaults();
    expect(leafletTiles._url).toEqual(defaults.tileLayer);
  });

  it('should set the max zoom if specified', function() {
    angular.extend(scope, { defaults: { maxZoom: 15 } });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.getMaxZoom()).toEqual(15);
  });

  it('should set the min zoom if specified', function() {
    angular.extend(scope, { defaults: { minZoom: 4 } });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.getMinZoom()).toEqual(4);
  });

  it('should set the CSS width and height if they are passed as string attributes', function() {
    var element = angular.element('<leaflet defaults="defaults" width="640px" height="480px"></leaflet>');
    element = $compile(element)(scope);

    expect(element.css('width')).toBe('640px');
    expect(element.css('height')).toBe('480px');
  });

  it('should set the CSS width and height if they are passed as number attributes', function() {
    var element = angular.element('<leaflet defaults="defaults" width=640 height=480></leaflet>');
    element = $compile(element)(scope);

    expect(element.css('width')).toBe('640px');
    expect(element.css('height')).toBe('480px');
  });

  it('should set tileLayer and tileLayer options if specified', function() {
    angular.extend(scope, {
      defaults: {
        tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
        tileLayerOptions: {
          detectRetina: true,
          opacity: 0.8,
        },
      },
    });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletTiles;
    leafletData.getTiles().then(function(tiles) {
      leafletTiles = tiles;
    });

    scope.$digest();
    var defaults = leafletMapDefaults.getDefaults();
    expect(leafletTiles.options.detectRetina).toEqual(true);
    expect(leafletTiles.options.opacity).toEqual(0.8);
    expect(leafletTiles._url).toEqual('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png');
    expect(defaults.tileLayer).toEqual('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png');
  });

  it('should set zoom control button properly if zoomControlPosition option is set', function() {
    angular.extend(scope, {
      defaults: {
        zoomControlPosition: 'topright',
      },
    });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.zoomControl.getPosition()).toEqual('topright');
  });

  it('should remove zoom control button if unset on defaults', function() {
    angular.extend(scope, {
      defaults: {
        zoomControl: false,
      },
    });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.zoomControl).toBe(undefined);
  });

  it('should unset from leafletData after scope destroy', function() {
    var element = angular.element('<leaflet></leaflet>');
    var $scope = scope.$new();

    element = $compile(element)($scope);

    $scope.$destroy();
    scope.$digest();

    var shouldNotBeMap;
    leafletData.getMap().then(function(map) {
      shouldNotBeMap = map;
    });

    scope.$digest();
    expect(shouldNotBeMap).toBe(undefined);
  });

  it('should remove zoom control button if unset on map defaults', function() {
    angular.extend(scope, {
      defaults: {
        map: {
          zoomControl: false,
        },
      },
    });
    var element = angular.element('<leaflet defaults="defaults"></leaflet>');
    element = $compile(element)(scope);
    var leafletMap;
    leafletData.getMap().then(function(map) {
      leafletMap = map;
    });

    scope.$digest();
    expect(leafletMap.zoomControl).toBe(undefined);
  });
});
