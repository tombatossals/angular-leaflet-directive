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
        templateUrl: 'partials/examples.html',
        reloadOnSearch: false
    });
    $locationProvider.hashPrefix('!');
}]);
