'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile = null, $rootScope = null, leafletData = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
    }));

    // Marker
    it('should create main marker on the map', function() {
        var main_marker = {
            lat: 0.966,
            lng: 2.02
        };
        angular.extend($rootScope, { marker: main_marker });
        var element = angular.element('<leaflet marker="marker"></leaflet>');
        element = $compile(element)($rootScope);
        var map = leafletData.getMap();
        leafletData.getMainMarker().then(function(leafletMainMarker) {
            $rootScope.$digest();
            expect(leafletMainMarker.getLatLng().lat).toBeCloseTo(0.966);
            expect(leafletMainMarker.getLatLng().lng).toBeCloseTo(2.02);
        });
    });

    it('should bind popup to main marker if message is given', function() {
        var marker = {
            lat: 0.966,
            lng: 2.02,
            message: 'this is paris'
        };
        angular.extend($rootScope, { marker: marker});
        var element = angular.element('<leaflet marker="marker"></leaflet>');
        element = $compile(element)($rootScope);
        var map = leafletData.getMap();
        leafletData.getMainMarker().then(function(leafletMainMarker) {
            $rootScope.$digest();
            expect(leafletMainMarker._popup._content)
                .toEqual('this is paris');
        });
    });

    it('should not trigger move event if marker position is not changed', function() {
        var main_marker = {
            lat: 0.966,
            lng: 2.02
        };
        angular.extend($rootScope, { marker: main_marker });
        var element = angular.element('<leaflet marker="marker"></leaflet>');
        element = $compile(element)($rootScope);
        var map = leafletData.getMap();
        leafletData.getMainMarker().then(function(leafletMainMarker) {
            $rootScope.$digest();
            main_marker.lat = 0;
            leafletMainMarker.on('move', function() {
                expect('this should not happend!').toEqual('it happended');
            });
            leafletMainMarker.fire('dragend');
        });
    });
});
