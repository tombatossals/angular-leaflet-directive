(function (angular) {
var app = angular.module('app', ['ngNewRouter', 'app.home']);
var controller = app.controller('AppController', [ '$router', '$scope', AppController ]);

AppController.$routeConfig = [
    { path: '/', redirectTo: '/home' },
    { path: '/home', component: 'home' },
    { path: '/documentation', component: 'documentation' },
    { path: '/examples', component: 'examples' },
    { path: '/extend', component: 'extend' }
];

function AppController($location, $scope) {
    var scope = this;
    var locationMarkers = {
        home: {
            lat: 41.9,
            lng: 12.48,
            zoom: 4,
            name: 'Rome'
        },
        documentation: {
            lat: 48.85,
            lng: 2.29,
            zoom: 3,
            name: 'Paris'
        }
    };

    function getMapData(loc) {
        if (!loc || loc === '') {
            loc = 'home';
        }

        return {
            marker: {
                lat: locationMarkers[loc].lat,
                lng: locationMarkers[loc].lng,
                label: {
                    message: locationMarkers[loc].name,
                    options: {
                        noHide: true
                    }
                }
            },
            center: {
                lat: locationMarkers[loc].lat,
                lng: locationMarkers[loc].lng,
                zoom: locationMarkers[loc].zoom,
            }
        };
    }

    $scope.$on('$locationChangeSuccess', function(event, url) {
        var section = url.split(/[\/]+/).pop();
        var data = getMapData(section);
        scope.markers.marker = data.marker;
        scope.center = data.center;
    });

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
        markers: {},
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

var home = angular.module('app.home', ['ngNewRouter', 'leaflet-directive', 'hljs']);

home.controller('HomeController', [ '$scope', HomeController ]);
home.controller('BasicCenterController', [ '$scope', BasicCenterController ]);

function HomeController() {}

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