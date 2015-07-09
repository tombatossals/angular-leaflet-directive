(function (angular) {
var app = angular.module('app', ['ngNewRouter', 'leaflet-directive', 'hljs', 'app.home']);
var controller = app.controller('AppController', [ '$router', AppController ]);

AppController.$routeConfig = [
    { path: '/', component: 'home' }
];

function AppController ($router) {}

app.controller('BasicCenterController', [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        }
    });
}]);

app.controller("HeaderController", [ '$scope', '$location', function($scope, $location) {

    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 8
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
}]);

angular.module('app.home', []).controller('HomeController', [function () {
    this.name = 'Friend';
 }]);
})(window.angular);