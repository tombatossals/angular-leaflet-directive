'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    beforeEach(module('leaflet-directive'));

    it('should have loaded leaflet library inside the directive', function() {
        inject(function($rootScope, $compile) {
            var element = angular.element('<leaflet></leaflet>');
            element = $compile(element)($rootScope);
            expect(element.text()).toEqual('+-Powered by Leaflet — Tiles © Open Street Maps');
        });
    });

    it('should set the max zoom if specified', function() {
        inject(function($rootScope, $compile) {
            angular.extend($rootScope, { defaults: { maxZoom: 15 } });
            var element = angular.element('<leaflet defaults="defaults" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            expect(map.getMaxZoom()).toEqual(15);
        });
    });

    it('should set tileLayer options if specified', function() {
        inject(function($rootScope, $compile) {
            angular.extend($rootScope, {
                defaults: {
                    tileLayerOptions: {
                        detectRetina: true,
                        opacity: 0.8
                    }
                }
            });
            var element = angular.element('<leaflet defaults="defaults" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var tileLayerObj = element.scope().leaflet.tileLayerObj;
            expect(tileLayerObj.options.detectRetina).toEqual(true);
            expect(tileLayerObj.options.opacity).toEqual(0.8);
        });
    });

    it('should have default parameters on the map if not specified', function() {
        inject(function($rootScope, $compile) {
            angular.extend($rootScope, {});
            var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            expect(map.getZoom()).toEqual(1);
            expect(map.getCenter().lat).toEqual(0);
            expect(map.getCenter().lng).toEqual(0);
        });
    });

    it('should update the map center if the initial center scope properties are set', function() {
        inject(function($rootScope, $compile) {
            var center = {
                lat: 0.966,
                lng: 2.02,
                zoom: 4
            };
            angular.extend($rootScope, { center: center, map: undefined });
            var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            $rootScope.$digest();
            var map = element.scope().leaflet.map;
            expect(map.getZoom()).toEqual(center.zoom);
            expect(map.getCenter().lat).toBeCloseTo(0.966);
            expect(map.getCenter().lng).toBeCloseTo(2.02);
        });
    });

    it('should update the map center if the scope center properties changes', function() {
        inject(function($rootScope, $compile) {
            var center = {
                lat: 0.966,
                lng: 2.02,
                zoom: 4
            };
            angular.extend($rootScope, { center: center });
            var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            center.lat = 2.02;
            center.lng = 4.04;
            center.zoom = 8;
            $rootScope.$digest();
            expect(map.getCenter().lat).toBeCloseTo(2.02);
            expect(map.getCenter().lng).toBeCloseTo(4.04);
            expect(map.getZoom()).toEqual(8);
        });
    });

    // Markers
    it('should create markers on the map', function() {
        inject(function($rootScope, $compile) {
            var markers = {
                paris: {
                    lat: 0.966,
                    lng: 2.02
                },
                madrid: {
                    lat: 2.02,
                    lng: 4.04
                }
            };
            angular.extend($rootScope, { markers: markers });
            var element = angular.element('<leaflet markers="markers" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            var leafletMarkers = element.scope().leaflet.markers;
            $rootScope.$digest();
            expect(leafletMarkers.paris.getLatLng().lat).toBeCloseTo(0.966);
            expect(leafletMarkers.paris.getLatLng().lng).toBeCloseTo(2.02);
            expect(leafletMarkers.madrid.getLatLng().lat).toBeCloseTo(2.02);
            expect(leafletMarkers.madrid.getLatLng().lng).toBeCloseTo(4.04);
        });
    });

    it('should bind popup to marker if message is given', function() {
        inject(function($rootScope, $compile) {
            var markers = {
                paris: {
                    lat: 0.966,
                    lng: 2.02,
                    message: 'this is paris'
                }
            };
            angular.extend($rootScope, { markers: markers});
            var element = angular.element('<leaflet markers="markers" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().map;
            var leafletMarkers = element.scope().leaflet.markers;
            $rootScope.$digest();
            expect(leafletMarkers.paris._popup._source._latlng.message)
                .toEqual('this is paris');
        });
    });

    // Polyline
    it('should create polyline on the map', function() {
        inject(function($rootScope, $compile) {
            var latlngs1 = [
                { lat: 0.966, lng: 2.02 },
                { lat: 2.02, lng: 4.04 }
            ];
            var latlngs2 = [
                { lat: 0.466, lng: 1.02 },
                { lat: 1.02, lng: 3.04 }
            ];
            angular.extend($rootScope, { paths : { p1: { latlngs : latlngs1 }, p2: { latlngs : latlngs2 }}});
            var element = angular.element('<leaflet paths="paths" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            var polyline1 = element.scope().leaflet.paths.p1;
            var polyline2 = element.scope().leaflet.paths.p2;
            $rootScope.$digest();
            latlngs1 = polyline1.getLatLngs();
            expect(latlngs1[0].lat).toBeCloseTo(0.966);
            expect(latlngs1[0].lng).toBeCloseTo(2.02);
            expect(latlngs1[1].lat).toBeCloseTo(2.02);
            expect(latlngs1[1].lng).toBeCloseTo(4.04);

            latlngs2 = polyline2.getLatLngs();
            expect(latlngs2[0].lat).toBeCloseTo(0.466);
            expect(latlngs2[0].lng).toBeCloseTo(1.02);
            expect(latlngs2[1].lat).toBeCloseTo(1.02);
            expect(latlngs2[1].lng).toBeCloseTo(3.04);
        });
    });

    it('should call map method on leafletDirectiveSetMap event', function() {
        inject(function($rootScope, $compile) {
            var center = {
                lat: 0.966,
                lng: 2.02,
                zoom: 4
            };
            angular.extend($rootScope, { center: center });
            var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);

            var map = element.scope().leaflet.map,
                southWest = new L.LatLng(40.97989806962013, -74.53125),
                northEast = new L.LatLng(40.97989806962013, -74.53125),
                bounds = new L.LatLngBounds(southWest, northEast);

            expect(map.getBounds().equals(bounds)).toEqual(false);

            $rootScope.$broadcast('leafletDirectiveSetMap',
                ['fitBounds', bounds]);

            expect(map.getBounds().equals(bounds)).toEqual(true);
        });
    });
});
