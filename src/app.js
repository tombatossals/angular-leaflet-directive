    var app = angular.module("MainPage", ['ngRoute', 'leaflet-directive', 'hljs']);
    app.value('$anchorScroll', angular.noop);
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html'
        }).when('/getting-started', {
            templateUrl: 'partials/main.html'
        }).when('/howto-extend', {
            templateUrl: 'partials/howto-extend.html'
        }).when('/examples/:example', {
            templateUrl: 'partials/examples.html'
        });
        $locationProvider.hashPrefix('!');
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

    app.controller("SimpleMapController", [ '$scope', function($scope) {
        angular.extend($scope, {
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
