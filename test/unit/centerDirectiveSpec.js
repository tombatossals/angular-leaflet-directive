'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet center', function() {
    var $compile, $rootScope, $timeout, leafletData, center, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        leafletData = _leafletData_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    beforeEach(function(){
        center = {
            lat: 0.966,
            lng: 2.02,
            zoom: 4
        };

        scope = $rootScope.$new();
        scope.center = center;
    });

    it('should have default {[0, 0], 1} parameters on the map if not correctly defined', function() {
        scope.center = {};
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();

        leafletData.getMap().then(function(map) {
            expect(map.getZoom()).toEqual(1);
            expect(map.getCenter().lat).toEqual(0);
            expect(map.getCenter().lng).toEqual(0);
        });
    });

    it('should update the map center if the initial center scope properties are set', function() {
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();

        leafletData.getMap().then(function(map) {
            expect(map.getZoom()).toEqual(center.zoom);
            expect(map.getCenter().lat).toBeCloseTo(0.966);
            expect(map.getCenter().lng).toBeCloseTo(2.02);
        });
    });

    it('should update the map center if the scope center properties changes', function() {
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        scope.$apply();

        expect(map.getCenter().lat).toBeCloseTo(0.966);
        expect(map.getCenter().lng).toBeCloseTo(2.02);
        expect(map.getZoom()).toEqual(4);

        center.lat = 2.02;
        center.lng = 4.04;
        center.zoom = 8;
        $rootScope.$digest();

        expect(map.getCenter().lat).toBeCloseTo(2.02);
        expect(map.getCenter().lng).toBeCloseTo(4.04);
        expect(map.getZoom()).toEqual(8);
    });

});
