'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
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

    it('should set default tiles if bad tiles structure is provided', function() {
        angular.extend($rootScope, {});
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getTiles().then(function(leafletTiles) {
            leafletMapDefaults.getDefaults().then(function(defaults) {
                expect(leafletTiles._url).toEqual(defaults.tileLayer);
            });
        });
    });

    it('should update the map tiles if the scope tiles properties changes', function() {
        var tiles = {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        };
        angular.extend($rootScope, { tiles: tiles });
        var element = angular.element('<leaflet tiles="tiles"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getTiles().then(function(leafletTiles) {
            expect(leafletTiles._url).toEqual("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png");
            $rootScope.tiles.url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            expect($rootScope.tiles.url).toEqual("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        });
    });
});
