var app = angular.module("MainPage", ['ngRoute', 'leaflet-directive', 'hljs']);
app.value('$anchorScroll', angular.noop);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/main.html'
    }).when('/getting-started', {
        templateUrl: 'partials/main.html'
    }).when('/howto-extend', {
        templateUrl: 'partials/howto-extend.html'
    }).when('/examples/simple-map', {
        templateUrl: 'partials/examples/simple-map.html'
    }).when('/examples/center', {
        templateUrl: 'partials/examples/center.html'
    }).when('/examples/custom-parameters', {
        templateUrl: 'partials/examples/custom-parameters.html'
    }).when('/examples/events', {
        templateUrl: 'partials/examples/events.html'
    }).when('/examples/main-marker', {
        templateUrl: 'partials/examples/main-marker.html'
    }).when('/examples/dragging-markers', {
        templateUrl: 'partials/examples/dragging-markers.html'
    }).when('/examples/path', {
        templateUrl: 'partials/examples/path.html'
    }).when('/examples/geojson', {
        templateUrl: 'partials/examples/geojson.html'
    }).when('/examples/legend', {
        templateUrl: 'partials/examples/legend.html'
    }).when('/examples/customized-markers', {
        templateUrl: 'partials/examples/customized-markers.html'
    }).when('/examples/google-maps', {
        templateUrl: 'partials/examples/google-maps.html'
    });
    $locationProvider.hashPrefix('!');
}]);
