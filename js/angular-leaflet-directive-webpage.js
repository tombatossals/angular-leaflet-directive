(function (angular) {
var app = angular.module("mainPage", ['ngRoute', 'leaflet-directive', 'hljs']);
app.value('$anchorScroll', angular.noop);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/main.html'
    }).when('/getting-started', {
        templateUrl: 'partials/main.html'
    }).when('/howto-extend', {
        templateUrl: 'partials/extend.html'
    }).when('/examples/:example', {
        templateUrl: 'partials/examples.html'
    });
    $locationProvider.hashPrefix('!');
}]);

app.controller("CenterController", [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("CustomParametersController", [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 8
        },
        defaults: {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true,
            },
            scrollWheelZoom: false
        }
    });
}]);

app.controller("CustomizedMarkersController", [ '$scope', function($scope) {
    var local_icons = {
        leaf_icon: L.icon({
            iconUrl: 'examples/img/leaf-green.png',
            shadowUrl: 'examples/img/leaf-shadow.png',
             iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        }),
        default_icon: L.icon({
            iconUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
            shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 40],
            popupAnchor: [0, -40],
            shadowSize: [41, 41],
            shadowAnchor: [12, 40]
        }),
        div_icon: L.divIcon({
            iconSize: [230, 0],
            html: 'Using <strong>Bold text as an icon</strong>: Lisbon',
            popupAnchor:  [0, 0]
        }),
        object_icon: {
            iconUrl: 'http://leafletjs.com/docs/images/leaf-orange.png',
            shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62]
        }
    };

    angular.extend($scope, {
        icons: local_icons
    });

    angular.extend($scope, {
        lisbon: {
            lat: 38.716,
            lng: -9.13,
            zoom: 8
        },
        markers: {
            m1: {
                lat: 38.716,
                lng: -9.13,
                message: "I'm a static marker",
                icon: local_icons.default_icon,
            },
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("DraggingMarkersController", [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 6
        },
        defaults: {
            scrollWheelZoom: false
        },
        markers: {
            Madrid: {
                lat: 40.095,
                lng: -3.823,
                message: "This is Madrid. But you can drag me to another position",
                focus: true,
                draggable: true
            },
            Barcelona: {
                lat: 41.38,
                lng: 2.18,
                message: "This is Barcelona. You can't drag me",
                focus: false,
                draggable: false
            }
        }
    });
}]);

app.controller("EventsController", [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            lat: 52.374004,
            lng: 4.890359,
            zoom: 7
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.eventDetected = "No events yet...";

    $scope.$on('leafletDirectiveMap.zoomstart', function(event){
        $scope.eventDetected = "ZoomStart";
    });

    $scope.$on('leafletDirectiveMap.drag', function(event){
        $scope.eventDetected = "Drag";
    });

    $scope.$on('leafletDirectiveMap.click', function(event){
        $scope.eventDetected = "Click";
    });

    $scope.$on('leafletDirectiveMap.mousemove', function(event){
        $scope.eventDetected = "MouseMove";
    });
}]);

