(function (angular) {

    var app = angular.module("MainPage", ['ngRoute', 'leaflet-directive', 'hljs']);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html'
        }).when('/how-to-collaborate', {
            templateUrl: 'partials/how-to-use.html'
        }).when('/basic-examples/:example', {
            templateUrl: 'partials/basic-examples.html'
        }).when('/advanced-examples', {
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

    app.controller("DraggingMarkerController", [ '$scope', function($scope) {
        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 4
            },
            markers: {
                Madrid: {
                    lat: 40.095,
                    lng: -3.823,
                    message: "Drag me to another position",
                    focus: true,
                    draggable: true
                }
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
