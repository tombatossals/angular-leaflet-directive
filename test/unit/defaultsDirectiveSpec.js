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

    it('should set tileLayer options if specified', function() {
        angular.extend($rootScope, {
            defaults: {
                tileLayerOptions: {
                    detectRetina: true,
                    opacity: 0.8
                }
            }
        });
        var element = angular.element('<leaflet defaults="defaults"></leaflet>');
        element = $compile(element)($rootScope);
        var tileLayerObj = leafletData.getTile();
        expect(tileLayerObj.options.detectRetina).toEqual(true);
        expect(tileLayerObj.options.opacity).toEqual(0.8);
    });
});
