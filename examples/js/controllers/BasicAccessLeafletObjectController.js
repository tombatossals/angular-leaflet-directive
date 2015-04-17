        app.controller("BasicAccessLeafletObjectController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
            $scope.fitBounds = function() {
                leafletData.getMap().then(function(map) {
                    map.fitBounds([ [40.712, -74.227], [40.774, -74.125] ]);
                });
            };
       }]);