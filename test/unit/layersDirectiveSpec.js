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

    // Layers
    it('should not create layers if not specified', function() {
        angular.extend($rootScope, {
            layers: {}
        });
        // If we not provide layers the system will use the default
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getLayers().then(function() {
            expect(layers).toBe(undefined);
        });
    });

    it('should not create layers if they are miss-configured', function() {
        angular.extend($rootScope, {
            layers: {
                baselayers: {},
                overlays: {}
            }
        });

        // If we not provide layers the system will use the default
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getLayers().then(function() {
            expect(layers).toBe(undefined);
        });
    });

    it('should create layers if baselayers is defined with data', function() {
        angular.extend($rootScope, {
            layers: {
                baselayers: {
                    m1: {}
                },
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getLayers().then(function(layers) {
            expect(layers).not.toBe(undefined);
            expect(layers.baselayers).toEqual({});
        });
    });

    it('should create one layer if correctly configured', function() {
        angular.extend($rootScope, {
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
                    m1: {}
                },
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        leafletData.getLayers().then(function(layers) {
            expect(map.hasLayer(layers.baselayers.osm)).toBe(true);
        });
    });

    it('should create image overlay layer if correctly configured', function() {
        angular.extend($rootScope, {
            layers: {
                baselayers: {
                    imageOverlay: {
                        name: 'imageOverlay',
                        type: 'imageOverlay',
                        url: 'url',
                        bounds: [[0,1], [1,0]],
                        layerOptions: {
                        }
                    },
                },
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        leafletData.getLayers().then(function(layers) {
            expect(map.hasLayer(layers.baselayers.imageOverlay)).toBe(true);
        });
    });

    it('should create two layers if correctly configured', function() {
        angular.extend($rootScope, {
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
                    },
                },
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(layers.baselayers).length).toEqual(2);
            expect(map.hasLayer(layers.baselayers.cycle)).toBe(true);
            expect(map.hasLayer(layers.baselayers.osm)).toBe(false);
        });
    });

    it('should create two different type layers if correctly configured', function() {
        angular.extend($rootScope, {
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
                    osmwms: {
                        name: 'OpenStreetMap WMS Omniscale',
                        type: 'wms',
                        url: 'http://osm.omniscale.net/proxy/service',
                        layerOptions: {
                            layers: 'osm',
                            format: 'image/png'
                        }
                    },
                },
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(layers.baselayers).length).toEqual(2);
        });
    });

    it('should refuse to create malformed layers', function() {
        angular.extend($rootScope, {
            layers: {
                baselayers: {
                    osm: {
                        badname: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osm2: {
                        name: null,
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osm3: {
                        name: 'OpenStreetMap',
                        badtype: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osm4: {
                        name: 'OpenStreetMap',
                        type: null,
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osm5: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        badurl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osm6: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: null,
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    osmwms: {
                        type: 'wms',
                        url: 'http://osm.omniscale.net/proxy/service',
                        layerOptions: {
                            layers: 'osm',
                            format: 'image/png'
                        }
                    },
                    imageOverlay1: {
                        name: 'imageOverlay',
                        type: 'imageOverlay',
                        bounds: [[0,1], [1,0]],
                        layerOptions: {
                        }
                    },
                    imageOverlay2: {
                        name: 'imageOverlay',
                        type: 'imageOverlay',
                        url: 'url',
                        layerOptions: {
                        }
                    },
                },
                overlays: {}
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(layers.baselayers).length).toEqual(0);
        });
    });

    it('should add and remove layers in watch', function() {
        // If we not provide layers the system will use the default
        angular.extend($rootScope, {
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
                    },
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        var layers;
        leafletData.getLayers().then(function(leafletLayers) {
            layers = leafletLayers;
        });
        $rootScope.$digest();

        expect(Object.keys(layers.baselayers).length).toEqual(2);
        delete $rootScope.layers.baselayers.cycle;
        $rootScope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(1);
        expect(typeof layers.baselayers.osm).toBe('object');
        expect(layers.baselayers.cycle).toBe(undefined);
        $rootScope.layers.baselayers.cloudmade1 = {
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
        $rootScope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        expect(typeof layers.baselayers.osm).toBe('object');
        expect(typeof layers.baselayers.cloudmade1).toBe('object');
        delete $rootScope.layers.baselayers.osm;
        delete $rootScope.layers.baselayers.cloudmade1;
        $rootScope.$digest();
        expect(Object.keys(layers.baselayers).length).toEqual(0);
    });

    // Layers
    it('should create overlays as specified', function() {
        // As overlays are optional, if we create a valid baselayer must create an empty overlay object
        angular.extend($rootScope, {
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
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(0);
        });
    });

    // Also when creating an empty overlay
    it('should create and empty overlay', function() {
        angular.extend($rootScope, {
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
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(0);
        });
    });

    it('should create one correct and one incorrect overlay', function() {
        angular.extend($rootScope, {
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
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers ) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(1);
            // As the visible is true it should be on the map
            expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
        });
    });

    it('should create correct overlays', function() {
        angular.extend($rootScope, {
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
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();

        var element = angular.element('<leaflet layers="layers"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getLayers().then(function(layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(2);
            // As the visible is true it should be on the map
            expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
        });
    });

    it('should check for layer group', function() {
        // Check for layer group
        angular.extend($rootScope, {
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
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();

        leafletData.getLayers().then(function(layers) {
            expect(layers.overlays).not.toBe(null);
            expect(typeof layers.overlays).toBe('object');
            expect(Object.keys(layers.overlays).length).toEqual(1);
            expect(layers.overlays.cars instanceof L.LayerGroup).toBe(true);
            // As the visible is false it should not be on the map
            expect(map.hasLayer(layers.overlays.hillshade)).toBe(false);
        });
    });

    it('should check for a marker in the layer group that is not visible', function() {
        angular.extend($rootScope, {
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

        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(markers).length).toEqual(1);
            expect(markers.m1 instanceof L.Marker).toBe(true);
            expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
            expect(map.hasLayer(markers.m1)).toBe(false);
        });
    });

    it('should check for a marker in the layer group that is visible', function() {
        angular.extend($rootScope, {
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

        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(markers).length).toEqual(1);
            expect(markers.m1 instanceof L.Marker).toBe(true);
            expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
            expect(map.hasLayer(markers.m1)).toBe(true);
        });
    });

    it('should check for a marker in a wrong layer group', function() {
        angular.extend($rootScope, {
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
                    }
                }
            },
            markers: {
                m1: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'bikes'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        leafletData.getMarkers().then(function(markers) {
            expect(Object.keys(markers).length).toEqual(0);
        });
    });

    it('should check for a marker the old way', function() {
        angular.extend($rootScope, {
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
                    }
                }
            },
            markers: {
                m1: {
                    lat: 1.2,
                    lng: 0.3
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        $rootScope.$digest();
        leafletData.getMarkers().then(function(markers) {
            expect(Object.keys(markers).length).toEqual(1);
            expect(map.hasLayer(markers.m1)).toBe(true);
        });
    });

    it('should add and remove overlays in watch', function() {
        // Create correct overlays
        angular.extend($rootScope, {
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
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var layers;
        leafletData.getLayers().then(function(leafletLayers) {
            layers = leafletLayers;
        });

        $rootScope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(2);
        delete $rootScope.layers.overlays.fire;

        $rootScope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(1);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(layers.overlays.fire).toBe(undefined);

        // Added a bad layer
        $rootScope.layers.overlays.fire = {
            name: 'OpenFireMap',
            badtype: 'xyz',
            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
            layerOptions: {
                attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true
            }
        };
        $rootScope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(1);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(layers.overlays.fire).toBe(undefined);

        // Added a good layer
        $rootScope.layers.overlays.fire = {
            name: 'OpenFireMap',
            type: 'xyz',
            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
            layerOptions: {
                attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                continuousWorld: true
            }
        };
        $rootScope.$digest();
        expect(Object.keys(layers.overlays).length).toEqual(2);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(typeof layers.overlays.fire).toBe('object');
    });

    it('should add and remove markers in overlays in watch', function() {
        // Check for a marker remove in a layer group
        angular.extend($rootScope, {
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
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);

        // remove marker information
        $rootScope.markers.m1 = {};
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);

        // null the marker information
        $rootScope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'cars'
        };
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        $rootScope.markers.m1 = null;
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // delete the marker
        delete $rootScope.markers.m1;
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // delete the marker layer
        $rootScope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'cars'
        };
        $rootScope.$digest();
        $rootScope.markers.m1 = {
            lat: 1.2,
            lng: 0.3
        };
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(false);
        // Then add to a not visivle layer
        $rootScope.markers.m1 = {
            lat: 1.2,
            lng: 0.3,
            layer: 'trucks'
        };
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(true);
        // Check for a marker remove in a layer group
        angular.extend($rootScope, {
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
        element = angular.element('<leaflet layers="layers" markers="markers"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(false);
        // Change layer
        $rootScope.markers.m1 = {
            lat: 3.2,
            lng: 0.3,
            layer: 'trucks'
        };
        $rootScope.$digest();
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(true);
    });

    // MarkerCluster Layer Plugin
    it('should create a markercluster overlay as specified', function() {
        // Provide a markercluster layer
        angular.extend($rootScope, {
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

        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(false);
    });

    // MarkerCluster Layer Plugin
    it('should create a visible markercluster overlay as specified', function() {
        // Provide a visible markercluster layer
        angular.extend($rootScope, {
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

        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
    });

    it('should create a visible markercluster layer with options empty', function() {
        angular.extend($rootScope, {
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
                        layerOptions: { }
                    }
                }
            }
        });
        var element = angular.element('<leaflet layers="layers"></leaflet>');
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

    it('should create a visible markercluster layer with options', function() {
        angular.extend($rootScope, {
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
        $rootScope.$digest();
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

    it('should create a visible markercluster layer with options and layers', function() {
        angular.extend($rootScope, {
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
