(function (angular) {
var app = angular.module('app', ['ngNewRouter', 'app.home']);
var controller = app.controller('AppController', [ '$router', AppController ]);

AppController.$routeConfig = [
    { path: '/', component: 'home' }
];

function AppController ($router) {}

var home = angular.module('app.home', ['leaflet-directive', 'hljs']);

home.controller('HomeController', [ '$scope', '$location', HomeController ]);
home.controller('BasicCenterController', [ '$scope', BasicCenterController ]);

function HomeController($location) {
    angular.extend(this, {
        center: {
            lat: 40.095,
            lng: 23.823,
            zoom: 4
        },
        tiles: {
            name: 'Mapbox Outdoors',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia3no0m'
            }
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
}

function BasicCenterController($scope) {
    angular.extend($scope, {
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}
})(window.angular);