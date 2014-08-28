app.controller("MultiLayerMapController", [ '$scope', '$http', function($scope, $http) {

    var tiles = {
        osm: {
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        cycle: {
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
        },
        mapbox_streets: {
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            options: {
                apikey: 'pk.eyJ1IjoidG9tYmF0b3NzYWxzIiwiYSI6Imo3MWxyTHMifQ.TjXg_IV7ZYMHX6tqjMikPg',
                mapid: 'tombatossals.map-fmyyujjl'
            }
        },
        mapbox_terrain: {
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            options: {
                apikey: 'pk.eyJ1IjoidG9tYmF0b3NzYWxzIiwiYSI6Imo3MWxyTHMifQ.TjXg_IV7ZYMHX6tqjMikPg',
                mapid: 'tombatossals.jbn2nnon'
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
