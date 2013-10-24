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

    it('should have loaded leaflet library inside the directive', function() {
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        expect(element.text()).toEqual('+-Leaflet | © OpenStreetMap contributors');
    });

    it('should set the max zoom if specified', function() {
        angular.extend($rootScope, { defaults: { maxZoom: 15 } });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var map = leafletData.getMap();
        expect(map.getMaxZoom()).toEqual(15);
    });

    it('should set the min zoom if specified', function() {
        angular.extend($rootScope, { defaults: { minZoom: 4 } });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var map = leafletData.getMap();
        expect(map.getMinZoom()).toEqual(4);
    });
});
