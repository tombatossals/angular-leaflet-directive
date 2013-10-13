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
