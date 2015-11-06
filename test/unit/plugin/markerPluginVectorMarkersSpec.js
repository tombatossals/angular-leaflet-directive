'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Plugin: VectorMarkers', function() {
  var $compile;
  var $rootScope;
  var scope;
  var leafletData;
  var leafletHelpers;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    leafletData = _leafletData_;
    leafletHelpers = _leafletHelpers_;
  }));

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('should load plugin for the vector markers', function() {
    var plugin = leafletHelpers.VectorMarkersPlugin;

    expect(plugin).toBeDefined();
    expect(plugin.isLoaded()).toBeTruthy();
  });

  it('should create a new vector marker', function() {
    var myMarker = {
      lat: 51,
      lng: 0,
      icon: {
        type: 'vectorMarker',
        icon: 'tag',
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

    var plugin = leafletHelpers.VectorMarkersPlugin;

    leafletData.getMarkers().then(function(markers) {
      expect(markers).toBeDefined();
      expect(markers.myMarker).toBeDefined();
      expect(plugin.is(markers.myMarker.options.icon)).toBeTruthy();
    });
  });

  it('icon should differ from a common marker\'s icon', function() {
    var commonMarker = {
          lat: 51,
          lng: 0,
          icon: {},
        };
    var vectorMarker = {
      lat: 51,
      lng: 0,
      icon: {
        type: 'vectorMarker',
        icon: 'tag',
        markerColor: 'red',
      },
    };

    angular.extend(scope, {
      markers: {
        commonMarker: commonMarker,
        vectorMarker: vectorMarker,
      },
    });

    var element = angular.element('<leaflet markers="markers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();

    var plugin = leafletHelpers.VectorMarkersPlugin;

    leafletData.getMarkers().then(function(markers) {
      expect(markers).toBeDefined();
      expect(markers.commonMarker).toBeDefined();
      expect(markers.vectorMarker).toBeDefined();
      expect(plugin.is(markers.commonMarker.options.icon)).toBeFalsy();
      expect(plugin.is(markers.vectorMarker.options.icon)).toBeTruthy();
      expect(plugin.equal(markers.commonMarker.options.icon, markers.vectorMarker.options.icon)).toBeFalsy();
    });
  });

});
