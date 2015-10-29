(function(angular){ 
var app = angular.module('webapp');
        app.controller("BasicAccessLeafletObjectController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
            $scope.fitBounds = function() {
                leafletData.getMap().then(function(map) {
                    map.fitBounds([ [40.712, -74.227], [40.774, -74.125] ]);
                });
            };
       }]);
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
        app.controller('BasicBoundsNominatimController', [ '$scope', function($scope) {
            angular.extend($scope, {
                bounds: {
                    address: 'Bath, UK'
                }
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
                    };
                    $scope.ip = res.ip;
                });
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
            };
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
        app.controller("BasicDoubleMapAccessMapObjectController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                markers: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.logLeafletData = function(name) {
                leafletData.getMap(name).then(function(map) {
                    $log.info(map);
                });
            };
        }]);
        app.controller("BasicDoubleMapEventsController", [ "$scope", "$log", "leafletData", "leafletEvents", function($scope, $log, leafletData, leafletEvents) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                markers: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.events = {
                map: {
                    enable: leafletEvents.getAvailableMapEvents(),
                    logic: 'emit'
                }
            };
            var mapEvents = leafletEvents.getAvailableMapEvents();
            for (var k in mapEvents) {
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                $scope.$on(eventName, function(event){
                    $scope.eventDetected = event.name;
                });
            }
            angular.extend($scope, {
                spain: {
                    lat: 40.095,
                    lng: -3.823,
                    zoom: 4
                },
                markers2: {
                    spain: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.events2 = {
                map: {
                    enable: ['click', 'dblclick'],
                    logic: 'emit'
                }
            };
            var mapEvents2 = $scope.events2.map.enable;
            for (var j in mapEvents2) {
                var eventName2 = 'leafletDirectiveMap.' + mapEvents[j];
                $scope.$on(eventName2, function(event){
                    $scope.eventDetected2 = event.name;
                });
            }
        }]);
        app.controller("BasicDoubleMapSharingAttributesController", [ "$scope", "$log", "$http", "leafletData", function($scope, $log, $http, leafletData) {
            angular.extend($scope, {
                center: {
                    lat: 43.7350,
                    lng: -79.3734,
                    zoom: 11
                },
                defaults: {
                    scrollWheelZoom: false
                },
                markers1: {
                    one: {
                        lat: 43.75,
                        lng: -79.56
                    },
                    two: {
                        lat: 43.76,
                        lng: -79.50
                    }
                },
                markers2: {
                    one: {
                        lat: 43.75,
                        lng: -79.56
                    },
                    two: {
                        lat: 43.75,
                        lng: -79.45
                    },
                    three: {
                        lat: 43.81,
                        lng: -79.26
                    }
                }
            });
            $http.get('json/toronto1.json').success(function(data, status) {
                $scope.toronto1 = data;
            });
            $http.get('json/toronto2.json').success(function(data, status) {
                $scope.toronto2 = data;
            });
        }]);
        app.controller("BasicDoubleMapToggleController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 5
                },
                paths: {
                    p1: {
                        color: 'blue',
                        weight: 8,
                        latlngs: [{
                            lat: 51.50,
                            lng: -0.082
                        }, {
                            lat: 48.83,
                            lng: 2.37
                        }, {
                            lat: 41.91,
                            lng: 12.48
                        }]
                    }
                },
            });
            angular.extend($scope, {
                center2: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 5
                },
                tiles2: {
                    name: 'Mapbox Outdoors',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia3no0m'
                    }
                },
                paths2: {
                    p1: {
                        color: 'red',
                        weight: 8,
                        latlngs: [{
                            lat: 51.50,
                            lng: -0.082
                        }, {
                            lat: 48.83,
                            lng: 2.37
                        }, {
                            lat: 41.91,
                            lng: 12.48
                        }]
                    }
                },
            });
        }]);
        app.config(function ($routeProvider) {
            $routeProvider.when('/map', {
                template: '<leaflet width="100%" height="480px"></leaflet>',
                controller: 'BasicDynamicAddRemoveMapExample'
            });
        });
        app.controller('BasicDynamicAddRemoveMapExample', [ '$scope', 'leafletData', function($scope, leafletData) {
        } ]);
        app.controller("BasicEventsController", [ "$scope", "leafletMapEvents", function($scope, leafletMapEvents) {
            $scope.center  = {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            };
            $scope.eventDetected = "No events yet...";
            var mapEvents = leafletMapEvents.getAvailableMapEvents();
            for (var k in mapEvents){
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                $scope.$on(eventName, function(event){
                    $scope.eventDetected = event.name;
                });
            }
        }]);
        app.controller("BasicFirstController", [ "$scope", function($scope) {
            // Nothing here!
        }]);
      app.controller("BasicGeoJSONUpdateController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
            angular.extend($scope, {
                center: {
                    lat: 31.99,
                    lng: -33.43,
                    zoom: 3
                },
                geojson : {
                    data: {
                      "type": "FeatureCollection",
                      "features": [
                        {
                          "type": "Feature",
                          "properties": {},
                          "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                              [
                                [
                                  -49.92187499999999,
                                  13.239945499286312
                                ],
                                [
                                  -49.92187499999999,
                                  54.57206165565852
                                ],
                                [
                                  -13.7109375,
                                  54.57206165565852
                                ],
                                [
                                  -13.7109375,
                                  13.239945499286312
                                ],
                                [
                                  -49.92187499999999,
                                  13.239945499286312
                                ]
                              ]
                            ]
                          }
                        }
                      ]
                    },
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
            $scope.updateGeojson = function() {
                $scope.geojson.data = {
                                  "type": "FeatureCollection",
                                  "features": [
                                    {
                                      "type": "Feature",
                                      "properties": {},
                                      "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [
                                          [
                                            [
                                              -41.8359375,
                                              28.92163128242129
                                            ],
                                            [
                                              -41.8359375,
                                              38.272688535980976
                                            ],
                                            [
                                              -26.015625,
                                              38.272688535980976
                                            ],
                                            [
                                              -26.015625,
                                              28.92163128242129
                                            ],
                                            [
                                              -41.8359375,
                                              28.92163128242129
                                            ]
                                          ]
                                        ]
                                      }
                                    }
                                  ]
                              };
                        }
                }]);
        app.controller('BasicHideShowMapController', function($scope, $timeout, leafletData) {
            $scope.center = {
                lat: 35,
                lng: 0,
                zoom: 8
            };
            $scope.showMap = false;
            $scope.$watch("showMap", function(value) {
                if (value === true) {
                    leafletData.getMap().then(function(map) {
                      $timeout(function() {
                        map.invalidateSize();
                      }, 300);
                    });
                }
            });
        });
        app.controller('BasicLFCenterController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
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
        app.controller("BasicMaxBoundsPadController", ["$scope", "leafletBoundsHelpers", function($scope, leafletBoundsHelpers) {
            var maxbounds = leafletBoundsHelpers.createBoundsFromArray([
                [37.8866, -79.4877],
                [39.7230, -74.9863]
            ]);
            maxbounds.pad = 1.0;
            angular.extend($scope, {
                bounds: maxbounds,
                center: {
                    lat: 37.8866,
                    lng: -79-4877,
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
        app.controller("ControlsCustomController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 37.8,
                    lng: -96,
                    zoom: 5
                },
                tiles: {
                    name: 'Mapbox Comic',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lpa06kfg'
                    }
                },
                controls: {
                    custom: new L.Control.Fullscreen()
                }
           });
       }]);
        app.controller("ControlsCustomLayerControlController", [ "$scope", function($scope) {
            angular.extend($scope, {
                layercontrol: {
                    icons: {
                      uncheck: "fa fa-toggle-off",
                      check: "fa fa-toggle-on"
                    }
                },
                madrid: {
                    lat: 40.415363,
                    lng: -3.707398,
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
                            name: "OpenStreetMap",
                            type: "xyz",
                            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            layerOptions: {
                                subdomains: ["a", "b", "c"],
                                attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            }
                        },
                        cycle: {
                            name: "OpenCycleMap",
                            type: "xyz",
                            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                            layerOptions: {
                                subdomains: ["a", "b", "c"],
                                attribution: "&copy; <a href=\"http://www.opencyclemap.org/copyright\">OpenCycleMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            }
                        }
                    },
                    overlays: {
                        hillshade: {
                            name: "Hillshade Europa",
                            type: "wms",
                            url: "http://129.206.228.72/cached/hillshade",
                            visible: true,
                            layerOptions: {
                                layers: "europe_wms:hs_srtm_europa",
                                format: "image/png",
                                opacity: 0.25,
                                attribution: "Hillshade layer by GIScience http://www.osm-wms.de",
                                crs: L.CRS.EPSG900913
                            },
                            group: "Raster"
                        },
                        fire: {
                            name: "Fire Stations",
                            type: "xyz",
                            url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
                            layerOptions: {
                                attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            },
                            group: "Open Fire Map"
                        },
                        em: {
                            name: "Emergency Rooms",
                            type: "xyz",
                            url: "http://openfiremap.org/eytiles/{z}/{x}/{y}.png",
                            layerOptions: {
                                attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            },
                            group: "Open Fire Map"
                        }
                    }
                },
                removeFireLayer: function() {
                    delete this.layers.overlays.fire;
                },
                addFireLayer: function() {
                    this.layers.overlays.fire = {
                        name: "Fire Stations",
                        type: "xyz",
                        url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
                        layerOptions: {
                            attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        },
                        group: "Open Fire Map"
                    };
                },
                existsFireLayer: function() {
                    return ("fire" in this.layers.overlays);
                },
                removeEmergencyRooms: function() {
                    delete this.layers.overlays.em;
                },
                addEmergencyRooms: function() {
                    this.layers.overlays.em = {
                        name: "Emergency Rooms",
                        type: "xyz",
                        url: "http://openfiremap.org/eytiles/{z}/{x}/{y}.png",
                        layerOptions: {
                            attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        },
                        group: "Open Fire Map"
                    };
                },
                existsEmergencyRooms: function() {
                    return ("em" in this.layers.overlays);
                },
                removeHillshadeLayer: function() {
                    delete this.layers.overlays.hillshade;
                },
                addHillshadeLayer: function() {
                    this.layers.overlays.hillshade = {
                        name: "Hillshade Europa",
                        type: "wms",
                        url: "http://129.206.228.72/cached/hillshade",
                        visible: true,
                        layerOptions: {
                            layers: "europe_wms:hs_srtm_europa",
                            format: "image/png",
                            opacity: 0.25,
                            attribution: "Hillshade layer by GIScience http://www.osm-wms.de",
                            crs: L.CRS.EPSG900913
                        },
                        group: "Raster"
                    };
                },
                existsHillshadeLayer: function() {
                    return ("hillshade" in this.layers.overlays);
                }
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
                            },
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        draw: {
                            name: 'draw',
                            type: 'group',
                            visible: true,
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    }
                }
           });
           leafletData.getMap().then(function(map) {
               leafletData.getLayers().then(function(baselayers) {
                  var drawnItems = baselayers.overlays.draw;
                  map.on('draw:created', function (e) {
                    var layer = e.layer;
                    drawnItems.addLayer(layer);
                    console.log(JSON.stringify(layer.toGeoJSON()));
                  });
               });
           });
       }]);
        app.controller("ControlsFullscreenController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 37.8,
                    lng: -96,
                    zoom: 5
                },
                tiles: {
                    name: 'Mapbox Comic',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lpa06kfg'
                    }
                },
                controls: {
                    fullscreen: {
                        position: 'topleft'
                    }
                }
           });
       }]);
        app.controller("ControlsMinimapController", [ "$scope", "leafletData", function($scope, leafletData) {
            angular.extend($scope, {
                bogota: {
                    lat: 4.649,
                    lng: -74.086,
                    zoom: 5
                },
                tiles: {
                    name: 'Mapbox Comic',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lpa06kfg'
                    }
                },
                controls: {}
           });
           // Wait for center to be stablished
           leafletData.getMap().then(function() {
               angular.extend($scope.controls, {
                   minimap: {
                       type: 'minimap',
                       layer: {
                           name: 'OpenStreetMap',
                           url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                           type: 'xyz'
                       },
                       toggleDisplay: true
                   }
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
        app.controller("ControlsSearchController", [ "$scope", "leafletData", function($scope, leafletData) {
            var markersData = [
                {"loc":[41.575330,13.102411], "title":"aquamarine"},
                {"loc":[41.575730,13.002411], "title":"black"},
                {"loc":[41.807149,13.162994], "title":"blue"},
                {"loc":[41.507149,13.172994], "title":"chocolate"},
                {"loc":[41.847149,14.132994], "title":"coral"},
                {"loc":[41.219190,13.062145], "title":"cyan"},
                {"loc":[41.344190,13.242145], "title":"darkblue"},
                {"loc":[41.679190,13.122145], "title":"darkred"},
                {"loc":[41.329190,13.192145], "title":"darkgray"},
                {"loc":[41.379290,13.122545], "title":"dodgerblue"},
                {"loc":[41.409190,13.362145], "title":"gray"},
                {"loc":[41.794008,12.583884], "title":"green"},
                {"loc":[41.805008,12.982884], "title":"greenyellow"},
                {"loc":[41.536175,13.273590], "title":"red"},
                {"loc":[41.516175,13.373590], "title":"rosybrown"},
                {"loc":[41.506175,13.173590], "title":"royalblue"},
                {"loc":[41.836175,13.673590], "title":"salmon"},
                {"loc":[41.796175,13.570590], "title":"seagreen"},
                {"loc":[41.436175,13.573590], "title":"seashell"},
                {"loc":[41.336175,13.973590], "title":"silver"},
                {"loc":[41.236175,13.273590], "title":"skyblue"},
                {"loc":[41.546175,13.473590], "title":"yellow"},
                {"loc":[41.239190,13.032145], "title":"white"}
            ];
            angular.extend($scope, {
                center: {
                    lat: 41.575330,
                    lng: 13.102411,
                    zoom: 8
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
                            },
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        search: {
                            name: 'search',
                            type: 'group',
                            visible: true,
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    }
                },
                controls: {},
                markers: {}
           });
           markersData.filter(function(data) {
               $scope.markers[data.title] = {
                   title: data.title,
                   lat: data.loc[0],
                   lng: data.loc[1],
                   layer: 'search',
                   label: {
                       message: data.title
                   }
               };
           });
           leafletData.getLayers().then(function(baselayers) {
               console.log(baselayers.overlays.search);
               angular.extend($scope.controls, {
                   search: {
                       layer: baselayers.overlays.search
                   }
               });
           });
       }]);
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
    app.controller("GeoJSONNestedController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        leafletData.getGeoJSON().then(function(lObjs){
            window.leafletDataGeoJSON = lObjs;
        });
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            },
            geojson:{}
        });
        // Mouse over function, called from the Leaflet Map Events
        var countryMouseover = function (feature, leafletEvent) {
            var layer = leafletEvent.target;
            layer.setStyle({
                weight: 2,
                color: '#666',
                fillColor: 'white'
            });
            layer.bringToFront();
        };
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, leafletPayload) {
            countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
        });
        $scope.centerJSON = function(name) {
            leafletData.getMap().then(function(map) {
                window.leafletMap = map;
                var latlngs = [];
                for (var i in $scope.geojson[name].data.features[0].geometry.coordinates) {
                    var coord = $scope.geojson[name].data.features[0].geometry.coordinates[i];
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
            angular.extend($scope.geojson, {
                japan: {
                    data: data,
                    resetStyleOnMouseout: true,
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
        $http.get("json/USA.geo.json").success(function(data, status) {
            angular.extend($scope.geojson, {
                usa:{
                    data: data,
                    resetStyleOnMouseout: true,
                    style: {
                        fillColor: "blue",
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
    app.controller("GeoJSONNonNestedController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        var getColor = function(id){
            return id == 'USA'? 'blue' : 'green';
        };
        var getStyle = function(feature){
            return {
                fillColor: getColor(feature.id),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        };
        var createGeoJsonObject = function (data){
            return {
                data: data,
                style: getStyle
            };
        };
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            },
        });
        $scope.centerJSON = function(index) {
            leafletData.getMap().then(function(map) {
                var latlngs = [];
                for (var i in $scope.geojson.data.features[index].geometry.coordinates) {
                    var coord = $scope.geojson.data.features[index].geometry.coordinates[i];
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
            if(!$scope.geojson){
                $scope.geojson = createGeoJsonObject(data);
            }
        });
        $http.get("json/USA.geo.json").success(function(data, status) {
            var features = $scope.geojson.data.features.concat(data.features);
            var copy = angular.extend({}, $scope.geojson.data);
            copy.features = features;
            $scope.geojson.data = copy;
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
        app.controller("ImageLegendServiceController", [ "$scope", function($scope) {
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
						googleTerrain: {
						    name: 'Google Terrain',
						    layerType: 'TERRAIN',
						    type: 'google'
						}
                   },
                   overlays: {
                        sst: {
                            name: 'Analyses - Sea Surface Temperature',
                            type: 'wms',
                            url: 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/analyses',
                            visible: true,
                            layerOptions: {
                                layers: 'NCEP_RAS_ANAL_RTG_SST,NCEP_POLY_ANAL_RTG_SST',
                                format: 'image/png',
                                transparent: true,
                                attribution: 'NOAA/NOS nowCOAST',
                            }
                        },
				    	wave: {
                            name: 'Forecasts - Wave height',
                            type: 'wms',
                            url: 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/forecasts',
                            visible: false,
                            layerOptions: {
                                layers: 'NDFD_RAS_WAVEH_3_00,NDFD_POLY_WAVEH_3_00',
                                format: 'image/png',
                                transparent: true,
                                attribution: 'NOAA/NOS nowCOAST',
                            }
                        }
                    }
                },
                legend: {
                	url: "http://nowcoast.noaa.gov/LayerInfo?layer=NCEP_RAS_ANAL_RTG_SST&data=legend",
                	legendClass: "info legend",
					position: "bottomleft",
                    type: "image"
                },
                legendURL1: "http://nowcoast.noaa.gov/LayerInfo?layer=NCEP_RAS_ANAL_RTG_SST&data=legend",
                legendURL2: "http://nowcoast.noaa.gov/LayerInfo?layer=NDFD_RAS_WAVEH_3_00&data=legend",
                switchLegend: function() {
                        $scope.layers.overlays.sst.visible = !$scope.layers.overlays.sst.visible;
                        $scope.layers.overlays.wave.visible = !$scope.layers.overlays.wave.visible;
                        $scope.legend.url == $scope.legendURL1? $scope.legendURL2:$scope.legendURL1;
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
        app.controller("LayersEsriBaseMapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bogota: {
	            	lat: 4.649,
	                lng: -74.086,
	                zoom: 5
	            },
                markers: {
                    m1: {
                        lat: 4.649,
	                	lng: -74.086,
                    }
                },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Streets",
					        type: "agsBase",
					        layer: "Streets",
					        visible: false
				    	},
				    	topo: {
					    	name: "World Topographic",
					        type: "agsBase",
					        layer: "Topographic",
					        visible: false
				    	},
                        national: {
                            name: "National Geographic",
					        type: "agsBase",
					        layer: "NationalGeographic",
					        visible: false
                        },
                        oceans: {
                            name: "Oceans",
					        type: "agsBase",
					        layer: "Oceans",
					        visible: false
                        },
                        gray: {
                            name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
                        },
                        darkgray: {
                            name: "DarkGray",
					        type: "agsBase",
					        layer: "DarkGray",
					        visible: false
                        },
                        imagery: {
                            name: "Imagery",
					        type: "agsBase",
					        layer: "Imagery",
					        visible: false
                        },
                        shadedrelief: {
                            name: "ShadedRelief",
					        type: "agsBase",
					        layer: "ShadedRelief",
					        visible: false
                        },
                        terrain: {
                            name: "Terrain",
					        type: "agsBase",
					        layer: "Terrain",
					        visible: false
                        }
                    },
                },
            });
        }]);
        app.controller("LayersEsriClusteredLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                porland: {
	            	lat: 45.526,
	                lng: -122.667,
	                zoom: 15
	            },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Streets",
					        type: "agsBase",
					        layer: "Streets",
					        visible: false
				    	}
                    },
                    overlays: {
                        simple: {
                            name: "Simple",
                            type: "agsClustered",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                            visible: true
                        }
                    }
                }
            });
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
					        type: "agsDynamic",
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
					        type: "agsDynamic",
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
        app.controller("LayersEsriFeatureLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                layercontrol: {
                    icons: {
                      uncheck: "fa fa-toggle-off",
                      check: "fa fa-toggle-on"
                    }
                },
                porland: {
	            	lat: 45.526,
	                lng: -122.667,
	                zoom: 14
	            },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Streets",
					        type: "agsBase",
					        layer: "Streets",
					        visible: false
				    	}
                    },
                    overlays: {
                        simple: {
                            name: "Simple",
                            type: "agsFeature",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0",
                            visible: true,
                            group: "Test"
                        },
                        points: {
                            name: "Styling Points",
                            type: "agsFeature",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                pointToLayer: function (geojson, latlng) {
                                    if(geojson.properties.direction) {
                                        return L.marker(latlng, {
                                            icon: $scope.busIcons[geojson.properties.direction.toLowerCase()]
                                        });
                                    } else {
                                        return L.marker(latlng);
                                    }
                                }
                            },
                            group: "Test"
                        },
                        lines: {
                            name: "Styling Lines",
                            type: "agsFeature",
                            url: "http://services.arcgis.com/uCXeTVveQzP4IIcx/ArcGIS/rest/services/Bike_Routes/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                style: function (feature) {
                                    var c,o = 0.75;
                                    switch (feature.properties.BIKEMODE) {
                                        case "Low traffic through street":
                                            c = "#007D7D";
                                            break;
                                        case "Bike boulevard":
                                            c = "#00FF3C";
                                            break;
                                        case "Caution area":
                                            c = "#FF0000";
                                            break;
                                        case "Local multi-use path":
                                            c = "#00BEFF";
                                            break;
                                        case "Regional multi-use path":
                                            c = "#b1a9d0";
                                            break;
                                        case "Moderate traffic through street":
                                            c = "#FFEB00";
                                            break;
                                        case "Planned multi-use path":
                                            c = "#000000";
                                            break;
                                        case "Bike lane":
                                            c = "#328000";
                                            o = "0.70";
                                        break;
                                        case "High traffic through street":
                                            c = "#FFA500";
                                            break;
                                        case "Planned bike lane":
                                            c = "#000000";
                                            o = "1.0";
                                            break;
                                        default:
                                            c = "#C0C0C0";
                                    }
                                    return {color: c, opacity: o, weight: 5};
                                }
                            },
                            group: "Test"
                        },
                        polygons: {
                            name: "Styling Polygons",
                            type: "agsFeature",
                            url: "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Congressional_Districts/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                simplifyFactor: 0.5,
                                precision: 5,
                                style: function (feature) {
                                    if(feature.properties.PARTY === "Democrat"){
                                        return {color: "blue", weight: 2 };
                                    } else if(feature.properties.PARTY === "Republican"){
                                        return { color: "red", weight: 2 };
                                    } else {
                                        return { color: "white", weight: 2 };
                                    }
                                }
                            },
                            group: "Test"
                        },
                        group: {
                            name: "Grouped",
                            type: "group",
                            layerOptions: {
                                layers: [{
                                    name: "Simple",
                                    type: "agsFeature",
                                    url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0",
                                    visible: true,
                                    group: "Test"
                                }, {
                                    name: "Styling Points",
                                    type: "agsFeature",
                                    url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                                    visible: false,
                                    layerOptions: {
                                        pointToLayer: function (geojson, latlng) {
                                            if(geojson.properties.direction) {
                                                return L.marker(latlng, {
                                                    icon: $scope.busIcons[geojson.properties.direction.toLowerCase()]
                                                });
                                            } else {
                                                return L.marker(latlng);
                                            }
                                        }
                                    }
                                }]
                            }
                        }
                    }
                },
                busIcons: {
                    north: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-north.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-north@2x.png",
                        iconSize: [27, 31],
                        iconAnchor: [13.5, 17.5],
                        popupAnchor: [0, -11],
                    }),
                    south: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-south.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-south@2x.png",
                        iconSize: [27, 31],
                        iconAnchor: [13.5, 13.5],
                        popupAnchor: [0, -11],
                    }),
                    east: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-east.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-east@2x.png",
                        iconSize: [31, 27],
                        iconAnchor: [13.5, 17.5],
                        popupAnchor: [0, -11],
                    }),
                    west: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-west.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-west@2x.png",
                        iconSize: [31, 27],
                        iconAnchor: [17.5, 13.5],
                        popupAnchor: [0, -11],
                    })
                }
            });
        }]);
        app.controller("LayersEsriHeatmapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat:  40.706,
	                lng: -73.926,
	                zoom: 14
	            },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
				    	}
                    },
                    overlays: {
                        simple: {
                            name: "Simple",
                            type: "agsHeatmap",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Graffiti_Reports/FeatureServer/0",
                            visible: true,
                            layerOptions: {
                                radius: 14,
                                gradient: {
                                    0.2: "#ffffb2",
                                    0.4: "#fd8d3c",
                                    0.6: "#fd8d3c",
                                    0.8: "#f03b20",
                                    1: "#bd0026"
                                }
                            }
                        }
                    }
                }
            });
        }]);
        app.controller("LayersEsriImageLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat: 43.415,
	                lng: -124.228,
	                zoom: 13
	            },
                layers: {
                    baselayers: {
                        gray: {
                            name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
                        }
                    },
                    overlays: {
                        infrared: {
					    	name: "Infrared Imagery",
					        type: "agsImage",
					        url: "http://imagery.oregonexplorer.info/arcgis/rest/services/NAIP_2011/NAIP_2011_Dynamic/ImageServer",
					        visible: true,
                            layerOptions: {
                                bandIds: "3,0,1"
                            }
				    	}
                    }
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
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer",
					        visible: true,
					        layerOptions: {
				                opacity: 0.85,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	usa_social: {
					    	name: "USA Social Vulnerability Index",
					        type: "agsDynamic",
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
        app.controller("LayersEsriTiledMapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat: 30.70,
	                lng: -81.47,
	                zoom: 9
	            },
                layers: {
                    baselayers: {
				    	historic: {
					    	name: "Historic Topographic Maps",
					        type: "agsTiled",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
					        visible: false
				    	},
                        navigation: {
					    	name: "World Navigation Charts",
					        type: "agsTiled",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer",
					        visible: false
				    	}
                    }
                },
            });
        }]);
        app.controller("LayersHeatmapController", ["$scope", "$http", function($scope, $http) {
            var points = [];
            var heatmap = {
                name: 'Heat Map',
                type: 'heat',
                data: points,
                visible: true
            };
            $http.get("json/heat-points.json").success(function(data) {
                $scope.layers.overlays = {
                    heat: {
                        name: 'Heat Map',
                        type: 'heat',
                        data: data,
                        layerOptions: {
                            radius: 20,
                            blur: 10
                        },
                        visible: true
                    }
                };
            });
            angular.extend($scope, {
                center: {
                    lat: 37.774546,
                    lng: -122.433523,
                    zoom: 12
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
                    }
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
                defaults: {
                    scrollWheelZoom: false
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'Mapbox Streets',
                            url: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                showOnSelector: true,
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
                                showOnSelector: false,
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
        app.controller("LayersOverlayGeoJSONController", [ "$scope", '$http', function($scope, $http) {
            angular.extend($scope, {
                world: {
                    lat: 0,
                    lng: 0,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                        },
                    },
                    overlays:{}
                }
            });
        $http.get("json/countries.geo.json").success(function(data, status) {
            angular.extend($scope.layers.overlays, {
                countries: {
                    name:'World Country Boundaries',
                    type: 'geoJSONShape',
                    data: data,
                    visible: true,
                    layerOptions: {
                        style: {
                                color: '#00D',
                                fillColor: 'red',
                                weight: 2.0,
                                opacity: 0.6,
                                fillOpacity: 0.2
                        }
                    }
                }
            });
        });
        $http.get("json/major_cities.json").success(function(data, status) {
                    angular.extend($scope.layers.overlays, {
                        cities: {
                            name:'Major Cities (Awesome Markers)',
                            type: 'geoJSONAwesomeMarker',
                            data: data,
                            visible: true,
                            icon: {
                                icon: 'heart',
                                markerColor: 'red',
                                prefix: 'fa'
                            }
                        }
                    });
                });
        }]);
        app.controller("LayersOverlaysHideOnZoomOutController", [ "$scope", function($scope) {
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
            $scope.$watch('center.zoom', function(newValue){
                $scope.layers.overlays.wms.visible = newValue >= 4;
            });
        }]);
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
        app.controller('LayersOverlaysMarkersNestedController', ['$scope', 'leafletData','$timeout',
        function ($scope, leafletData, $timeout) {
            var _map;
            leafletData.getMap().then(function(map){
                _map = map;
            });
            angular.extend($scope, {
                eraseMarkers: function(){
                    $scope.markers = {
                        cars: {
                            m1: {
                                lat: 42.20133,
                                lng: 2.19110,
                                message: "I'm a car"
                            }
                        }
                    };
                    //$scope.$apply();
                    leafletData.getMarkers().then(function(lmarkers) {
                        $scope.hasM1 = _map.hasLayer(lmarkers.m1);
                        $scope.hasM2 = _map.hasLayer(lmarkers.m2);
                    });
                    $timeout(function(){
                        leafletData.getMarkers().then(function(lmarkers){
                            $scope.lMarkers = Object.keys(lmarkers);
                            $scope.hasM1 = _map.hasLayer(lmarkers.m1);
                            $scope.hasM2 = _map.hasLayer(lmarkers.m2);
                        });
                    },1000);
                },
                lMarkers:{},
                ripoll: {
                    lat: 42.20133,
                    lng: 2.19110,
                    zoom: 11
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
                        },
                        runners:{
                            name: 'Runners',
                            type: 'group',
                            visible: false
                        }
                    }
                },
                markers: {
                    cars: {
                        m1: {
                            lat: 42.20133,
                            lng: 2.19110,
                            message: "I'm a car"
                        },
                        m2: {
                            lat: 42.21133,
                            lng: 2.18110,
                            message: "I'm a car"
                        }
                    },
                    bikes: {
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
                        }
                    },
                    runners: {
                        m5: {
                            lat: 42.1,
                            lng: 2.16910
                        },
                        m6: {
                            lat: 42.15,
                            lng: 2.17110
                        }
                    }
                }
            });
        }]);
        app.controller('LayersOverlaysPathsController', [ '$scope', function($scope) {
            var markers = {
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
            };
            angular.extend($scope, {
                cen: {
                    lat: 53,
                    lng: -3,
                    zoom: 6
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
                        lines: {
                            name: 'Lines',
                            type: 'group',
                            visible: true
                        },
                        shapes: {
                            name: 'Shapes',
                            type: 'group',
                            visible: false
                        }
                    }
                },
                markers: markers,
                paths: {
                    p1: {
                        color: '#008000',
                        weight: 4,
                        latlngs: [ markers.London, markers.Manchester ],
                        layer: 'lines'
                    },
                    p2: {
                        weight: 3,
                        opacity: 0.5,
                        latlngs: [
                            [ markers.London, markers.Lincoln ],
                            [ markers.Manchester, markers.Worcester]
                        ],
                        type: 'multiPolyline',
                        layer: 'lines'
                    },
                    c1: {
                        weight: 2,
                        color: '#ff612f',
                        latlngs: markers.Northhampton,
                        radius: 10000,
                        type: 'circle',
                        layer: 'shapes'
                    },
                    c2: {
                        weight: 2,
                        color: '#ff612f',
                        latlngs: markers.Lincoln,
                        radius: 50,
                        type: 'circleMarker',
                        layer: 'shapes'
                    },
                    pg1: {
                        latlngs: [ markers.London, markers.Worcester, markers.Lincoln ],
                        stroke: false,
                        fillColor: '#ff69b4',
                        type: 'polygon',
                        layer: 'shapes'
                    },
                    pg2: {
                        weight: 1,
                        color: '#2e3974',
                        latlngs: [
                            [ markers.London, markers.Worcester, markers.Northhampton ],
                            [ markers.Manchester, markers.Lincoln, markers.York ]
                        ],
                        type: 'multiPolygon',
                        layer: 'shapes'
                    },
                    r1: {
                        latlngs: [ markers.Lincoln, markers.York ],
                        type: 'rectangle',
                        layer: 'shapes'
                    }
                }
            });
        } ]);
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
        app.controller("LayersRefreshOverlayEveryMinuteController", [ "$scope", "$interval", function($scope, $interval) {
            angular.extend($scope, {
                amberes: {
                    lat: 51.2,
                    lng: 4.4,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia3no0m'
                            }
                        }
                    },
                    overlays: {
                        traffic: {
                            name: "Traffic Jams",
                            type: "xyz",
                            url: "http://map.be-mobile.be/customer/mobileninja/nl/los/{z}/{x}/{y}.png",
                            visible: 1,
                            doRefresh: false
                        }
                    }
                }
            });
            var refreshIntervalInSeconds = 60;
            var actualSeconds = 0;
            $interval(function() {
                if (actualSeconds === refreshIntervalInSeconds) {
                    $scope.layers.overlays.traffic.doRefresh = true;
                    console.log("Overlay refreshed.")
                    actualSeconds = 0;
                } else {
                    console.log("Next update of overlay in " + (refreshIntervalInSeconds - actualSeconds) + " seconds.");
                    actualSeconds += 1;
                }
            }, 1000);
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
        // For more info take a look at https://github.com/kartena/Proj4Leaflet proj4leaflet.js
        app.controller('LayersWMSWithDifferentProjectionController', [ '$scope', '$location', function($scope) {
            $scope.map = {
                defaults: {
                    crs: new L.Proj.CRS('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
                    {
                        resolutions: [
                            8192, 4096, 2048, 1024, 512, 256, 128,
                            64, 32, 16, 8, 4, 2, 1, 0.5
                        ],
                        origin: [0, 0]
                    }),
                    continuousWorld: true
                },
                malmo: {
                    lat: 55.5902,
                    lng: 12.9956,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        malmo: {
                            name: 'Fishery',
                            type: 'wms',
                            url: 'http://geodatatest.havochvatten.se/geoservices/ows',
                            visible: true,
                            layerOptions: {
                                layers: 'hav-fisketsgeografier:havet-ostersjons-delomraden',
                                format: 'image/png',
                                maxZoom: 14,
                                minZoom: 0,
                                continuousWorld: true,
                                attribution: '&copy; <a href="https://www.havochvatten.se/kunskap-om-vara-vatten/kartor-och-geografisk-information/karttjanster.html">Havs- och vattenmyndigheten (Swedish Agency for Marine and Water Management)</a>'
                            }
                        }
                    }
                }
            };
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
                            type: 'webGLHeatmap',
                            data: dataPoints,
                            visible: true
                        }
                    }
                }
            });
        }]);
        app.controller("LayersYandexController", [ "$scope", function($scope) {
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
                      yandex: {
                        name: 'Yandex',
                        type: 'yandex',
                        layerOptions: {
                          layerType: 'map',
                        }
                      },
                      yandexTraffic: {
                        name: 'Yandex Traffic',
                        type: 'yandex',
                        layerOptions: {
                          layerType: 'map',
                          traffic: true,
                        }
                      }
                    }
                }
            });
        }]);
        app.controller("LegendEsriLegendServiceController", [ "$scope", function($scope) {
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
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer",
					        visible: true,
					        layerOptions: {
				                opacity: 0.85,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	usa_social: {
					    	name: "USA Social Vulnerability Index",
					        type: "agsDynamic",
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
        app.controller("LegendEsriMultilayerLegendServiceController", [ "$scope", function($scope) {
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
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer",
					        visible: true,
					        layerOptions: {
				                opacity: 0.85,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	usa_social: {
					    	name: "USA Social Vulnerability Index",
					        type: "agsDynamic",
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
        app.controller('MarkersAngularTemplateController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                data: {markers: {}}
            });
            $scope.addMarkers = function() {
                $scope.data.markers = {};
                angular.extend($scope.data, { angularInterpolatedMessage : "Angular interpolated message!"});
                angular.extend($scope.data, {
                    markers: {
                        m1: {
                            lat: 51.505,
                            lng: -0.09,
                            compileMessage: false,
                            message: "I'm a static marker",
                        },
                        m2: {
                            lat: 51,
                            lng: 0,
                            focus: true,
                            message: "<div ng-include src=\"'views/template.html'\"></div>",
                            draggable: true,
                        },
                        m3: {
                            lat: 51,
                            lng: -1,
                            getMessageScope: function () { return $scope; },
                            message: "<p>{{data.angularInterpolatedMessage}}</p>",
                            compileMessage: true
                        }
                    }
                });
            };
            $scope.removeMarkers = function() {
                $scope.data.markers = {};
            }
            $scope.addMarkers();
        } ]);
        app.controller('ViewController', ['$scope', function($scope) {
            $scope.user = {}
            $scope.greet = function(user) {
              alert('hello ' + user.name)
            }
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
        app.controller("MarkersClustering10000MarkersController", [ "$scope", "$http", function($scope, $http) {
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
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });
            $http.get("json/realworld.10000.json").success(function(data) {
                $scope.markers = addressPointsToMarkers(data);
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
        app.controller("MarkersEventsController", [ "$scope", "leafletMarkerEvents", "leafletLogger", function($scope, leafletMarkerEvents, leafletLogger) {
          // leafletLogger.currentLevel =  leafletLogger.LEVELS.debug;
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
                    enable: leafletMarkerEvents.getAvailableEvents(),
                }
            };
            $scope.eventDetected = "No events yet...";
            var markerEvents = leafletMarkerEvents.getAvailableEvents();
            for (var k in markerEvents){
                var eventName = 'leafletDirectiveMarker.myMap.' + markerEvents[k];
                $scope.$on(eventName, function(event, args){
                    $scope.eventDetected = event.name;
                });
            }
        }]);
        app.controller("MarkersEventsWithIDController", [ "$scope", "leafletMarkerEvents", function($scope, leafletMarkerEvents) {
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
                    enable: leafletMarkerEvents.getAvailableEvents(),
                }
            };
            $scope.eventDetected = "No events yet...";
            var markerEvents = leafletMarkerEvents.getAvailableEvents();
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
                        icon: {},
                    },
                },
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
                },
                awesomeMarkerIcon: {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                vectorMarkerIcon: {
                    type: 'vectorMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                makiMarkerIcon: {
                    type: 'makiMarker',
                    icon: 'beer',
                    color: '#f00',
                    size: "l"
                },
                extraMarkerIcon: {
                    type: 'extraMarker',
                    icon: 'fa-star',
                    markerColor: '#f00',
                    prefix: 'fa',
                    shape: 'circle'
                }
            });
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
                    }
                }
            });
        } ]);
        app.controller("MarkersModalMarkerClusterController", ['$scope', 'leafletData', function($scope, leafletData) {
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
                markers: {
                    m1: {
                        lat: 52.229676,
                        lng: 21.012229,
                        draggable: false,
                        group: 'markers'
                    },
                    m2: {
                        lat: 52.219081,
                        lng: 21.025386,
                        draggable: false,
                        group: 'markers'
                    }
                }
            });
            var map;
            leafletData.getMap().then(function(lfMap) {
                map = lfMap;
            });
            $scope.showModal = function() {
                $('.ui.modal').modal('show');
                map.invalidateSize();
            };
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
                events: {
                    markers: {
                      enable: [ 'dragend' ]
                      //logic: 'emit'
                    }
                }
            });
            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                console.log('hola');
                $scope.markers.m1.lat = args.model.lat;
                $scope.markers.m1.lng = args.model.lng;
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
            var mainMarker = {
                lat: 51,
                lng: 0,
                focus: true,
                message: "Hey, drag me if you want",
                draggable: true
            };
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    mainMarker: angular.copy(mainMarker)
                },
                position: {
                    lat: 51,
                    lng: 0
                },
                events: { // or just {} //all events
                    markers:{
                      enable: [ 'dragend' ]
                      //logic: 'emit'
                    }
                }
            });
            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.position.lat = args.model.lat;
                $scope.position.lng = args.model.lng;
            });
        } ]);
        app.controller("MarkersTwoMapsEventsController", ['$scope', 'leafletData', function ($scope, $modalInstance, leafletData) {
            var markers = [];
            markers.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false
            });
            markers.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false
            });
            angular.extend($scope, {
                defaults: {
                    maxZoom: 18,
                    minZoom: 0,
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: [],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [ 'click' ],
                        logic: 'emit'
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
                                attribution: '© OpenStreetMap contributors',
                                continuousWorld: true
                            }
                        }
                    }
                },
                center: {
                    zoom: 13,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers: markers
            });
            var markers2 = [];
            markers2.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false
            });
            markers2.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false
            });
            angular.extend($scope, {
                defaults2: {
                    maxZoom: 18,
                    minZoom: 0,
                    scrollWheelZoom: false
                },
                events2: {
                    map: {
                        enable: [],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [ 'click' ],
                        logic: 'emit'
                    }
                },
                layers2: {
                    baselayers: {
                        mapbox: {
                            name: 'Mapbox Terrain',
                            url: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                center2: {
                    zoom: 13,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers2: markers2
            });
            $scope.$on('leafletDirectiveMarker.click', function (e, args) {
                console.log(args);
            });
        }]);
        app.controller('MixedGeoJSONEventsController', [ "$scope", "$http", function($scope, $http) {
            $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, leafletPayload) {
                countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
            });
            $scope.$on("leafletDirectiveGeoJson.click", function(ev, leafletPayload) {
                countryClick(leafletPayload.leafletObject, leafletPayload.leafletEvent);
            });
            var continentProperties= {
                    "009": {
                            name: 'Oceania',
                            colors: [ '#CC0066', '#993366', '#990066', '#CC3399', '#CC6699' ]
                    },
                    "019": {
                            name: 'America',
                            colors: [ '#006699', '#336666', '#003366', '#3399CC', '#6699CC' ]
                    },
                    "150": {
                            name: 'Europe',
                            colors: [ '#FF0000', '#CC3333', '#990000', '#FF3333', '#FF6666' ]
                    },
                    "002": {
                            name: 'Africa',
                            colors: [ '#00CC00', '#339933', '#009900', '#33FF33', '#66FF66' ]
                    },
                    "142": {
                            name: 'Asia',
                            colors: [ '#FFCC00', '#CC9933', '#999900', '#FFCC33', '#FFCC66' ]
                    },
            };
            angular.extend($scope, {
                center: {
                    lat: 40.8471,
                    lng: 14.0625,
                    zoom: 2
                },
                legend: {
                    colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
                    labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
                }
            });
            function countryClick(country, event) {
                country = country.feature;
                console.log(country.properties.name);
            }
            // Get a country paint color from the continents array of colors
            function getColor(country) {
                if (!country || !country["region-code"]) {
                    return "#FFF";
                }
                var colors = continentProperties[country["region-code"]].colors;
                var index = country["alpha-3"].charCodeAt(0) % colors.length ;
                return colors[index];
            }
            function style(feature) {
                return {
                    fillColor: getColor($scope.countries[feature.id]),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
            // Mouse over function, called from the Leaflet Map Events
            function countryMouseover(feature, leafletEvent) {
                var layer = leafletEvent.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    fillColor: 'white'
                });
                layer.bringToFront();
                $scope.selectedCountry = feature;
                console.log(feature);
            }
            // Get the countries data from a JSON
            $http.get("json/all.json").success(function(data, status) {
                // Put the countries on an associative array
                $scope.countries = {};
                for (var i=0; i< data.length; i++) {
                    var country = data[i];
                    $scope.countries[country['alpha-3']] = country;
                }
                // Get the countries geojson data from a JSON
                $http.get("json/countries.geo.json").success(function(data, status) {
                    angular.extend($scope, {
                        geojson: {
                            data: data,
                            style: style,
                            resetStyleOnMouseout: true
                        },
                        selectedCountry: {}
                    });
                });
            });
        }]);
        app.controller('MixedGeoJSONEventsWithIDController', [ "$scope", "$http", function($scope, $http) {
            $scope.$on("leafletDirectiveGeoJson.myMap.mouseover", function(ev, leafletPayload) {
                countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
            });
            $scope.$on("leafletDirectiveGeoJson.myMap.click", function(ev, leafletPayload) {
                countryClick(leafletPayload.leafletObject, leafletPayload.leafletEvent);
            });
            var continentProperties= {
                    "009": {
                            name: 'Oceania',
                            colors: [ '#CC0066', '#993366', '#990066', '#CC3399', '#CC6699' ]
                    },
                    "019": {
                            name: 'America',
                            colors: [ '#006699', '#336666', '#003366', '#3399CC', '#6699CC' ]
                    },
                    "150": {
                            name: 'Europe',
                            colors: [ '#FF0000', '#CC3333', '#990000', '#FF3333', '#FF6666' ]
                    },
                    "002": {
                            name: 'Africa',
                            colors: [ '#00CC00', '#339933', '#009900', '#33FF33', '#66FF66' ]
                    },
                    "142": {
                            name: 'Asia',
                            colors: [ '#FFCC00', '#CC9933', '#999900', '#FFCC33', '#FFCC66' ]
                    },
            };
            angular.extend($scope, {
                center: {
                    lat: 40.8471,
                    lng: 14.0625,
                    zoom: 2
                },
                legend: {
                    colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
                    labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
                }
            });
            function countryClick(country, event) {
                country = country.feature;
                console.log(country.properties.name);
            }
            // Get a country paint color from the continents array of colors
            function getColor(country) {
                if (!country || !country["region-code"]) {
                    return "#FFF";
                }
                var colors = continentProperties[country["region-code"]].colors;
                var index = country["alpha-3"].charCodeAt(0) % colors.length ;
                return colors[index];
            }
            function style(feature) {
                return {
                    fillColor: getColor($scope.countries[feature.id]),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
            // Mouse over function, called from the Leaflet Map Events
            function countryMouseover(feature, leafletEvent) {
                var layer = leafletEvent.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    fillColor: 'white'
                });
                layer.bringToFront();
                $scope.selectedCountry = feature;
                console.log(feature);
            }
            // Get the countries data from a JSON
            $http.get("json/all.json").success(function(data, status) {
                // Put the countries on an associative array
                $scope.countries = {};
                for (var i=0; i< data.length; i++) {
                    var country = data[i];
                    $scope.countries[country['alpha-3']] = country;
                }
                // Get the countries geojson data from a JSON
                $http.get("json/countries.geo.json").success(function(data, status) {
                    angular.extend($scope, {
                        geojson: {
                            data: data,
                            style: style,
                            resetStyleOnMouseout: true
                        },
                        selectedCountry: {}
                    });
                });
            });
        }]);
        app.controller("MixedLayersOverlaysGeoJSONController", ["$scope", function($scope){
            angular.extend($scope, {
                sanfrancisco: {
                    lat: 37.79,
                    lng: -122.4,
                    zoom: 17
                },
                defaults: {
                    scrollWheelZoom: false
                },
                layers:{
                    baselayers: {
                        osm:{
                            name: "OpenStreetMap (XYZ)",
                            type: "xyz",
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                            }
                        }
                    }
                    ,
                    overlays: {
                        buildings: {
                            name:'Buildings',
                            type: 'geoJSON',
                            url:'http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json',
                            layerOptions: {
                                style: {
                                    "color": "#00D",
                                    "fillColor": "#00D",
                                    "weight": 1.0,
                                    "opacity": 0.6,
                                    "fillOpacity": .2
                                }
                            },
                            pluginOptions:{
                                cliptiles: true
                            }
                        },
                        Roads:{
                            name:'Roads',
                            type: 'geoJSON',
                            url: 'http://tile.openstreetmap.us/vectiles-skeletron/{z}/{x}/{y}.json',
                            layerOptions: {
                                style: {
                                    "color": "#DD0000 ",
                                    "fillColor": "#DD0000",
                                    "weight": 1.0,
                                    "fillOpacity": .4
                                }
                            },
                            pluginOptions:{
                                cliptiles: false
                            }
                        }
                    }
                }
            })
        }]);
    app.controller('MixedMOverlaysMarkersNestedNoWatchController', function ($scope, leafletData, $timeout) {
        var _clonedMarkers;
        $timeout(function () {
            //should do nothing (not watched) and only see one destroy
            _clonedMarkers = angular.extend({},$scope.markers);
            $scope.markers = {};
        },1000);
        $timeout(function () {
            leafletData.getDirectiveControls().then(function (controls) {
                //move all markers by a few decimal points
                for (var layer in _clonedMarkers) {
                    var markerSet = _clonedMarkers[layer];
                    for (var markerName in markerSet) {
                        var marker = markerSet[markerName];
                        marker.lat += .05;
                    }
                }
                //force manual update
                $scope.markers = _clonedMarkers;
                controls.markers.create($scope.markers);
            });
        }, 4000);
        angular.extend($scope, {
            markersWatchOptions: {
                doWatch: false,
                isDeep: false,
                individual: {
                    doWatch: false,
                    isDeep: false
                }
            },
            center: {
                lat: 42.20133,
                lng: 2.19110,
                zoom: 11
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
                    },
                    runners: {
                        name: 'Runners',
                        type: 'group',
                        visible: false
                    }
                }
            },
            markers: {
                cars: {
                    m1: {
                        lat: 42.20133,
                        lng: 2.19110,
                        message: "I'm a car"
                    },
                    m2: {
                        lat: 42.21133,
                        lng: 2.18110,
                        message: "I'm a car"
                    }
                },
                bikes: {
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
                    }
                },
                runners: {
                    m5: {
                        lat: 42.1,
                        lng: 2.16910
                    },
                    m6: {
                        lat: 42.15,
                        lng: 2.17110
                    }
                }
            }
        });
    });
        app.controller("MixedMapboxTilesGeojsonController", [ "$scope", "$http", function($scope, $http) {
            angular.extend($scope, {
                center: {
                    lat: -33.8979173,
                    lng: 151.2323598,
                    zoom: 14
                },
                tiles: {
                    name: 'Mapbox Park',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ',
                        mapid: 'feelcreative.llm8dpdk'
                    }
                },
                geojson: {}
            });
            $http.get("https://a.tiles.mapbox.com/v4/feelcreative.llm8dpdk/features.json?access_token=pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ").success(function(data) {
                $scope.geojson.data = data;
                console.log(data);
            });
        }]);
    app.controller("MixedMarkersNestedEventsController", ["$scope", "leafletEvents", function ($scope, leafletEvents) {
        $scope.map = {
            show: true
        };
        $scope.layers = {
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
                london: {
                    name: 'London',
                    type: 'group',
                    visible: true
                }
            }
        };
        $scope.center = {
            lat: 51.505,
            lng: -0.09,
            zoom: 8
        };
        $scope.markers = {
            london: {
                1: {
                    lat: 51.505,
                    lng: -0.09,
                    draggable: true,
                    focus: true
                }
            }
        };
        $scope.events = {
            markers: {
                enable: leafletEvents.getAvailableMarkerEvents()
            }
        };
        $scope.eventDetected = "No events yet...";
        var markerEvents = leafletEvents.getAvailableMarkerEvents();
        for (var k in markerEvents) {
            var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
            $scope.$on(eventName, function (event, args) {
                $scope.eventDetected = event.name;
                $scope.args = {
                    layerName: args.layerName,
                    model: args.model,
                    modelName: args.modelName
                };
            });
        }
    }]);
        app.controller("PathEventsController", function($scope, leafletLogger) {
            // leafletLogger.currentLevel = leafletLogger.LEVELS.debug;
            var paths = {};
            $scope.clicked = 0;
            var marylandIslands = {
                'Fort Carroll': {
                    lat: 39.214766,
                    lng: -76.519003
                },
                    'Gibson Island': {
                    lat: 39.077642,
                    lng: -76.433344
                },
                    'Solomons Island': {
                    lat: 38.320145,
                    lng: -76.457334
                }
            };
            angular.forEach(marylandIslands, function (v, k) {
                paths[k] = {
                    type: "circleMarker",
                    latlngs: v,
                    stroke: false,
                    fillColor: "#00FFFF",
                    fillOpacity: 0.7,
                    radius: 10,
                    clickable: true
                };
            });
            angular.extend($scope, {
                center: {
                    lat:38.976492,
                    lng:-76.49231,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                events: {
                    path: {
                        enable: [ 'click', 'mouseover' ]
                    }
                },
                paths: paths
            });
            $scope.$on('leafletDirectivePath.myMap.click', function (event) {
                $scope.clicked++;
            });
            $scope.$on('leafletDirectivePath.myMap.mouseover', function (event, path) {
                $scope.mouseover = path.modelName;
            });
        });
        app.controller("PathEventsWithIDController", function($scope, leafletLogger) {
            // leafletLogger.currentLevel = leafletLogger.LEVELS.debug;
            var paths = {};
            $scope.clicked = 0;
            var marylandIslands = {
                'Fort Carroll': {
                    lat: 39.214766,
                    lng: -76.519003
                },
                    'Gibson Island': {
                    lat: 39.077642,
                    lng: -76.433344
                },
                    'Solomons Island': {
                    lat: 38.320145,
                    lng: -76.457334
                }
            };
            angular.forEach(marylandIslands, function (v, k) {
                paths[k] = {
                    type: "circleMarker",
                    latlngs: v,
                    stroke: false,
                    fillColor: "#00FFFF",
                    fillOpacity: 0.7,
                    radius: 10,
                    clickable: true
                };
            });
            angular.extend($scope, {
                center: {
                    lat:38.976492,
                    lng:-76.49231,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                events: {
                    path: {
                        enable: [ 'click', 'mouseover' ]
                    }
                },
                paths: paths
            });
            $scope.$on('leafletDirectivePath.click', function (event) {
                $scope.clicked++;
            });
            $scope.$on('leafletDirectivePath.mouseover', function (event, path) {
                $scope.mouseover = path.modelName;
            });
        });
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
                };
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
                };
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
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 0,
                            repeat: 10,
                            symbol: L.Symbol.dash({pixelSize: 0})
                        }
                    ];
                } else if (type === 'slash') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})
                        }
                    ];
                } else if (type === 'slashdot') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})
                        },
                        {
                            offset: 0,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 0})
                        }
                    ];
                } else if (type === 'arrow') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 18, pathOptions: {color: '#f00', weight: 4}})
                        },
                        {
                            offset: '10%',
                            repeat: 25,
                            symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}})
                        }
                    ];
                }
            };
        } ]);}(angular));