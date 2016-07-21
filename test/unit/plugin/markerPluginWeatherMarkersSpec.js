'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Plugin: WeatherMarkers', function () {
  var $compile;
  var $rootScope;
  var scope;
  var leafletData;
  var leafletHelpers;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function (_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    leafletData = _leafletData_;
    leafletHelpers = _leafletHelpers_;
  }));

  afterEach(inject(function ($rootScope) {
    $rootScope.$apply();
  }));

  it('should load plugin for the weather markers', function () {
    var plugin = leafletHelpers.WeatherMarkersPlugin;

    expect(plugin).toBeDefined();
    expect(plugin.isLoaded()).toBeTruthy();
  });

  it('should create a new vector marker', function () {
    var myMarker = {
      lat: 51,
      lng: 0,
      icon: {
        type: 'weatherMarker',
        icon: 'hot',
        markerColor: 'red',
      },
    };

    angular.extend(scope, {
      markers: {
        myMarker: myMarker,
      },
    });

    var element = angular.element('<leaflet markers="markers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();

    var plugin = leafletHelpers.WeatherMarkersPlugin;

    leafletData.getMarkers().then(function (markers) {
      expect(markers).toBeDefined();
      expect(markers.myMarker).toBeDefined();
      expect(plugin.is(markers.myMarker.options.icon)).toBeTruthy();
    });
  });

  it('icon should differ from a common marker\'s icon', function () {
    var commonMarker = {
          lat: 51,
          lng: 0,
          icon: {},
        };
    var weatherMarker = {
      lat: 51,
      lng: 0,
      icon: {
        type: 'weatherMarker',
        icon: 'hot',
        markerColor: 'red',
      },
    };

    angular.extend(scope, {
      markers: {
        commonMarker: commonMarker,
        weatherMarker: weatherMarker,
      },
    });

    var element = angular.element('<leaflet markers="markers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();

    var plugin = leafletHelpers.WeatherMarkersPlugin;

    leafletData.getMarkers().then(function (markers) {
      expect(markers).toBeDefined();
      expect(markers.commonMarker).toBeDefined();
      expect(markers.weatherMarker).toBeDefined();
      expect(plugin.is(markers.commonMarker.options.icon)).toBeFalsy();
      expect(plugin.is(markers.weatherMarker.options.icon)).toBeTruthy();
      expect(plugin.equal(markers.commonMarker.options.icon, markers.weatherMarker.options.icon)).toBeFalsy();
    });
  });

});
