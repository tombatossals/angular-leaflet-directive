'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: bounds', function() {
    var $compile = null, $rootScope = null, leafletData = null, leafletMapDefaults = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should update the map bounds if bounds are provided', function() {
        var bounds = {
            southWest: {
                lat: 51.508742458803326,
                lng: -0.087890625,
            },
            northEast: {
                lat: 51.508742458803326,
                lng: -0.087890625,
            }
        };
        angular.extend($rootScope, { bounds: bounds });
        var element = angular.element('<leaflet bounds="bounds"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        var mapBounds = map.getBounds();
        expect(mapBounds.getSouthWest().lat).toBeCloseTo(51.508742458803326);
        expect(mapBounds.getSouthWest().lng).toBeCloseTo(-0.087890625);
        expect(mapBounds.getNorthEast().lat).toBeCloseTo(51.508742458803326);
        expect(mapBounds.getNorthEast().lng).toBeCloseTo(-0.087890625);
    });
});
