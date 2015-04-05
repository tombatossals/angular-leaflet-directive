(function(angular){ 
var app = angular.module('webapp');
        app.controller("BasicBoundsController", [ "$scope", "leafletData", "leafletBoundsHelpers", function($scope, leafletData, leafletBoundsHelpers) {
            var bounds = leafletBoundsHelpers.createBoundsFromArray([
                [ 51.508742458803326, -0.087890625 ],
                [ 51.508742458803326, -0.087890625 ]
            ]);
            angular.extend($scope, {
                bounds: bounds,
                center: {}
            });
        }]);

        app.controller('BasicCenterAutodiscoverController', [ '$scope', function($scope) {
            angular.extend($scope, {
                center: {
                    autoDiscover: true
                }
            });
       }]);

        app.controller('BasicCenterController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
       }]);

        app.controller('BasicCenterGeoIPController', [ '$scope', '$http', function($scope, $http) {
            angular.extend($scope, {
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 2
                }
            });
            $scope.searchIP = function(ip) {
                var url = "http://freegeoip.net/json/" + ip;
                $http.get(url).success(function(res) {
                    console.log(res);
                    $scope.center = {
                        lat: res.latitude,
                        lng: res.longitude,
                        zoom: 10
                    }
                    $scope.ip = res.ip;
                    console.log(res);
                })
            };
            $scope.searchIP("");
       }]);

        app.controller('BasicCenterUrlHashController', [ '$scope', '$location', function($scope, $location) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
            $scope.$on("centerUrlHash", function(event, centerHash) {
                console.log("url", centerHash);
                $location.search({ c: centerHash });
            });
            $scope.changeLocation = function(centerHash) {
                $location.search({ c: centerHash });
            }
        }]);

        app.controller('BasicCustomParametersController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                defaults: {
                    tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    zoomControlPosition: 'topright',
                    tileLayerOptions: {
                        opacity: 0.9,
                        detectRetina: true,
                        reuseTiles: true,
                    },
                    scrollWheelZoom: false
                }
            });
        }]);

        app.controller("BasicFirstController", [ "$scope", function($scope) {
            // Nothing here!
        }]);

        app.controller('BasicMapWithoutAnimationsController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                defaults: {
                    zoomAnimation: false,
                    markerZoomAnimation: false,
                    fadeAnimation: false
                },
                markers: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                    }
                }
            });
        } ]);

          app.controller("BasicMaxBoundsController", [ "$scope", "leafletData", function($scope, leafletData) {
            $scope.regions = {
                london: {
                    northEast: {
                        lat: 51.51280224425956,
                        lng: -0.11681556701660155
                    },
                    southWest: {
                        lat: 51.50211782162702,
                        lng: -0.14428138732910156
                    }
                },
                lisbon: {
                    southWest: {
                        lat: 38.700247900602726,
                        lng: -9.165430068969727
                    },
                    northEast: {
                        lat: 38.72703673982525,
                        lng: -9.110498428344725
                    }
                },
                warszawa: {
                    southWest: {
                        lat: 52.14823737817847,
                        lng: 20.793685913085934
                    },
                    northEast: {
                        lat: 52.31645452105213,
                        lng: 21.233139038085938
                    }
                }
            };
            angular.extend($scope, {
                maxbounds: $scope.regions.london
            });
        } ]);

        app.controller('BasicTilesController', [ '$scope', function($scope) {
            var tilesDict = {
                openstreetmap: {
                    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    options: {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                opencyclemap: {
                    url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    options: {
                        attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
                    }
                },
                mapbox_outdoors: {
                    name: 'Mapbox Outdoors',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia3no0m'
                    }
                },
                mapbox_wheat: {
                    name: 'Mapbox Wheat Paste',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia35jfp'
                    }
                }
            };
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                tiles: tilesDict.mapbox_wheat
            });
            $scope.changeTiles = function(tiles) {
                $scope.tiles = tilesDict[tiles];
            };
        } ]);

        app.controller('BasicTilesZoomChangerController', [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 10
                },
                tiles: {
                    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
            });
            $scope.$watch("london.zoom", function(zoom) {
                $scope.tiles.url = (zoom > 12)
                        ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            });
        } ]);

        app.controller("DemoController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 1
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        demosutfgrid: {
                            name: 'UTFGrid Interactivity',
                            type: 'utfGrid',
                            url: 'http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}',
                            visible: true
                        }
                    }
                }
            });
            $scope.interactivity = "";
            $scope.flag = "";
            $scope.$on('leafletDirectiveMap.utfgridMouseover', function(event, leafletEvent) {
                // the UTFGrid information is on leafletEvent.data
                $scope.interactivity = leafletEvent.data.admin;
                $scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;
            });
            $scope.$on('leafletDirectiveMap.utfgridMouseout', function(event, leafletEvent) {
                $scope.interactivity = "";
                $scope.flag = "";
            });
        }]);

        app.controller('DynamicOverlaysController', [ '$scope', function($scope) {
            angular.extend($scope, {
                ripoll: {
                    lat: 42.20133,
                    lng: 2.19110,
                    zoom: 11
                },
                markers: {
                    m1: {
                        lat: 42.20133,
                        lng: 2.19110
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
                        }
                    }
                },
                removeFireLayer: function() {
                    delete this.layers.overlays.fire;
                },
                addFireLayer: function() {
                    this.layers.overlays.fire = {
                        name: 'OpenFireMap',
                        type: 'xyz',
                        url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
                        layerOptions: {
                            attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    };
                },
                existsFireLayer: function() {
                    return ('fire' in this.layers.overlays);
                },
                removeHillshadeLayer: function() {
                    delete this.layers.overlays.hillshade;
                },
                addHillshadeLayer: function() {
                    this.layers.overlays.hillshade = {
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
                    };
                },
                existsHillshadeLayer: function() {
                    return ('hillshade' in this.layers.overlays);
                }
            });
        } ]);

        app.controller("EsriLegendServiceController", [ "$scope", function($scope) {
            angular.extend($scope, {
            	options: {
            		controls: {
            			layers: {
            				visible: false
            			}
            		}
            	},
                usa: {
	            	lat: 39.931486,
	                lng: -101.406250,
	                zoom: 3
	            },
                markers: {
                    m1: {
                        lat: 39.931486,
	                	lng: -101.406250,
                    }
                },
                layers: {
					baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia22g09'
                            }
						}
                   },
                   overlays: {
				    	usa_pop: {
					    	name: "USA 2000-2010 Population Change",
					        type: "dynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer",
					        visible: true,
					        layerOptions: {
				                opacity: 0.85,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	usa_social: {
					    	name: "USA Social Vulnerability Index",
					        type: "dynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Social_Vulnerability_Index/MapServer",
					        visible: false,
					        layerOptions: {
				                opacity: 0.85,
				                attribution: "Copyright:© 2014 Esri, FAO, NOAA"
					        }
				    	},
                    },
                },
                legend: {
                	url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer/legend?f=json",
                	legendClass: "info legend",
					position: "bottomleft",
                },
                legendURL1: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer/legend?f=json",
                legendURL2: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Social_Vulnerability_Index/MapServer/legend?f=json",
                switchLegend: function() {
                	$scope.layers.overlays.usa_social.visible = !$scope.layers.overlays.usa_social.visible;
                	$scope.legend.url =
                		$scope.legend.url == $scope.legendURL1? $scope.legendURL2:$scope.legendURL1;
                }
            });
        }]);

        app.controller("GoogleMapsController", [ "$scope", function($scope) {
            angular.extend($scope, {
                berlin: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: 14
                },
                markers: {
                    m1: {
                        lat: 52.52,
                        lng: 13.40
                    }
                },
                layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
	                        name: 'Google Hybrid',
	                        layerType: 'HYBRID',
	                        type: 'google'
	                    },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
            });
        }]);

        app.controller("GoogleMapsFullsizeController", [ "$scope", "$element", function($scope, $element) {
            angular.extend($scope, {
                berlin: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: 14
                },
                markers: {
                    m1: {
                        lat: 52.52,
                        lng: 13.40
                    }
                },
                layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
	                        name: 'Google Hybrid',
	                        layerType: 'HYBRID',
	                        type: 'google'
	                    },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
            });
        }]);

        app.controller("LayerOverlaysSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
        }]);

        app.controller("LayersBingMapsController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bastia: {
                    lat: 42.7029,
                    lng: 9.4529,
                    zoom: 13
                },
                markers: {
                    bastia: {
                        lat: 67.6755,
                        lng: 9.4529
                    }
                },
                layers: {
                    baselayers: {
                        bingAerial: {
                            name: 'Bing Aerial',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Aerial'
                            }
                        },
                        bingRoad: {
                            name: 'Bing Road',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Road'
                            }
                        },
                        bingAerialWithLabels: {
                            name: 'Bing Aerial With Labels',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'AerialWithLabels'
                            }
                        },
                    }
                }
            });
        }]);

        app.controller("LayersDynamicAdditionController", [ "$scope", function($scope) {
            $scope.definedLayers = {
                mapbox_wheat: {
                    name: 'Mapbox Wheat Paste',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia35jfp'
                    }
                },
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            };
            $scope.definedOverlays = {
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
                }
            };
            angular.extend($scope, {
                bern: {
                    lat: 46.916,
                    lng: 7.466,
                    zoom: 10
                },
                layers: {
                    baselayers: {
                        osm: $scope.definedLayers.osm,
                        mapbox_wheat: $scope.definedLayers.mapbox_wheat
                    },
                    overlays: {
                        hillshade: $scope.definedOverlays.hillshade
                    }
                }
            });
            $scope.toggleLayer = function(layerName) {
                var baselayers = $scope.layers.baselayers;
                if (baselayers.hasOwnProperty(layerName)) {
                    delete baselayers[layerName];
                } else {
                    baselayers[layerName] = $scope.definedLayers[layerName];
                }
            };
            $scope.toggleOverlay = function(overlayName) {
                var overlays = $scope.layers.overlays;
                if (overlays.hasOwnProperty(overlayName)) {
                    delete overlays[overlayName];
                } else {
                    overlays[overlayName] = $scope.definedOverlays[overlayName];
                }
            };
        }]);

        app.controller("LayersEsriDynamicLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bogota: {
	            	lat: 4.649,
	                lng: -74.086,
	                zoom: 15
	            },
                markers: {
                    m1: {
                        lat: 4.649,
	                	lng: -74.086,
                    }
                },
                layers: {
                    baselayers: {
				    	world: {
					    	name: "Imagery",
					        type: "dynamic",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
					        visible: false,
					        layerOptions: {
					            layers: [0, 1, 2, 3],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	topo: {
					    	name: "World Topographic",
					        type: "dynamic",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
					        visible: false,
					        layerOptions: {
					            layers: [0],
				                opacity: 0.9,
				                attribution: "Copyright:© 2014 Esri, FAO, NOAA"
					        }
				    	},
                    },
                },
            });
        }]);

        app.controller("LayersHideBaselayerOnSelectorController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
        }]);

        app.controller("LayersHideOverlaysOnSelectorController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'Mapbox Streets',
                            url: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.ll5em372'
                            }
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                showOnSelector: false,
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
        }]);

        app.controller("LayersImageOverlayController", [ "$scope", "$log", "leafletData", "leafletBoundsHelpers", function($scope, $log, leafletData, leafletBoundsHelpers) {
            var maxBounds = leafletBoundsHelpers.createBoundsFromArray([[-540, -960], [540, 960]]);
            angular.extend($scope, {
                defaults: {
                  scrollWheelZoom: false,
                  crs: 'Simple',
                  maxZoom: 2
                },
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 0
                },
                maxBounds: maxBounds,
                layers: {
                    baselayers: {
                        sanfrancisco: {
                            name: 'Andes',
                            type: 'imageOverlay',
                            url: 'images/andes.jpg',
                            bounds: [[-540, -960], [540, 960]],
                            layerParams: {
                              noWrap: true,
                              attribution: 'Creative Commons image found <a href="http://www.flickr.com/photos/c32/8025422440/">here</a>'
                            }
                        }
                    },
                }
            });
       }]);

        app.controller("LayersLayergroupSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {}
                }
            });
            var tileLayer = {
              name: 'Countries',
              type: 'xyz',
              url: 'http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.png',
              visible: true,
              layerOptions: {
                attribution: 'Map data &copy; 2013 Natural Earth | Data &copy; 2013 <a href="http://www.reporter-ohne-grenzen.de/ranglisten/rangliste-2013/">ROG/RSF</a>',
                maxZoom: 5
              }
            };
            var utfGrid = {
              name: 'UtfGrid',
              type: 'utfGrid',
              url: 'http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.grid.json?callback={cb}',
              visible: true,
              pluginOptions: {
                maxZoom: 5,
                resolution: 4
              }
            };
            var group = {
              name: 'Group Layer',
              type: 'group',
              visible: true,
              layerOptions: {
                layers: [ tileLayer, utfGrid],
                maxZoom: 5
              }
            };
            $scope.layers['overlays']['Group Layer'] = group;
            $scope.$on('leafletDirectiveMap.utfgridMouseover', function(event, leafletEvent) {
                $scope.country = leafletEvent.data.name;
            });
        }]);

        app.controller("LayersSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 25.0391667,
                    lng: 121.525,
                    zoom: 6
                },
                markers: {
                    taipei: {
                        lat: 25.0391667,
                        lng: 121.525,
                    }
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia22g09'
                            }
                        },
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                }
            });
        }]);

        app.controller("LayersWebGLHeatmapController", [ "$scope", function($scope) {
            var dataPoints = [
                [44.651144316,-63.586260171, 0.5],
                [44.75, -63.5, 0.8] ];
            angular.extend($scope, {
                center: {
                    lat: 44.8091,
                    lng: -63.3636,
                    zoom: 9
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        heatmap: {
                            name: 'Heat Map',
                            type: 'heatmap',
                            data: dataPoints,
                            visible: true
                        }
                    }
                }
            });
        }]);

        app.controller("PathSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                europeanPaths: {
                    p1: {
                        color: 'red',
                        weight: 8,
                        latlngs: [
                            { lat: 51.50, lng: -0.082 },
                            { lat: 48.83, lng: 2.37 },
                            { lat: 41.91, lng: 12.48 }
                        ],
                        message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
                    },
                    p2: {
                        color: 'green',
                        weight: 8,
                        latlngs: [
                            { lat: 48.2083537, lng: 16.3725042 },
                            { lat: 48.8534, lng: 2.3485 }
                        ],
                        label: {message: "<h3>Route from Vienna to Paris</h3><p>Distance: 1211km</p>"}
                    }
                }
            });
        }]);

        app.controller('PathTypesController', [ '$scope', function($scope) {
            var europeCapitals = {
                Madrid: {
                    lat: 40.4,
                    lng: -3.6833333
                },
                Rome: {
                    lat: 41.9,
                    lng: 12.4833333
                },
                London: {
                    lat: 51.5,
                    lng: -0.116667
                },
                Lisbon: {
                    lat: 38.7166667,
                    lng: -9.1333333
                },
                Berlin: {
                    lat: 52.5166667,
                    lng: 13.4
                },
                Paris: {
                    lat: 48.866667,
                    lng: 2.333333
                },
                Brussels: {
                    lat: 50.8333,
                    lng: 4
                }
            };
            var pathsDict = {
                polyline: {
                    type: "polyline",
                    latlngs: [ europeCapitals.London, europeCapitals.Madrid, europeCapitals.Rome ]
                },
                multiPolyline: {
                    type: "multiPolyline",
                    latlngs: [
                        [ europeCapitals.London, europeCapitals.Lisbon ],
                        [ europeCapitals.Paris, europeCapitals.Madrid ],
                        [ europeCapitals.Rome, europeCapitals.Berlin ]
                    ]
                },
                polygon: {
                   type: "polygon",
                   latlngs: [ europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ]
                },
                multiPolygon: {
                    type: "multiPolygon",
                    latlngs: [
                                [ europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ],
                                [ europeCapitals.Berlin, europeCapitals.Rome, europeCapitals.Brussels ]
                            ]
                },
                rectangle: {
                    type: "rectangle",
                    latlngs: [ europeCapitals.Berlin, europeCapitals.Lisbon ]
                },
                circle: {
                    type: "circle",
                    radius: 500 * 1000,
                    latlngs: europeCapitals.Brussels
                },
                circleMarker: {
                    type: "circleMarker",
                    radius: 50,
                    latlngs: europeCapitals.Rome
                }
            };
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 3
                },
                paths: {}
            });
            $scope.addShape = function(shape) {
                $scope.paths = {};
                $scope.paths[shape] = pathsDict[shape];
            };
        } ]);

        app.controller('Paths3000ItemsController', ['$scope', 'leafletData', 'LocationDataService', function ($scope, leafletData, LocationDataService) {
            //map properties
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false
                },
                //restrict map panning for this region
                maxbounds: {
                    northEast: {
                        lat: 90,
                        lng: -180
                    },
                    southWest: {
                        lat: -90,
                        lng: 180
                    }
                },
                centroid: {
                    lat: 50,
                    lng: 10,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        stamen: {
                            name: 'StamenWatercolor',
                            url: 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
                            type: 'xyz',
                        }
                    }
                }
            });
            // set up circle rendering
            //namespace leaflet path
            $scope.paths = {};
            //bind locationGrid to zoom level
            $scope.$watch("centroid.zoom", function (zoom) {
                if (zoom <= 3) {
                    //clear path object
                    $scope.paths = {};
                    //get location data and initialize leaflet circles
                    LocationDataService.getLocationsTenGrid().then(function (res) {
                        angular.forEach(res.data, function (value, key) {
                            if (value.lat !== null && value.lon !== null) {
                                $scope.paths['circle' + key] = {
                                    type: 'circle',
                                    className: 'testClass',
                                    fillColor: 'DarkSlateGray',
                                    color: '#000000',
                                    weight: 0,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                    stroke: false,
                                    clickable: false,
                                    latlngs: [parseFloat(value.lat), parseFloat(value.lon)],
                                    radius: Math.sqrt(value.location_count) * 5000
                                };
                            }
                        });
                    }, function (error) {
                        console.log('An error occured!', error);
                    });
                }
                if (zoom >= 4) {
                    //clear path object
                    $scope.paths = {};
                    //get location data and initialize leaflet circles
                    LocationDataService.getLocationsZeroOneGrid().then(function (res) {
                        angular.forEach(res.data, function (value, key) {
                            if (value.lat !== null && value.lon !== null) {
                                $scope.paths['circle' + key] = {
                                    type: 'circle',
                                    className: 'testClass',
                                    fillColor: 'DarkSlateGray',
                                    color: '#000000',
                                    weight: 0,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                    stroke: false,
                                    clickable: false,
                                    latlngs: [parseFloat(value.lat), parseFloat(value.lon)],
                                    radius: Math.sqrt(value.location_count) * 2000
                                };
                            }
                        });
                    }, function (error) {
                        console.log('An error occured!', error);
                    });
                }
            });
        }]);
        // getting data with a factory
        app.factory('LocationDataService', LocationDataService);
        /* @ngInject */
        function LocationDataService($http) {
            var srv = {};
            // Service implementation for gridsize = 10
            srv.getLocationsTenGrid = function () {
                return $http.get('json/mockupTenGrid.json', {
                    cache: true
                });
            };
            // Service implementation for gridsize = 0.1
            srv.getLocationsZeroOneGrid = function () {
                return $http.get('json/mockupZeroOneGrid.json', {
                    cache: true
                });
            };
            // Public API
            return {
                getLocationsTenGrid: function () {
                    return srv.getLocationsTenGrid();
                },
                getLocationsZeroOneGrid: function () {
                    return srv.getLocationsZeroOneGrid();
                }
            };
        };

        app.controller("PathsAjaxLoadController", [ "$scope", "$http", function($scope, $http) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                europeanPaths: {}
            });
            $scope.loadPaths = function loadPaths() {
                $http.get('json/paths.json').success(function(data) {
                    $scope.europeanPaths = data;
                });
            };
            $scope.changePaths = function changePaths() {
                console.log($scope.europeanPaths);
                $scope.europeanPaths.p1.latlngs[0] = {
                    lat: 53,
                    lng: -0.1
                };
            };
        }]);

        app.controller('DemoController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    main_marker: {
                        lat: 51.5,
                        lng: 0,
                        focus: true,
                        //message: "Hey, drag me if you want",
                        title: "Marker",
                        draggable: true,
                        label: {
                            message: "Hey, drag me if you want",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    another_marker: {
                        lat: 51,
                        lng: 0,
                        focus: true,
                        title: "Marker",
                        draggable: true,
                        label: {
                            message: "<div ng-include src=\"'views/template.html'\"></div>",
                            options: {
                                noHide: true
                            }
                        }
                    }
                }
            });
        } ]);
        app.controller('ViewController', ['$scope', function($scope) {
            $scope.user = {};
            $scope.greet = function(user) {
              alert('hello ' + user.name);
            }
        } ]);
}(angular));