app.controller("GeoJSONController", [ '$scope', '$http', function($scope, $http) {
    angular.extend($scope, {
        japan: {
            lat: 37.26,
            lng: 138.86,
            zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    // Get the countries geojson data from a JSON
    $http.get("examples/json/JPN.geo.json").success(function(data, status) {
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
}]);

app.controller("GoogleMapsController", [ "$scope", function($scope) {
    angular.extend($scope, {
        berlin: {
            lat: 52.52,
            lng: 13.40,
            zoom: 14
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
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("HeaderController", [ '$scope', '$location', function($scope, $location) {
    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 3
        },
        defaults: {
            scrollWheelZoom: false,
            attributionControl: false,
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            }
        }
    });

    $scope.$on('leafletDirectiveMap.click', function(event){
        $location.path("/");
    });
}]);

app.controller("LegendController", [ '$scope', function($scope) {
    angular.extend($scope, {
        amsterdam: {
            lat: 52.35,
            lng: 4.91,
            zoom: 12
        },
        legend: {
            position: 'bottomleft',
            colors: [ '#ff0000', '#28c9ff', '#0000ff', '#ecf386' ],
            labels: [ 'National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway' ]
        },
        defaults: {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            scrollWheelZoom: false
        }
    });
}]);

app.controller("MainController", [ '$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $location) {
    $scope.$watch(function() { return $location.path(); }, function(value) {
        if (!value) {
            return;
        }
        var section = value.match(/^\/([^\/])*/);
        if (section.length > 0) {
            $scope.activeTab = section[0].replace(/^\//, "");
        }
    });

    $scope.$watch(function() { return $routeParams.example ; }, function(value) {
        $scope.exampleTab = $routeParams.example;
    });
}]);

app.controller("MainMarkerController", [ '$scope', function($scope) {
    angular.extend($scope, {
        osloCenter: {
            lat: 59.91,
            lng: 10.75,
            zoom: 12
        },
        osloMarker: {
            lat: 59.91,
            lng: 10.75,
            message: "I want to travel here!",
            focus: true,
            draggable: false
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("MenuController", [ '$scope', '$location', function($scope, $location) {

    $scope.goExample = function (example) {
        $location.path('/examples/' + example);
    };

    $scope.menuItems = [
        {
            key: 'simple-map',
            description: 'Simple Map'
        },
        {
            key: 'center',
            description: 'Center'
        },
        {
            key: 'custom-parameters',
            description: 'Custom Parameters'
        },
        {
            key: 'events',
            description: 'Events'
        },
        {
            key: 'main-marker',
            description: 'Main Marker'
        },
        {
            key: 'dragging-markers',
            description: 'Dragging Markers'
        },
        {
            key: 'path',
            description: 'Path'
        },
        {
            key: 'geojson',
            description: 'GeoJSON'
        },
        {
            key: 'legend',
            description: 'Legend'
        },
        {
            key: 'customized-markers',
            description: 'Customized markers'
        },
        {
            key: 'google-maps',
            description: 'Google Maps'
        },
    ];
}]);

app.controller("MultiLayerMapController", [ '$scope', '$http', function($scope, $http) {
    var tiles = {
        osm: {
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        cycle: {
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
        },
        night: {
            url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
            options: {
                key: '007b9471b4c74da4a6ec7ff43552b16f',
                styleId: 999
            }
        },
        tourist: {
            url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
            options: {
                key: '007b9471b4c74da4a6ec7ff43552b16f',
                styleId: 7
            }
        }
    };

    $scope.setBaseLayer = function(layerKey) {
        var tile = tiles[layerKey];
        var url = tile.url;

        if (tile.hasOwnProperty("options")) {
            for (var key in tile.options) {
                if (tile.options.hasOwnProperty(key)) {
                    url = url.replace("{" + key + "}", tile.options[key]);
                }
            }
        }
        $scope.tiles.url = url;
    };

    var osm;
    osm = angular.copy(tiles.osm, osm);
    angular.extend($scope, {
        center: {
            lat: 40.8471,
            lng: 14.0625,
            zoom: 3
        },
        defaults: {
            scrollWheelZoom: false
        },
        tiles: osm
    });
} ]);

app.controller("PathController", [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            lat: 48,
            lng: 4,
            zoom: 4
        },
        paths: {
            p1: {
                color: '#008000',
                weight: 8,
                latlngs: [
                    { lat: 51.50, lng: -0.082 },
                    { lat: 48.83, lng: 2.37 },
                    { lat: 41.91, lng: 12.48 }
                ],
            }
        },
        markers: {
            london: {
                lat: 51.50,
                lng: -0.082,
                icon: L.icon({
                    iconUrl: 'examples/img/100x100_PNG/bigben100.png',
                    iconSize: [80, 80],
                    iconAnchor: [40, 80],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                })
            },
            paris: {
                lat: 48.83,
                lng: 2.37,
                icon: L.icon({
                    iconUrl: 'examples/img/100x100_PNG/eiffel100.png',
                    iconSize: [80, 80],
                    iconAnchor: [40, 60],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                })
            },
            roma: {
                lat: 41.91,
                lng: 12.48,
                icon: L.icon({
                    iconUrl: 'examples/img/100x100_PNG/colosseum100.png',
                    iconSize: [60, 60],
                    iconAnchor: [30, 40],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                })
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("SimpleMapController", [ '$scope', function($scope) {
    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);

app.controller("WorldMapController", [ '$scope', '$http', '$log', function($scope, $http, $log) {

    $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, leafletEvent) {
        countryMouseover(leafletEvent);
    });

    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
        countryClick(featureSelected, leafletEvent);
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
        defaults: {
            scrollWheelZoom: false
        },
        legend: {
            colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
            labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
        }
    });

    function countryClick(country, event) {
        $log.info(country.properties.name);
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
    function countryMouseover(leafletEvent) {
        var layer = leafletEvent.target;
        layer.setStyle({
            weight: 2,
            color: '#666',
            fillColor: 'white'
        });
        layer.bringToFront();
    }

    // Get the countries data from a JSON
    $http.get("examples/json/all.json").success(function(data, status) {

        // Put the countries on an associative array
        $scope.countries = {};
        for (var i=0; i< data.length; i++) {
            var country = data[i];
            $scope.countries[country['alpha-3']] = country;
        }

        // Get the countries geojson data from a JSON
        $http.get("examples/json/countries.geo.json").success(function(data, status) {
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: style,
                    resetStyleOnMouseout: true
                }
            });
        });
    });
}]);
})(window.angular);