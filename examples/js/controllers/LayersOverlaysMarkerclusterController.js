        app.controller('LayersOverlaysMarkerclusterController', [ '$scope', function($scope) {
            angular.extend($scope, {
                ripoll: {
                    lat: 42.20133,
                    lng: 2.19110,
                    zoom: 8
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
                        cars: {
                            name: 'Cars',
                            type: 'markercluster',
                            visible: true
                        }
                    }
                },
                markers: {
                    m1: {
                        lat: 42.20133,
                        lng: 2.19110,
                        layer: 'cars',
                        message: "I'm a moving car"
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
                        layer: 'cars',
                        message: 'A bike!!'
                    },
                    m4: {
                        lat: 42.3,
                        lng: 2.16110,
                        layer: 'cars'
                    },
                    m5: {
                        lat: 42.1,
                        lng: 2.16910,
                        layer: 'cars'
                    },
                    m6: {
                        lat: 42.15,
                        lng: 2.17110,
                        layer: 'cars'
                    }
                }
            });
            $scope.move = function() {
                $scope.markers.m1.lng = $scope.markers.m1.lng + 0.1;
            }
        } ]);