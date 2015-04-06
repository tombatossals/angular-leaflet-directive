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
                    $scope.center = {
                        lat: res.latitude,
                        lng: res.longitude,
                        zoom: 10
                    }
                    $scope.ip = res.ip;
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
        app.controller('BasicLegendController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#ff0000', '#28c9ff', '#0000ff', '#ecf386' ],
                    labels: [ 'National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway' ]
                },
                defaults: {
                    tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
                }
            });
        } ]);
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
        app.controller("BasicMaxBoundsPadController", [ "$scope", "leafletBoundsHelpers", function($scope, leafletBoundsHelpers) {
            var maxbounds = leafletBoundsHelpers.createBoundsFromArray([
                [ 37.8866, -79.4877 ],
                [ 39.7230, -74.9863 ]
            ]);
            $scope.maxBoundsPad = maxbounds.pad = 1;
            angular.extend($scope, {
                bounds: maxbounds,
                center: {},
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {}
                },
                markers: {
                    northeast: {
                        lat: 39.7230,
                        lng: -74.9863,
                        focus: true,
                        title: "Northeast",
                    },
                    southwest: {
                        lat: 37.8866,
                        lng: -79.4877,
                        title: "Southwest",
                    }
                },
                maxbounds: maxbounds
            });
        }]);
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
        app.controller("ControlsDrawController", [ "$scope", "leafletData", function($scope, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                controls: {
                    draw: {}
                }
           });
           leafletData.getMap().then(function(map) {
              var drawnItems = $scope.controls.edit.featureGroup;
              map.on('draw:created', function (e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);
                console.log(JSON.stringify(layer.toGeoJSON()));
              });
           });
       }]);
        app.controller("ControlsScaleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                controls: {
                    scale: true
                }
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
      app.controller("GeoJSONCenterController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
        $scope.centerJSON = function() {
            leafletData.getMap().then(function(map) {
                var latlngs = [];
                for (var i in $scope.geojson.data.features[0].geometry.coordinates) {
                    var coord = $scope.geojson.data.features[0].geometry.coordinates[i];
                    for (var j in coord) {
                        var points = coord[j];
                        for (var k in points) {
                            latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                        }
                    }
                }
                map.fitBounds(latlngs);
            });
        };
        // Get the countries geojson data from a JSON
        $http.get("json/JPN.geo.json").success(function(data, status) {
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }
            });
        });
      } ]);
      app.controller("GeoJSONController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        angular.extend($scope, {
            japan: {
                lat: 38.51,
                lng: 139,
                zoom: 4
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
        // Get the countries geojson data from a JSON
        $http.get("json/JPN.geo.json").success(function(data, status) {
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }
            });
        });
      } ]);
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
        app.controller("LayersEsriLegendServiceController", [ "$scope", function($scope) {
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
                	legendClass: "info legend-esri",
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
        app.controller("LayersOverlaysSimpleController", [ "$scope", function($scope) {
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
        app.controller("LayersUTFGridController", [ "$scope", function($scope) {
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
        app.controller('MarkersAddRemoveController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {}
            });
            $scope.addMarkers = function() {
                angular.extend($scope, {
                    markers: {
                        m1: {
                            lat: 51.505,
                            lng: -0.09,
                            message: "I'm a static marker",
                        },
                        m2: {
                            lat: 51,
                            lng: 0,
                            focus: true,
                            message: "Hey, drag me if you want",
                            draggable: true
                        }
                    }
                });
            };
            $scope.removeMarkers = function() {
                $scope.markers = {};
            }
            $scope.addMarkers();
        } ]);
        app.controller('MarkersChangeOpacityController', [ '$scope', function($scope) {
            angular.extend($scope, {
                chicago: {
                    lat: 41.85,
                    lng: -87.65,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 41.85,
                        lng: -87.65,
                        message: "I'm a static marker with defaultIcon",
                        focus: false,
                        opacity: 1
                    },
                }
            });
        } ]);
        app.controller("MarkersClustering10000MarkersController", [ "$scope", function($scope) {
            var addressPointsToMarkers = function(points) {
              return points.map(function(ap) {
                return {
                  layer: 'realworld',
                  lat: ap[0],
                  lng: ap[1]
                };
              });
            };
            angular.extend($scope, {
                center: {
                    lat: -37.9212959167,
                    lng: 175.5604435167,
                    zoom: 11
                },
                events: {
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [],
                        logic: 'emit'
                    }
                },
                markers: addressPointsToMarkers(addressPoints),
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '© OpenStreetMap contributors',
                                continuousWorld: true
                            }
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true,
                            "layerOptions": {
                                "chunkedLoading": true,
                                "showCoverageOnHover": false,
                                "removeOutsideVisibleBounds": true
                            }
                        },
                    }
                }
            });
        }]);
        app.controller("MarkersClusteringController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 24.0391667,
                    lng: 121.525,
                    zoom: 6
                },
                markers: {
                    taipei: {
                        layer: "northTaiwan",
                        lat: 25.0391667,
                        lng: 121.525,
                    },
                    yangmei: {
                        layer: "northTaiwan",
                        lat: 24.9166667,
                        lng: 121.1333333
                    },
                    hsinchu: {
                        layer: "northTaiwan",
                        lat: 24.8047222,
                        lng: 120.9713889
                    },
                    miaoli: {
                        layer: "northTaiwan",
                        lat: 24.5588889,
                        lng: 120.8219444
                    },
                    tainan: {
                        layer: "southTaiwan",
                        lat: 22.9933333,
                        lng: 120.2036111
                    },
                    puzi: {
                        layer: "southTaiwan",
                        lat: 23.4611,
                        lng: 120.242
                    },
                    kaohsiung: {
                        layer: "southTaiwan",
                        lat: 22.6252777778,
                        lng: 120.3088888889
                    },
                    taitun: {
                        layer: "southTaiwan",
                        lat: 22.75,
                        lng: 121.15
                    }
                },
                layers: {
                    baselayers: {
                        mapbox_terrain: {
                            name: 'Mapbox Terrain',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoidG9tYmF0b3NzYWxzIiwiYSI6Imo3MWxyTHMifQ.TjXg_IV7ZYMHX6tqjMikPg',
                                mapid: 'examples.map-i86nkdio'
                            }
                        }
                    },
                    overlays: {
                        northTaiwan: {
                            name: "North cities",
                            type: "markercluster",
                            visible: true
                        },
                        southTaiwan: {
                            name: "South cities",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });
        }]);
        app.controller('MarkersClusteringWithoutOverlaysController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    stoke: {
                        group: 'london',
                        lat: 51.5615,
                        lng: -0.0731,
                        label: {
                            message: "Stoke",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    dalston: {
                        group: 'london',
                        lat: 51.545,
                        lng: -0.070,
                        label: {
                            message: "Dalston",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    wandsworth: {
                        group: 'london',
                        lat: 51.4644,
                        lng:-0.1924,
                        label: {
                            message: "Wandsworth",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    battersea: {
                        group: 'london',
                        lat: 51.4638,
                        lng: -0.1677,
                        label: {
                            message: "Battersea",
                            options: {
                                noHide: true
                            }
                        }
                    }
                },
            });
        } ]);
        app.controller("MarkersDelayedEventsController", ["$scope", "leafletEvents", function($scope, leafletEvents){
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {}
            });
            $scope.addMarkers = function() {
                angular.extend($scope, {
                    markers: {
                        m1: {
                            lat: 51.505,
                            lng: -0.09,
                            message: "I'm a static marker",
                        },
                        m2: {
                            lat: 51,
                            lng: 0,
                            focus: true,
                            message: "Hey, drag me if you want",
                            draggable: true
                        }
                    }
                });
            };
            $scope.events = {
                markers: {
                    enable: leafletEvents.getAvailableMarkerEvents(),
                }
            };
            $scope.eventDetected = "No events yet...";
            var markerEvents = leafletEvents.getAvailableMarkerEvents();
            for (var k in markerEvents){
                var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
                $scope.$on(eventName, function(event, args){
                    $scope.eventDetected = event.name;
                });
            }
            $scope.removeMarkers = function() {
                $scope.markers = {};
            }
            //$scope.addMarkers();
        }]);
        app.controller('MarkersEventsAddController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                events: {}
            });
            $scope.markers = new Array();
            $scope.$on("leafletDirectiveMap.click", function(event, args){
                var leafEvent = args.leafletEvent;
                $scope.markers.push({
                    lat: leafEvent.latlng.lat,
                    lng: leafEvent.latlng.lng,
                    message: "My Added Marker"
                });
            });
        } ]);
        app.controller("MarkersEventsController", [ "$scope", "leafletEvents", function($scope, leafletEvents) {
            $scope.center = {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            };
            $scope.markers = {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    draggable: true,
                    message: "I'm a draggable marker",
                    focus: true
                }
            }
            $scope.events = {
                markers: {
                    enable: leafletEvents.getAvailableMarkerEvents(),
                }
            };
            $scope.eventDetected = "No events yet...";
            var markerEvents = leafletEvents.getAvailableMarkerEvents();
            for (var k in markerEvents){
                var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
                $scope.$on(eventName, function(event, args){
                    $scope.eventDetected = event.name;
                });
            }
        }]);
        app.controller('MarkersGroupController', [ '$scope', function($scope) {
            var icons = {
                blue: {
                    type: 'div',
                    iconSize: [10, 10],
                    className: 'blue',
                    iconAnchor:  [5, 5]
                },
                red: {
                    type: 'div',
                    iconSize: [10, 10],
                    className: 'red',
                    iconAnchor:  [5, 5]
                }
            }
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 11
                },
                layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        red: {
                            type: 'group',
                            name: 'red',
                            visible: false
                        },
                        blue: {
                            type: 'group',
                            name: 'blue',
                            visible: false
                        }
                    }
                },
                markers: {
                    stoke: {
                        layer: 'blue',
                        lat: 51.5615,
                        lng: -0.0731,
                        icon: icons.blue
                    },
                    dalston: {
                        layer: 'blue',
                        lat: 51.545,
                        lng: -0.070,
                        icon: icons.blue
                    },
                    wandsworth: {
                      layer: 'red',
                        lat: 51.4644,
                        lng:-0.1924,
                        icon: icons.red
                    },
                    battersea: {
                        layer: 'red',
                        lat: 51.4638,
                        lng: -0.1677,
                        icon: icons.red
                    }
                },
                toggleLayer: function(type)
                {
                    $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
                }
            });
        } ]);
        app.controller('MarkersIconsController', [ '$scope', function($scope) {
            var local_icons = {
                defaultIcon: {},
                leafIcon: {
                    iconUrl: 'img/leaf-green.png',
                    shadowUrl: 'img/leaf-shadow.png',
                    iconSize:     [38, 95], // size of the icon
                    shadowSize:   [50, 64], // size of the shadow
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                },
                orangeLeafIcon: {
                    iconUrl: 'img/leaf-orange.png',
                	shadowUrl: 'img/leaf-shadow.png',
                	iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                },
                divIcon: {
                    type: 'div',
                	iconSize: [200, 0],
                	popupAnchor:  [0, 0],
                    html: 'Using <strong>Bold text as an icon</strong>:'
                }
            }
            angular.extend($scope, {
                chicago: {
                    lat: 41.85,
                    lng: -87.65,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 41.85,
                        lng: -87.65,
                        message: "I'm a static marker with defaultIcon",
                        focus: false,
                        icon: local_icons.defaultIcon,
                    },
                }
            });
            $scope.changeIcon = function(iconType) {
                $scope.markers.m1.icon = local_icons[iconType];
                $scope.markers.m1.message = "I'm a static marker with " + iconType;
            };
        } ]);
        app.controller("MarkersModalMarkerClusterController", ['$scope', 'leafletData', function ($scope, leafletData) {
            $scope.oneAtATime = false;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            var markers = [];
            markers.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false,
                group: 'markers'
            });
            markers.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false,
                group: 'markers'
            });
            angular.extend($scope, {
                defaults: {
                    maxZoom: 18,
                    minZoom: 0
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '© OpenStreetMap contributors',
                                continuousWorld: true
                            }
                        }
                    }
                },
                center: {
                    zoom: 10,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers: markers
            });
        }]);
        app.controller('MarkersPopupController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 51.505,
                        lng: -0.09,
                        focus: true,
                        draggable: false,
                        message: "Hi there!",
                        icon: {}
                    }
                },
                iconA: {},
                iconB: {
                	iconUrl: 'img/leaf-orange.png',
                	shadowUrl: 'img/leaf-shadow.png',
                	iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62]
                },
                iconC: {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                iconD: {
                    type: 'makiMarker',
                    icon: 'beer',
                    color: '#f00',
                    size: "l"
                },
                iconE: {
                    type: 'extraMarker',
                    icon: 'fa-star',
                    color: '#f00',
                    prefix: 'fa',
                    shape: 'circle'
                }
            });
            $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Click");
            });
            $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Open");
            });
            $scope.$on('leafletDirectiveMarker.popupclose', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Close");
            });
        } ]);
        app.controller('MarkersRotationController', [ '$scope', function($scope) {
            var markers = {
                    m1: {
                        lat: 41.95,
                        lng: -87.65,
                        message: "I'm a static marker at 0 degrees",
                        focus: false,
                        iconAngle: 0
                    },
                    m2: {
                        lat: 41.85,
                        lng: -87.95,
                        message: "I'm a static marker at 270 degrees",
                        focus: false,
                        iconAngle: 270
                    },
                    m3: {
                        lat: 41.85,
                        lng: -87.05,
                        message: "I'm a static marker at 90 degrees",
                        focus: false,
                        iconAngle: 90
                    },
                    m4: {
                        lat: 41.35,
                        lng: -87.65,
                        message: "I'm a static marker at 180 degrees",
                        focus: false,
                        iconAngle: 180
                    }
                };
            angular.extend($scope, {
                chicago: {
                    lat: 41.85,
                    lng: -87.65,
                    zoom: 8
                },
                markers: markers
            });
        } ]);
        app.controller('MarkersSimpleController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    mainMarker: {
                        lat: 51,
                        lng: 0,
                        focus: true,
                        message: "Hey, drag me if you want",
                        draggable: true
                    }
                }
            });
        } ]);
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
            app.controller('PathsAdvancedController', [ '$scope', function($scope) {
                $scope.addMarker = function() {
                    var m_key = document.getElementById('new_mm_name').value;
                    if ($scope.markers[m_key]) return;
                    $scope.markers[m_key] = {
                        lat: document.getElementById('new_mm_lat').value,
                        lng: document.getElementById('new_mm_lng').value,
                        draggable: true
                    };
                    $scope.paths.p1.latlngs.push($scope.markers[m_key]);
                }
                $scope.deleteMarker = function(m_key) {
                    var marker = $scope.markers[m_key];
                    for (var pkey in $scope.paths) {
                        for (var j in $scope.paths[pkey].latlngs) {
                            var p = $scope.paths[pkey].latlngs[j];
                            if (p === marker) {
                                $scope.paths[pkey].latlngs.splice(j, 1);
                            }
                        }
                    }
                    delete $scope.markers[m_key];
                }
                angular.extend($scope, {
                    // set up map center
                    cen: {
                        lat: 53,
                        lng: -3,
                        zoom: 6
                    },
                    // set up multiple markers on map
                    markers: {
                        London : {
                            lat: 51.50,
                            lng: -0.082,
                            draggable: false
                        },
                        Manchester: {
                            lat: 53.48,
                            lng: -2.24,
                            draggable: true
                        },
                        Lincoln: {
                            lat: 53.230495,
                            lng: -0.53936,
                            draggable: true
                        },
	                    Northhampton: {
                            lat: 52.237892,
                            lng: -0.90087,
                            draggable: true
	                    },
	                    Worcester: {
                            lat: 52.187404,
                            lng: -2.20275,
                            draggable: true
	                    },
	                    York: {
		                    lat: 53.959317,
		                    lng: -1.08215,
		                    draggable: true
	                    }
                    }
                });
                angular.extend($scope, {
                    paths: {
                        p1: {
                            color: '#008000',
                            weight: 4,
                            latlngs: [ $scope.markers.London, $scope.markers.Manchester ]
                        },
                        p2: {
                            weight: 3,
                            opacity: 0.5,
                            latlngs: [
	                            [ $scope.markers.London, $scope.markers.Lincoln ],
                                [ $scope.markers.Manchester, $scope.markers.Worcester]
                            ],
	                        type: 'multiPolyline'
                        },
	                    c1: {
		                    weight: 2,
		                    color: '#ff612f',
		                    latlngs: $scope.markers.Northhampton,
		                    radius: 10000,
		                    type: 'circle'
	                    },
	                    c2: {
		                    weight: 2,
		                    color: '#ff612f',
		                    latlngs: $scope.markers.Lincoln,
		                    radius: 50,
		                    type: 'circleMarker'
	                    },
	                    pg1: {
		                    latlngs: [ $scope.markers.London, $scope.markers.Worcester, $scope.markers.Lincoln ],
		                    stroke: false,
		                    fillColor: '#ff69b4',
		                    type: 'polygon'
	                    },
	                    pg2: {
                            weight: 1,
                            color: '#2e3974',
                            latlngs: [
	                            [ $scope.markers.London, $scope.markers.Worcester, $scope.markers.Northhampton ],
                                [ $scope.markers.Manchester, $scope.markers.Lincoln, $scope.markers.York ]
                            ],
		                    type: 'multiPolygon'
	                    },
	                    r1: {
		                    latlngs: [ $scope.markers.Lincoln, $scope.markers.York ],
		                    type: 'rectangle'
	                    }
                    }
                });
            } ]);
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
        app.controller('PathsChangeInGroupLayerController', function($scope, leafletData) {
            $scope.changePaths = function() {
                $scope.paths = {
                    p2: {
                        color: '#FC0',
                        weight: 8,
                        latlngs: [ { lat: 52.50, lng: -0.082 }, { lat: 42.91, lng: 12.48 } ],
                        layer: 'test'
                    }
                };
            };
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                paths : {
                    p1: {
                        color: '#000',
                        weight: 8,
                        latlngs: [{ lat: 51.50, lng: -0.082 }, { lat: 41.91, lng: 12.48 }],
                        layer: 'test'
                    }
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
                            layerOptions: {
                                subdomains: '1234',
                                attribution: 'test'
                            }
                        }
                    },
                    overlays: {
                        test: {
                            name: 'Test',
                            visible: true,
                            type: 'group'
                        }
                    }
                }
            });
        });
        app.controller('PathsDecorationsSimpleController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                decorations: {
                    markers: {
                        coordinates: [[51.9, -0.4], [51.505, -0.09], [51.0, -0.4]],
                        patterns: [
                            { offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}}) },
                            { offset: 0, repeat: 25, symbol: L.Symbol.dash({pixelSize: 0}) }
                        ]
                    }
                }
            });
            $scope.changePattern = function(type) {
                if (type === 'dot') {
                    $scope.decorations.markers.patterns = [ {offset: 0, repeat: 10, symbol: L.Symbol.dash({pixelSize: 0})} ];
                } else if (type === 'slash') {
                    $scope.decorations.markers.patterns = [ {offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})} ];
                } else if (type === 'slashdot') {
                    $scope.decorations.markers.patterns = [
                        { offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}}) },
                        { offset: 0, repeat: 25, symbol: L.Symbol.dash({pixelSize: 0}) }
                    ];
                } else if (type === 'arrow') {
                    $scope.decorations.markers.patterns = [
                        {offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 18, pathOptions: {color: '#f00', weight: 4}})},
                        {offset: '10%', repeat: 25, symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}})}
                    ]
                }
            };
        } ]);
        app.controller('MarkersLabelController', [ '$scope', function($scope) {
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
        } ]);}(angular));