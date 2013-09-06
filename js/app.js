(function (angular) {

    var app = angular.module("MainPage", ['ngRoute', 'leaflet-directive', 'hljs']);
    app.value('$anchorScroll', angular.noop);
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html'
        }).when('/getting-started', {
            templateUrl: 'partials/main.html'
        }).when('/how-to-collaborate', {
            templateUrl: 'partials/how-to-collaborate.html'
        }).when('/basic-examples/:example', {
            templateUrl: 'partials/basic-examples.html'
        }).when('/advanced-examples/:example', {
            templateUrl: 'partials/advanced-examples.html'
        });
    }]);

    app.controller("MainController", [ '$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $location) {
        $scope.$watch(function() { return $location.path(); }, function(value) {
            if (!value) return;
            var section = value.match(/^\/([^\/])*/);
            if (section.length > 0) {
                $scope.activeTab = section[0].replace(/^\//, "");
            }
        });

        $scope.$watch(function() { return $routeParams.example ; }, function(value) {
            $scope.exampleTab = $routeParams.example;
        });

        $scope.go = function(path) {
            $location.path(path);
        };

    }]);

    app.controller("HeaderController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 3
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
    }]);

    app.controller("CenterController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 4
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

    app.controller("DraggingMarkersController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 6
            },
            markers: {
                Madrid: {
                    lat: 40.095,
                    lng: -3.823,
                    message: "This is Madrid. Drag me to another position",
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

    app.controller("MainMarkerController", [ '$scope', function($scope) {
        angular.extend($scope, {
            oslo: {
                lat: 59.91,
                lng: 10.75,
                zoom: 12
            },
            marker: {
                lat: 59.91,
                lng: 10.75,
                message: "I want to travel here!",
                focus: true,
                draggable: false
            }
        });
    }]);

    app.controller("EventsController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 52.374004,
                lng: 4.890359,
                zoom: 7
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

    app.controller("CustomizeMarkersController", [ '$scope', function($scope) {
        var local_icons = {
            leaf_icon: L.icon({
                iconUrl: 'img/leaf-green.png',
                shadowUrl: 'img/leaf-shadow.png',
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
                iconSize: [200, 0],
                html: 'Using <strong>Bold text as an icon</strong>:',
                popupAnchor:  [0, 0]
            }),
            object_icon: {
                iconUrl: 'http://leafletjs.com/docs/images/leaf-orange.png',
                shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
                iconSize:     [38, 95],
                shadowSize:   [50, 64],
                iconAnchor:   [22, 94],
                shadowAnchor: [4, 62]
            },
        }

        angular.extend($scope, {
            icons: local_icons
        });

        angular.extend($scope, {
            lisboa: {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            },
            markers: {
                m1: {
                    lat: 51.505,
                    lng: -0.09,
                    message: "I'm a static marker",
                    icon: local_icons.default_icon,
                },
            }
        });
    }]);

    app.controller("PathController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 53,
                lng: -3,
                zoom: 6
            },
            paths: {
                p1: {
                    color: '#008000',
                    weight: 3,
                    latlngs: [
                        { lat: 51.50, lng: -0.082 },
                        { lat: 51.751, lng: -1.255 },
                        { lat: 53.48, lng: -2.24 },
                    ],
                }
            },
        });
    }]);

    app.controller("LegendController", [ '$scope', function($scope) {
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
    }]);

})(window.angular);
