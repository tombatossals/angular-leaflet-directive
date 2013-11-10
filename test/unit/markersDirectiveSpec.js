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

    // Markers
    it('should create markers on the map', function() {
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

    it('should detect errors in lat-lng (undefined lat) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (null lat) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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
        mainMarkers.madrid.lat = null;
        $rootScope.$digest();
        expect(map.hasLayer(markers.madrid)).toBe(false);
    });

    it('should detect errors in lat-lng (lat is NaN) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (lat not a number) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (undefined lng) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (null lng) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (lng is NaN) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (lng not a number) when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should detect errors in lat-lng (lng not a number) when marker is updated in a layer group', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02,
                layer: 'cars'
            },
            madrid: {
                lat: 2.02,
                lng: 4.04,
                layer: 'trucks'
            }
        };
        var mainLayers = {
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

    it('should detect errors in lat-lng (lng not a number) when marker is updated in a layer markercluster', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02,
                layer: 'cars'
            },
            madrid: {
                lat: 2.02,
                lng: 4.04,
                layer: 'trucks'
            }
        };
        var mainLayers = {
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
                    type: 'markercluster',
                    visible: true
                },
                trucks: {
                    name: 'trucks',
                    type: 'markercluster',
                    visible: false
                }
            }
        };
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
        expect(overlays.cars.hasLayer(markers.paris)).toBe(false);
    });

    it('should update lat-lng when marker is updated', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02
            },
            madrid: {
                lat: 2.02,
                lng: 4.04
            }
        };
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

    it('should update lat-lng when marker is updated in a layer markercluster', function() {
        // This case is tested because in a marker cluster the marker has to be removed from the layer
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02,
                layer: 'cars'
            },
            madrid: {
                lat: 2.02,
                lng: 4.04,
                layer: 'trucks'
            }
        };
        var mainLayers = {
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
                    type: 'markercluster',
                    visible: true
                },
                trucks: {
                    name: 'trucks',
                    type: 'markercluster',
                    visible: false
                }
            }
        };
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

    it('should bind popup to marker if message is given', function() {
        var mainMarkers = {
            paris: {
                lat: 0.966,
                lng: 2.02,
                message: 'this is paris'
            }
        };
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

    it('should watch marker icon bindings', function() {
        var leaf_icon = L.icon({
            iconUrl: 'http://leafletjs.com/docs/images/leaf-green.png',
            shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        });
        var default_icon = L.icon({
            iconUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png',
            shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 40],
            popupAnchor: [0, 40],
            shadowSize: [41, 41],
            shadowAnchor: [12, 40]
        });
        var mainMarkers = {
            m1: {
                lat: 51.505,
                lng: -0.09,
                message: "I'm a static marker",
                icon: leaf_icon,
            },
        };

        angular.extend($rootScope, { markers: mainMarkers });
        var element = angular.element('<leaflet markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        var markers;
        leafletData.getMarkers().then(function(leafletMarkers) {
            markers = leafletMarkers;
        });
        $rootScope.$digest();
        expect(markers.m1.options.icon.iconUrl).toEqual(leaf_icon.iconUrl);
        markers.m1.icon = default_icon;
        $rootScope.$digest();
        expect(markers.m1.options.icon.iconUrl).toEqual(default_icon.iconUrl);
    });
});
