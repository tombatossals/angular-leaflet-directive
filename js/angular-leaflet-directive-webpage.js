(function (angular) {
angular.module("app", ['ngNewRouter', 'app.home']).controller('AppController', [ '$router', AppController ]);

AppController.$routeConfig = [
    { path: '/', component: 'home' }
];

function AppController ($router) {}

app.controller("MultiLayerMapController", [ '$scope', '$http', function($scope, $http) {

    var tiles = {
        osm: {
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        cycle: {
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
        },
        mapbox_light: {
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia22g09'
            }
        },
        mapbox_wheatpaste: {
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia35jfp'
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

angular.module('app.home', [])
  .controller('HomeController', [function () {
    this.name = 'Friend';
  }]);
})(window.angular);