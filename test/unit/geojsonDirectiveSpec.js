'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: geojson', function() {
    var $compile = null, $rootScope = null, leafletData = null, leafletMapDefaults = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletMapDefaults_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        leafletMapDefaults = _leafletMapDefaults_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should not create a geoJSON tilelayer if a bad structure is provided', function() {
        angular.extend($rootScope, { geojson: {} });
        var element = angular.element('<leaflet geojson="geojson"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getGeoJSON().then(function(geoJSON) {
            expect(geoJSON).not.toBeDefined();
        });
    });
});
