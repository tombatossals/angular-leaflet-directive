        app.controller('OverlaysController', [ '$scope', function($scope) {
            angular.extend($scope, {
                ripoll: {
                    lat: 42.20133,
                    lng: 2.19110,
                    zoom: 11
                },
                markers: {
                    m1: {
                        lat: 51.505,
                        lng: -0.09
                    }
                },
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
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
                        },
                        cars: {
                            name: 'Cars',
                            type: 'group',
                            visible: true
                        },
                        bikes: {
                            name: 'Bicycles',
                            type: 'group',
                            visible: false
                        }
                    }
                },
                markers: {
                    m1: {
                        lat: 42.20133,
                        lng: 2.19110,
                        layer: 'cars',
                        message: "I'm a car"
                    },
                    m2: {
                        lat: 42.21133,
                        lng: 2.18110,
                        layer: 'cars',
                        message: "I'm a car"
                    },
                    m3: {
                        lat: 42.19133,
                        lng: 2.18110,
                        layer: 'bikes',
                        message: 'A bike!!'
                    },
                    m4: {
                        lat: 42.3,
                        lng: 2.16110,
                        layer: 'bikes'
                    },
                    m5: {
                        lat: 42.1,
                        lng: 2.16910
                    },
                    m6: {
                        lat: 42.15,
                        lng: 2.17110
                    }
                }
            });
        } ]);
        app.controller('DefaultController', [ '$scope', function($scope) {
            angular.extend($scope, {
                mapDefault: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                        zoom: 8
                    },
                    markers: {
                        m1: {
                            lat: 51.505,
                            lng: -0.09
                        }
                    }
                }
            });
        } ]);