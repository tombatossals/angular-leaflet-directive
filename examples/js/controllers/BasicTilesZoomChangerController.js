        app.controller('BasicTilesZoomChangerController', [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 10
                },
                tiles: {
                    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
            });
            $scope.$watch("london.zoom", function(zoom) {
                $scope.tiles.url = (zoom > 12)
                        ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            });
        } ]);