'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe("Directive: leaflet: layers.watch.markers", function () {
    var $compile, $rootScope, leafletData, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function (_$compile_, _$rootScope_, _leafletData_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        scope = $rootScope.$new();
    }));

    afterEach(inject(function ($rootScope) {
        $rootScope.$apply();
    }));


    it('should add and remove layers in watch', function () {
        // If we not provide layers the system will use the default
        angular.extend(scope, {
            layers: {
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
                    },
                    cycle: {
                        name: 'OpenCycleMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                        top: true,
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();

        expect(Object.keys(layers.baselayers).length).toEqual(2);
        delete scope.layers.baselayers.cycle;
        scope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(1);
        expect(typeof layers.baselayers.osm).toBe('object');
        expect(layers.baselayers.cycle).toBe(undefined);
        scope.layers.baselayers.cloudmade1 = {
            name: 'Cloudmade Night Commander',
            type: 'xyz',
            url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
            layerParams: {
                key: '007b9471b4c74da4a6ec7ff43552b16f',
                styleId: 999
            },
            layerOptions: {
                subdomains: ['a', 'b', 'c'],
                continuousWorld: true
            }
        };
        scope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        expect(typeof layers.baselayers.osm).toBe('object');
        expect(typeof layers.baselayers.cloudmade1).toBe('object');
        delete scope.layers.baselayers.osm;
        delete scope.layers.baselayers.cloudmade1;
        scope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(0);
    });

    it('should add and remove overlays in watch', function () {
        // Create correct overlays
        angular.extend(scope, {
            layers: {
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
                    hillshade: {
                        name: 'Hillshade Europa',
                        type: 'wms',
                        url: 'http://129.206.228.72/cached/hillshade',
                        visible: true,
                        layerOptions: {
                            layers: 'europe_wms:hs_srtm_europa',
                            format: 'image/png',
                            opacity: 0.25,
                            attribution: 'Hillshade layer by GIScience http://www.osm-wms.de',
                            crs: L.CRS.EPSG900913
                        }
                    },
                    fire: {
                        name: 'OpenFireMap',
                        type: 'xyz',
                        url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
                        layerOptions: {
                            attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });

        scope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(2);
        delete scope.layers.overlays.fire;

        scope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(1);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(layers.overlays.fire).toBe(undefined);

        // Added a bad layer
        scope.layers.overlays.fire = {
            name: 'OpenFireMap',
            badtype: 'xyz',
            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
            layerOptions: {
                attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true
            }
        };
        scope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(1);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(layers.overlays.fire).toBe(undefined);

        // Added a good layer
        scope.layers.overlays.fire = {
            name: 'OpenFireMap',
            type: 'xyz',
            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
            layerOptions: {
                attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true
            }
        };
        scope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(2);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(typeof layers.overlays.fire).toBe('object');
    });

    it('should add and remove markers in overlays in watch 1', function () {
        // Check for a marker remove in a layer group
        angular.extend(scope, {
            layers: {
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
            },
            markers: {
                m1: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'cars'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);

        // remove marker information
        scope.markers.m1 = {};
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);

        scope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'cars'
        };
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true); //Fail
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);

        // null the marker information
        scope.markers.m1 = null;
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // delete the marker
        delete scope.markers.m1;
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // delete the marker layer
        scope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'cars'
        };
        scope.$digest();
        scope.markers.m1 = {
            lat: 1.2,
            lng: 0.3
        };
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(false);
        // Then add to a not visible layer
        scope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'trucks'
        };
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(true);
    });

    it('should add and remove markers in overlays in watch 2', function () {
        // Check for a marker remove in a layer group
        angular.extend(scope, {
            layers: {
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
            },
            markers: {
                m1: {
                    lat: 2.2,
                    lng: 0.3,
                    layer: 'cars'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(false);
        // Change layer
        scope.markers.m1 = {
            lat: 3.2,
            lng: 0.3,
            layer: 'trucks'
        };
        scope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(true);
    });

    // MarkerCluster Layer Plugin
    it('should create a markercluster overlay as specified', function () {
        // Provide a markercluster layer
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                    }
                },
                overlays: {
                    cars: {
                        name: 'Cars',
                        type: 'markercluster'
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();

        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(false);
    });

    // MarkerCluster Layer Plugin
    it('should create a visible markercluster overlay as specified', function () {
        // Provide a visible markercluster layer
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                    }
                },
                overlays: {
                    cars: {
                        name: 'Cars',
                        type: 'markercluster',
                        visible: true
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();

        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
    });

    it('should create a visible markercluster layer with options empty', function () {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                    }
                },
                overlays: {
                    cars: {
                        name: 'Cars',
                        type: 'markercluster',
                        visible: true,
                        layerOptions: {}
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(true);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        //expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
    });

    it('should create a visible markercluster layer with options', function () {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                    }
                },
                overlays: {
                    cars: {
                        name: 'Cars',
                        type: 'markercluster',
                        visible: true,
                        layerOptions: {
                            showCoverageOnHover: false,
                            disableClusteringAtZoom: 18
                        }
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();
        scope.$digest();
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(false);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        //expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
        expect(layers.overlays.cars.options.disableClusteringAtZoom).toEqual(18);
    });

    it('should create a visible markercluster layer with options and layers', function () {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                    }
                },
                overlays: {
                    cars: {
                        name: 'Cars',
                        type: 'markercluster',
                        visible: true,
                        layerOptions: {
                            showCoverageOnHover: false,
                            disableClusteringAtZoom: 18
                        }
                    }
                }
            },
            markers: {
                m1: {
                    layer: 'cars',
                    lat: 1.0,
                    lng: 1.0
                },
                m2: {
                    layer: 'cars',
                    lat: 1.0,
                    lng: 1.0
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        var markers;
        leafletData.getMarkers().then(function (leafletMarkers) {
            markers = leafletMarkers;
        });
        var layers;
        leafletData.getLayers().then(function (leafletLayers) {
            layers = leafletLayers;
        });
        scope.$digest();
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(false);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        //expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
        expect(layers.overlays.cars.options.disableClusteringAtZoom).toEqual(18);
        // The layer has the two markers
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m2)).toBe(true);
    });

});
