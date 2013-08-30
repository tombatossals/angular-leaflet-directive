'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile, $rootScope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should have loaded leaflet library inside the directive', function() {
        var element = angular.element('<leaflet></leaflet>');
        element = $compile(element)($rootScope);
        expect(element.text()).toEqual('+-Leaflet | © OpenStreetMap contributors');
    });

    it('should set the max zoom if specified', function() {
        angular.extend($rootScope, { defaults: { maxZoom: 15 } });
        var element = angular.element('<leaflet defaults="defaults" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().leaflet.map;
        expect(map.getMaxZoom()).toEqual(15);
    });

    it('should set the min zoom if specified', function() {
        inject(function($rootScope, $compile) {
            angular.extend($rootScope, { defaults: { minZoom: 4 } });
            var element = angular.element('<leaflet defaults="defaults" testing="testing"></leaflet>');
            element = $compile(element)($rootScope);
            var map = element.scope().leaflet.map;
            expect(map.getMinZoom()).toEqual(4);
        });
    });

    it('should set tileLayer options if specified', function() {
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

    it('should have default {[0, 0], 10} parameters on the map if not specified', function() {
        angular.extend($rootScope, {});
        var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().leaflet.map;
        expect(map.getZoom()).toEqual(10);
        expect(map.getCenter().lat).toEqual(0);
        expect(map.getCenter().lng).toEqual(0);
    });

    it('should update the map center if the initial center scope properties are set', function() {
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

    it('should update the map center if the scope center properties changes', function() {
        var center = {
            lat: 0.966,
            lng: 2.02,
            zoom: 4
        };
        angular.extend($rootScope, { center: center });
        var element = angular.element('<leaflet center="center" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var map = element.scope().leaflet.map;
        expect(map.getCenter().lat).toBeCloseTo(0.966);
        expect(map.getCenter().lng).toBeCloseTo(2.02);
        expect(map.getZoom()).toEqual(4);
        center.lat = 2.02;
        center.lng = 4.04;
        center.zoom = 8;
        $rootScope.$digest();
        map = element.scope().leaflet.map;
        expect(map.getCenter().lat).toBeCloseTo(2.02);
        expect(map.getCenter().lng).toBeCloseTo(4.04);
        expect(map.getZoom()).toEqual(8);
    });

    // Layers
    it('should create layers as specified', function() {
        // If we not provide layers the system will use the default
        var element = angular.element('<leaflet testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var layers = element.scope().leaflet.layers;
        expect(layers).toBe(null);
        angular.extend($rootScope, {
            layers: {}
        });
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers).toBe(null);
        angular.extend($rootScope, {
            layers: {
                baselayers: {},
                overlays: {}
            }
        });
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers).toBe(null);
        angular.extend($rootScope, {
            layers: {
                baselayers: {
                    m1: {}
                },
                overlays: {}
            }
        });
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers).not.toBe(null);
        expect(layers.baselayers).not.toBe(null);
        expect(layers.controls).not.toBe(null);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(1);
        var map = element.scope().leaflet.map;
        expect(map.hasLayer(layers.baselayers.osm)).toBe(true);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        map = element.scope().leaflet.map;
        expect(map.hasLayer(layers.baselayers.cycle)).toBe(true);
        expect(map.hasLayer(layers.baselayers.osm)).toBe(false);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        // create malformed layers
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
                },
                overlays: {}
            }
        });
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(0);
    });

    it('should add and remove layers in whatch', function() {
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
        var element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        var elementTest = $compile(element)($rootScope);
        var layers = elementTest.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        delete $rootScope.layers.baselayers.cycle;
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
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
        layers = elementTest.scope().leaflet.layers;
        expect(Object.keys(layers.baselayers).length).toEqual(2);
        expect(typeof layers.baselayers.osm).toBe('object');
        expect(typeof layers.baselayers.cloudmade1).toBe('object');
        delete $rootScope.layers.baselayers.osm;
        delete $rootScope.layers.baselayers.cloudmade1;
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
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
        var element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var layers = element.scope().leaflet.layers;
        expect(layers.overlays).not.toBe(null);
        expect(typeof layers.overlays).toBe('object');
        expect(Object.keys(layers.overlays).length).toEqual(0);
        // Also when creating an empty overlay
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers.overlays).not.toBe(null);
        expect(typeof layers.overlays).toBe('object');
        expect(Object.keys(layers.overlays).length).toEqual(0);
        // Create one correct overlay and one incorrect
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers.overlays).not.toBe(null);
        expect(typeof layers.overlays).toBe('object');
        expect(Object.keys(layers.overlays).length).toEqual(1);
        // As the visible is true it should be on the map
        var map = element.scope().leaflet.map;
        expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers.overlays).not.toBe(null);
        expect(typeof layers.overlays).toBe('object');
        expect(Object.keys(layers.overlays).length).toEqual(2);
        // As the visible is true it should be on the map
        map = element.scope().leaflet.map;
        expect(map.hasLayer(layers.overlays.hillshade)).toBe(true);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        expect(layers.overlays).not.toBe(null);
        expect(typeof layers.overlays).toBe('object');
        expect(Object.keys(layers.overlays).length).toEqual(1);
        expect(layers.overlays.cars instanceof L.LayerGroup).toBe(true);
        // As the visible is false it should not be on the map
        map = element.scope().leaflet.map;
        expect(map.hasLayer(layers.overlays.hillshade)).toBe(false);
        // Check for a marker in the layer group that is not visible
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        var markers = element.scope().leaflet.markers;
        map = element.scope().leaflet.map;
        expect(Object.keys(markers).length).toEqual(1);
        expect(markers.m1 instanceof L.Marker).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(map.hasLayer(markers.m1)).toBe(false);
        // Check for a marker in the layer group that is visible
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        layers = element.scope().leaflet.layers;
        markers = element.scope().leaflet.markers;
        map = element.scope().leaflet.map;
        expect(Object.keys(markers).length).toEqual(1);
        expect(markers.m1 instanceof L.Marker).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(map.hasLayer(markers.m1)).toBe(true);
        // Check for a marker in a wrong layer group
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        markers = element.scope().leaflet.markers;
        expect(Object.keys(markers).length).toEqual(0);
        // Check for a marker the old way
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        markers = element.scope().leaflet.markers;
        expect(Object.keys(markers).length).toEqual(1);
        map = element.scope().leaflet.map;
        expect(map.hasLayer(markers.m1)).toBe(true);
    });

    it('should add and remove overlays in whatch', function() {
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
        var element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        var elementTest = $compile(element)($rootScope);
        var layers = elementTest.scope().leaflet.layers;
        expect(Object.keys(layers.overlays).length).toEqual(2);
        delete $rootScope.layers.overlays.fire;
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
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
        layers = elementTest.scope().leaflet.layers;
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
        layers = elementTest.scope().leaflet.layers;
        expect(Object.keys(layers.overlays).length).toEqual(2);
        expect(typeof layers.overlays.hillshade).toBe('object');
        expect(typeof layers.overlays.fire).toBe('object');
    });

    it('should add and remove markers in overlays in whatch', function() {
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
        var element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        var elementTest = $compile(element)($rootScope);
        var layers = elementTest.scope().leaflet.layers;
        var map = elementTest.scope().leaflet.map;
        var markers = elementTest.scope().leaflet.markers;
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        // remove marker information
        $rootScope.markers.m1 = {};
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // null the marker information
        $rootScope.markers.m1 = {
                lat: 1.2,
                lng: 0.3,
                layer: 'cars'
        };
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
        expect(map.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        $rootScope.markers.m1 = null;
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        // delete the marker
        delete $rootScope.markers.m1;
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
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
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
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
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        elementTest = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
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
        layers = elementTest.scope().leaflet.layers;
        map = elementTest.scope().leaflet.map;
        markers = elementTest.scope().leaflet.markers;
        expect(map.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(false);
        expect(layers.overlays.trucks.hasLayer(markers.m1)).toBe(true);
    });

    // MarkerCluster Layer Plugin
    it('should create a markercluster overlay as specified', function() {
        // If we not provide layers the system will use the default
        var element = angular.element('<leaflet testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var layers = element.scope().leaflet.layers;
        expect(layers).toBe(null);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = element.scope().leaflet.layers;
        var map = element.scope().leaflet.map;
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(false);
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = element.scope().leaflet.layers;
        map = element.scope().leaflet.map;
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // Provide a visible markercluster layer with options empty
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
                            
                        }
                    }
                }
            }
        });
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = element.scope().leaflet.layers;
        map = element.scope().leaflet.map;
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(true);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
        // Provide a visible markercluster layer with options
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
        element = angular.element('<leaflet layers="layers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = element.scope().leaflet.layers;
        map = element.scope().leaflet.map;
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(false);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
        expect(layers.overlays.cars.options.disableClusteringAtZoom).toEqual(18);
        // Provide a visible markercluster layer with options and markers
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
        element = angular.element('<leaflet layers="layers" markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        layers = element.scope().leaflet.layers;
        map = element.scope().leaflet.map;
        // The layer is correctly created
        expect(layers.overlays.cars instanceof L.MarkerClusterGroup).toBe(true);
        // It is not on the map as it is not visible
        expect(map.hasLayer(layers.overlays.cars)).toBe(true);
        // The layer has to have the defaults
        expect(layers.overlays.cars.options.showCoverageOnHover).toBe(false);
        expect(layers.overlays.cars.options.zoomToBoundsOnClick).toBe(true);
        expect(layers.overlays.cars.options.spiderfyOnMaxZoom).toBe(true);
        expect(layers.overlays.cars.options.removeOutsideVisibleBounds).toBe(true);
        expect(layers.overlays.cars.options.disableClusteringAtZoom).toEqual(18);
        // The layer has the two markers
        var markers = element.scope().leaflet.markers;
        expect(layers.overlays.cars.hasLayer(markers.m1)).toBe(true);
        expect(layers.overlays.cars.hasLayer(markers.m2)).toBe(true);
    });

    // Marker
    it('should create main marker on the map', function() {
        var main_marker = {
            lat: 0.966,
            lng: 2.02
        };
        angular.extend($rootScope, { marker: main_marker });
        var element = angular.element('<leaflet marker="marker" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().leaflet.map;
        var leafletMainMarker = element.scope().leaflet.marker;
        $rootScope.$digest();
        expect(leafletMainMarker.getLatLng().lat).toBeCloseTo(0.966);
        expect(leafletMainMarker.getLatLng().lng).toBeCloseTo(2.02);
    });

    it('should bind popup to main marker if message is given', function() {
        var marker = {
            lat: 0.966,
            lng: 2.02,
            message: 'this is paris'
        };
        angular.extend($rootScope, { marker: marker});
        var element = angular.element('<leaflet marker="marker" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().map;
        var leafletMainMarker = element.scope().leaflet.marker;
        $rootScope.$digest();
        expect(leafletMainMarker._popup._content)
            .toEqual('this is paris');
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

    it('should bind popup to marker if message is given', function() {
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
        expect(leafletMarkers.paris._popup._content)
            .toEqual('this is paris');
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
        var markers = {
            m1: {
                lat: 51.505,
                lng: -0.09,
                message: "I'm a static marker",
                icon: leaf_icon,
            },
        };

        angular.extend($rootScope, { markers: markers });
        var element = angular.element('<leaflet markers="markers" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var leafletMarkers = element.scope().leaflet.markers;
        $rootScope.$digest();
        expect(leafletMarkers.m1.options.icon.iconUrl).toEqual(leaf_icon.iconUrl);

        markers.m1.icon = default_icon;
        $rootScope.$digest();
        expect(leafletMarkers.m1.options.icon.iconUrl).toEqual(default_icon.iconUrl);
    });

    it('should not trigger move event if marker position is not changed', function() {
        var main_marker = {
            lat: 0.966,
            lng: 2.02
        };
        angular.extend($rootScope, { marker: main_marker });
        var element = angular.element('<leaflet marker="marker" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().leaflet.map;
        var leafletMainMarker = element.scope().leaflet.marker;
        $rootScope.$digest();
        main_marker.lat = 0;
        leafletMainMarker.on('move', function() {
            expect('this should not happend!').toEqual('it happended');
        });
        leafletMainMarker.fire('dragend');
    });

    it('should set zoom control button properly if zoomControlPosition option is set', function() {
        angular.extend($rootScope, { defaults: { zoomControlPosition: 'topright' } });
        var element = angular.element('<leaflet defaults="defaults" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var map = element.scope().leaflet.map;
        expect(map.zoomControl.getPosition()).toEqual('topright');
    });

    // Polyline
    it('should create polyline on the map', function() {
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

    it('should call map method on leafletDirectiveSetMap event', function() {
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

    it('should broadcast events from the rootscope when triggered leaflet events',function(){
        var element = angular.element('<leaflet events="events" testing="testing"></leaflet>');
        element = $compile(element)($rootScope);
        var scope = element.scope();
        var map = scope.leaflet.map;

        var check = {};
        var mapEvents = [
            'click',
            //'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'mousemove',
            'contextmenu',
            'focus',
            'blur',
            'preclick',
            'load',
            'unload',
            'viewreset',
            'movestart',
            'move',
            //'moveend',
            'dragstart',
            'drag',
            'dragend',
            'zoomstart',
            'zoomend',
            'zoomlevelschange',
            'resize',
            'autopanstart',
            //'layeradd',
            //'layerremove',
            'baselayerchange',
            'overlayadd',
            'overlayremove',
            'locationfound',
            'locationerror',
            'popupopen',
            'popupclose'
            ];

    function setEventTrue(position) {
        check[mapEvents[position]] = true;
    }

    for (var k in mapEvents){
        var eventName = 'leafletDirectiveMap.' + mapEvents[k];
        // console.log(eventName); // Inspect
        scope.$on(eventName, setEventTrue(k));
        map.fireEvent([mapEvents[k]]);
        expect(check[mapEvents[k]]).toEqual(true);
    }
    });
});
