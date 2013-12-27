app.controller("TilesController", [ '$scope', function($scope) {

    var tilesDict = {
        openstreetmap: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        opencyclemap: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        }
    };

    angular.extend($scope, {
        sidney: {
            lat: -33.8830,
            lng: 151.2166,
            zoom: 10
        },
        tiles: tilesDict.opencyclemap,
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.changeTiles = function(tiles) {
        $scope.tiles = tilesDict[tiles];
    };
} ]);
