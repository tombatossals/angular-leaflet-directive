        app.controller("BasicDoubleMapAccessMapObjectController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                markers: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.logLeafletData = function(name) {
                leafletData.getMap(name).then(function(map) {
                    $log.info(map);
                });
            };
        }]);