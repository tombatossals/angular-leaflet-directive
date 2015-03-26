'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe("Directive: leaflet: layers.overlays", function () {
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


    it('should create overlays as specified', function () {
        // As overlays are optional, if we create a valid baselayer must create an empty overlay object
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
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getLayers().then(function (layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(0);
        });
    });

    // Also when creating an empty overlay
    it('should create and empty overlay', function () {
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
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getLayers().then(function (layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(0);
        });
    });

    it('should create one correct and one incorrect overlay', function () {
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
                        badname: 'OpenFireMap',
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
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        scope.$digest();
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getLayers().then(function (layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(1);
            // As the visible is true it should be on the map
            expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
        });
    });

    it('should create correct overlays', function () {
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
        var map;
        leafletData.getMap().then(function (leafletMap) {
            map = leafletMap;
        });
        scope.$digest();

        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getLayers().then(function (layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(2);
            // As the visible is true it should be on the map
            expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
        });
    });
    describe('groups', function () {
        it('should check for layer group', function () {
            // Check for layer group
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
                            visible: false
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
            scope.$digest();

            leafletData.getLayers().then(function (layers) {
                expect(layers.overlays).not.toBe(null);
                expect(typeof layers.overlays).toBe('object');
                expect(Object.keys(layers.overlays).length).toEqual(1);
                expect(layers.overlays.cars instanceof L.LayerGroup).toBe(true);
                // As the visible is false it should not be on the map
                expect(map.hasLayer(layers.overlays.hillshade)).toBe(false);
            });
        });

        it('should check for feature group', function () {
            // Check for layer group
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
                            type: 'featureGroup',
                            visible: false
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
            scope.$digest();

            leafletData.getLayers().then(function (layers) {
                expect(layers.overlays).not.toBe(null);
                expect(typeof layers.overlays).toBe('object');
                expect(Object.keys(layers.overlays).length).toEqual(1);
                expect(layers.overlays.cars instanceof L.FeatureGroup).toBe(true);
                // As the visible is false it should not be on the map
                expect(map.hasLayer(layers.overlays.hillshade)).toBe(false);
            });
        });

        it('should check for a marker in the layer group that is not visible', function () {
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

            scope.$digest();

            leafletData.getLayers().then(function (layers) {
                expect(Object.keys(markers).length).toEqual(1);
                expect(markers.m1 instanceof L.Marker).toBe(true);
                expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
                expect(map.hasLayer(markers.m1)).toBe(false);
            });
        });
    });
});
