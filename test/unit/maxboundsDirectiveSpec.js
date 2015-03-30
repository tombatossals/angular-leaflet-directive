'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile = null, $rootScope = null, $timeout, leafletData = null, leafletMapDefaults = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletMapDefaults_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        leafletData = _leafletData_;
        leafletMapDefaults = _leafletMapDefaults_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    it('should change the center if maxbounds specified', function() {
        angular.extend($rootScope, {
            maxbounds: {
                southWest: {
                    lat: 52.14823737817847,
                    lng: 20.793685913085934
                },
                northEast: {
                    lat: 52.31645452105213,
                    lng: 21.233139038085938
                }
            },
            defaults: {
                zoomAnimation: false
            }
        });
        var element = angular.element('<leaflet defaults="defaults" maxbounds="maxbounds"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMap;
        leafletData.getMap().then(function(map) {
            leafletMap = map;
        });
        $rootScope.$apply();
        var decimalPlaces = 13; //PhantomJS appears to be diff then chrome
        expect(leafletMap.getCenter().lat.toFixed(decimalPlaces)).toBe((52.23242563023071).toFixed(decimalPlaces));
        expect(leafletMap.getCenter().lng.toFixed(decimalPlaces)).toBe((21.013412475585938).toFixed(decimalPlaces));
    });

});
