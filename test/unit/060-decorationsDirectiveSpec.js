'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: decorations', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var leafletHelpers;
  var mainCoordinates;
  var mainDecorations;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    leafletData = _leafletData_;
    leafletHelpers = _leafletHelpers_;
  }));

  beforeEach(function() {
    mainCoordinates = [
                [0.966, 2.02],
                [2.02, 4.04],
            ];
    mainDecorations = {
      arrow: {
        coordinates: mainCoordinates,
        patterns: [{offset: '10%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}})}],
      },
      markers: {
        coordinates: mainCoordinates,
        patterns: { offset: '5%', repeat: '10%', symbol: L.Symbol.marker()},
      },
    };
  });

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('should create a decoration on the map', function() {
    angular.extend($rootScope, {
      decorations: {
        arrow: mainDecorations.arrow,
      },
    });

    var element = angular.element('<leaflet decorations="decorations"></leaflet>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    leafletData.getDecorations().then(function(leafletDecorations) {
      var leafletArrow = leafletDecorations.arrow;

      // Unfortunately, the L.PolylineDecorator class does not currently expose any value accessors.
      expect(leafletArrow.options.patterns.offset).toBe('10%');
      expect(leafletArrow.options.patterns.repeat).toBe(0);
      expect(leafletArrow.options.symbol).toEqual(L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}}));
    });
  });
});
