'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile, $rootScope, leafletData, leafletHelpers, mainMarkers, mainLayers;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        leafletHelpers = _leafletHelpers_;
    }));

    beforeEach(function(){
        mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
        mainLayers = {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    type: 'xyz',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    layerOptions: {
                        subdomains: ['a', 'b', 'c'],
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        continuousWorld: true
                    }
                }
            },
            overlays: {
                cars: {
                    name: 'cars',
                    type: 'group',
                    visible: true
                },
                trucks: {
                    name: 'trucks',
                    type: 'group',
                    visible: false
                }
            }
        };
    });

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    // Marker
    it('should create main marker on the map', function() {
        var main_marker = {
            lat: 0.966,
            lng: 2.02
        };
        angular.extend($rootScope, {
            markers: {
                main_marker: main_marker
            }
        });

        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers) {
            var leafletMainMarker = leafletMarkers.main_marker;
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
        angular.extend($rootScope, {
            markers: {
                marker: marker
            }
        });
        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers) {
            var leafletMainMarker = leafletMarkers.marker;
            expect(leafletMainMarker._popup._content).toEqual('this is paris');
        });
    });
    
    it('message should be compiled if angular template is given', function() {
        var marker = {
            lat: 0.966,
            lng: 2.02,
            message: '<p>{{model.color}}</p>',
            focus: true
        };
        angular.extend($rootScope, {
            markers: {
                marker: marker
            }
        }, { 
            model: {
                color: 'blue'
            }
        });
        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var leafletMainMarker;
        leafletData.getMarkers().then(function(leafletMarkers) {
            leafletMainMarker = leafletMarkers.marker;
        });
        $rootScope.$digest();
        leafletMainMarker.openPopup();
        $rootScope.$digest();
        expect(leafletMainMarker._popup._contentNode.innerHTML).toEqual('<p class="ng-binding">blue</p>');
    });

    it('message should be compiled in specified scope', function() {
        
        var arbitraryIsolateScope = $rootScope.$new(true);
        angular.extend(arbitraryIsolateScope, { model: { color: 'angular'}});

        var marker = {
            lat: 0.966,
            lng: 2.02,
            getMessageScope: function() {return arbitraryIsolateScope;},
            message: '<p>{{model.color}}</p>',
            focus: true
        };

        angular.extend($rootScope, {
            markers: {
                marker: marker
            }
        });

        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var leafletMainMarker;
        leafletData.getMarkers().then(function(leafletMarkers) {
            leafletMainMarker = leafletMarkers.marker;
        });
        $rootScope.$digest();
        leafletMainMarker.openPopup();
        $rootScope.$digest();
        expect(leafletMainMarker._popup._contentNode.innerHTML).toEqual('<p class="ng-binding">angular</p>');
    });

    it('should bind label to main marker if message is given', function() {
        spyOn(leafletHelpers.LabelPlugin, 'isLoaded').and.returnValue(true);
        L.Label = L.Class.extend({
            includes: L.Mixin.Events,
        });

        L.BaseMarkerMethods = {
            bindLabel: function(content, options) {
                this.label = new L.Label(options, this);
                this.label._content = content;
                return this;
            },
            updateLabelContent: function(content) {
                this.label._content = content;
            }
        };

        L.Marker.include(L.BaseMarkerMethods);

        var marker = {
            lat: 0.966,
            lng: 2.02,
            message: 'this is paris',
            label: {
                message: 'original',
                options: {
                    clickable: true
                }
            }
        };

        angular.extend($rootScope, {
            markers: {
                marker: marker
            }
        });

        var element = angular.element('<leaflet markers="markers"></leaflet>');
        $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers){
            var leafletMainMarker = leafletMarkers.marker;
            expect(leafletMainMarker.label._content).toEqual('original');
        });

        marker.label.message = 'new';

        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers){
            var leafletMainMarker = leafletMarkers.marker;
            expect(leafletMainMarker.label._content).toEqual('new');
        });
    });

    // Markers
    it('should create markers on the map', function() {
        angular.extend($rootScope, { markers: mainMarkers });
        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers) {
            expect(leafletMarkers.paris.getLatLng().lat).toBeCloseTo(0.966);
            expect(leafletMarkers.paris.getLatLng().lng).toBeCloseTo(2.02);
            expect(leafletMarkers.madrid.getLatLng().lat).toBeCloseTo(2.02);
            expect(leafletMarkers.madrid.getLatLng().lng).toBeCloseTo(4.04);
        });
    });

    describe('when a marker is updated', function(){

        describe('detecting errors in lat-lng', function(){
            it('validates (undefined lat)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                map = leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });
                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                delete mainMarkers.madrid.lat;
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (null lat)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });
                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });

                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lat = null;
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validate (lat is NaN)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lat = "aak";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (lat not a number)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lat = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (undefined lng)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                delete mainMarkers.madrid.lng;
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (null lng)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lng = null;
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (lng is NaN)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lng = "kk";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (lng not a number)', function() {
                angular.extend($rootScope, { markers: mainMarkers });
                var element = angular.element('<leaflet markers="markers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lng = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
            });

            it('validates (lng not a number) for a marker in a layer group', function() {
                mainMarkers.paris.layer = 'cars';
                mainMarkers.madrid.layer = 'trucks';

                angular.extend($rootScope, { markers: mainMarkers, layers: mainLayers });
                var element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                var layers;
                leafletData.getLayers().then(function(leafletLayers) {
                    layers = leafletLayers;
                });
                $rootScope.$digest();
                var overlays = layers.overlays;
                expect(map.hasLayer(markers.madrid)).toBe(false); // Layer is hidden
                $rootScope.$digest();
                expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lng = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
                expect(overlays.trucks.hasLayer(markers.madrid)).toBe(false);
                $rootScope.$digest();
                expect(map.hasLayer(markers.paris)).toBe(true); // Layer is shown
                expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
                mainMarkers.paris.lat = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.paris)).toBe(false);
                expect(overlays.cars.hasLayer(markers.paris)).toBe(false);
            });

            it('validates (lng not a number) for a marker in a layer markercluster', function() {
                mainMarkers.paris.layer = 'cars';
                mainMarkers.madrid.layer = 'trucks';
                mainLayers.overlays.cars.type = 'markercluster';
                mainLayers.overlays.trucks.type = 'markercluster';

                angular.extend($rootScope, { markers: mainMarkers, layers: mainLayers });
                var element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
                element = $compile(element)($rootScope);
                var map;
                leafletData.getMap().then(function(leafletMap) {
                    map = leafletMap;
                });

                var markers;
                leafletData.getMarkers().then(function(leafletMarkers) {
                    markers = leafletMarkers;
                });
                $rootScope.$digest();
                var layers;
                leafletData.getLayers().then(function(leafletLayers) {
                    layers = leafletLayers;
                });
                $rootScope.$digest();
                var overlays = layers.overlays;
                expect(map.hasLayer(markers.madrid)).toBe(false); // Layer is markercluster
                expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
                mainMarkers.madrid.lng = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.madrid)).toBe(false);
                expect(overlays.trucks.hasLayer(markers.madrid)).toBe(false);
                $rootScope.$digest();
                expect(map.hasLayer(markers.paris)).toBe(false); // Layer is markercluster
                expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
                mainMarkers.paris.lat = "not a number :P";
                $rootScope.$digest();
                expect(map.hasLayer(markers.paris)).toBe(false);
                //expect(overlays.cars.hasLayer(markers.paris)).toBe(false);
            });
        });

        it('updates lat-lng', function() {
            angular.extend($rootScope, { markers: mainMarkers });
            var element = angular.element('<leaflet markers="markers"></leaflet>');
            element = $compile(element)($rootScope);
            var map;
            leafletData.getMap().then(function(leafletMap) {
                map = leafletMap;
            });

            var markers;
            leafletData.getMarkers().then(function(leafletMarkers) {
                markers = leafletMarkers;
            });
            $rootScope.$digest();
            var layers;
            leafletData.getLayers().then(function(leafletLayers) {
                layers = leafletLayers;
            });
            $rootScope.$digest();
            expect(markers.paris.getLatLng().lat).toBeCloseTo(0.966);
            expect(markers.paris.getLatLng().lng).toBeCloseTo(2.02);
            expect(markers.madrid.getLatLng().lat).toBeCloseTo(2.02);
            expect(markers.madrid.getLatLng().lng).toBeCloseTo(4.04);
            mainMarkers.madrid.lng = 1.23;
            mainMarkers.madrid.lat = 4.56;
            mainMarkers.paris.lng = 7.89;
            mainMarkers.paris.lat = 0.98;
            $rootScope.$digest();
            expect(markers.paris.getLatLng().lat).toBeCloseTo(0.98);
            expect(markers.paris.getLatLng().lng).toBeCloseTo(7.89);
            expect(markers.madrid.getLatLng().lat).toBeCloseTo(4.56);
            expect(markers.madrid.getLatLng().lng).toBeCloseTo(1.23);
        });

        it('updates lat-lng for marker in a layer markercluster', function() {
            // This case is tested because in a marker cluster the marker has to be removed from the layer
            mainMarkers.paris.layer = 'cars';
            mainMarkers.madrid.layer = 'trucks';
            mainLayers.overlays.cars.type = 'markercluster';
            mainLayers.overlays.trucks.type = 'markercluster';

            angular.extend($rootScope, { markers: mainMarkers, layers: mainLayers });
            var element = angular.element('<leaflet markers="markers" layers="layers"></leaflet>');
            element = $compile(element)($rootScope);
            var map;
            leafletData.getMap().then(function(leafletMap) {
                map = leafletMap;
            });
            var markers;
            leafletData.getMarkers().then(function(leafletMarkers) {
                markers = leafletMarkers;
            });
            var layers;
            leafletData.getLayers().then(function(leafletLayers) {
                layers = leafletLayers;
            });
            $rootScope.$digest();
            var overlays = layers.overlays;
            expect(map.hasLayer(markers.madrid)).toBe(false); // Layer is markercluster
            expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
            expect(map.hasLayer(markers.paris)).toBe(false); // Layer is markercluster
            expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
            expect(markers.paris.getLatLng().lat).toBeCloseTo(0.966);
            expect(markers.paris.getLatLng().lng).toBeCloseTo(2.02);
            expect(markers.madrid.getLatLng().lat).toBeCloseTo(2.02);
            expect(markers.madrid.getLatLng().lng).toBeCloseTo(4.04);
            mainMarkers.madrid.lng = 1.23;
            mainMarkers.madrid.lat = 4.56;
            mainMarkers.paris.lng = 7.89;
            mainMarkers.paris.lat = 0.98;
            $rootScope.$digest();
            expect(map.hasLayer(markers.madrid)).toBe(false);
            expect(overlays.trucks.hasLayer(markers.madrid)).toBe(true);
            expect(map.hasLayer(markers.paris)).toBe(false);
            expect(overlays.cars.hasLayer(markers.paris)).toBe(true);
            expect(markers.paris.getLatLng().lat).toBeCloseTo(0.98);
            expect(markers.paris.getLatLng().lng).toBeCloseTo(7.89);
            expect(markers.madrid.getLatLng().lat).toBeCloseTo(4.56);
            expect(markers.madrid.getLatLng().lng).toBeCloseTo(1.23);
        });
    });

    it('should bind popup to marker if message is given', function() {
        mainMarkers.paris.message = 'this is paris';

        angular.extend($rootScope, { markers: mainMarkers});
        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });

        var markers;
        leafletData.getMarkers().then(function(leafletMarkers) {
            markers = leafletMarkers;
        });
        $rootScope.$digest();
        expect(markers.paris._popup._content).toEqual('this is paris');
    });

    describe('setting markers watches', function(){
        var leafIcon, defaultIcon, mainMarkers, scope;
        var LEAF_URL = 'http://leafletjs.com/docs/images/leaf-green.png';
        var DEFAULT_URL = 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png';

        beforeEach(function(){
            leafIcon = {
                iconUrl: LEAF_URL,
                shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
                iconSize:     [38, 95],
                shadowSize:   [50, 64],
                iconAnchor:   [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor:  [-3, -76]
            };
            defaultIcon = {
                iconUrl: DEFAULT_URL,
                shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 40],
                popupAnchor: [0, 40],
                shadowSize: [41, 41],
                shadowAnchor: [12, 40]
            };

            mainMarkers = {
                m1: {
                    lat: 123,
                    lng: 456,
                    icon: leafIcon
                }
            };

            scope = $rootScope.$new();
            scope.markers = mainMarkers;
        });

        it('watches marker icon bindings', function() {
            var element = angular.element('<leaflet markers="markers" watchMarkers="true"></leaflet>');
            element = $compile(element)(scope);
            var markers;
            leafletData.getMarkers().then(function(leafletMarkers) {
                markers = leafletMarkers;
            });

            scope.$digest();
            var icon = markers.m1.options.icon;
            expect(icon.options.iconUrl).toEqual(LEAF_URL);

            mainMarkers.m1.icon = defaultIcon;
            scope.$apply();
            expect(markers.m1.options.icon.options.iconUrl).toEqual(DEFAULT_URL);
        });

        it('does not watch on markers when watch is disabled', function(){
            var element = angular.element('<leaflet markers="markers" watch-markers="false"></leaflet>');
            element = $compile(element)(scope);
            var markers;
            leafletData.getMarkers().then(function(leafletMarkers) {
                markers = leafletMarkers;
            });

            scope.$digest();
            expect(markers.m1.options.icon.options.iconUrl).toEqual(LEAF_URL);

            mainMarkers.m1.icon = defaultIcon;
            scope.$apply();
            // should not change
            expect(markers.m1.options.icon.options.iconUrl).toEqual(LEAF_URL);
        });

    });
});
