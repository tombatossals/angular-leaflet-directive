        app.controller('BasicTilesWMSController', [ '$scope', function($scope) {
            var tilesDict = {
                openstreetmap: {
                    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    options: {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                standard: {
                    name: 'MAP Standard',
                    type: 'wms',
                    url: 'https://api.minu.mn/wms',
                    layerParams: {
                        layers: 'mongolid:mimap',
                        format: 'image/png',
                        transparent: true,
                        tiled: true,
                        version: '1.3.0',
                        maxZoom: 19
                    }
                },
                blue: {
                    name: 'MAP Blue',
                    type: 'wms',
                    url: 'https://api.minu.mn/wms',
                    layerParams: {
                        layers: 'mongolid:mimap_blue', // it's published not yet.
                        format: 'image/png',
                        transparent: true,
                        tiled: true,
                        version: '1.3.0',
                        maxZoom: 19
                    }
                }
            };
            angular.extend($scope, {
                ulaanbaatar: {
                    lat: 47.918464,
                    lng: 106.917678,
                    zoom: 5
                },
                tiles: tilesDict.openstreetmap
            });
            $scope.changeTiles = function(tiles) {
                $scope.tiles = tilesDict[tiles];
            };
        } ]);