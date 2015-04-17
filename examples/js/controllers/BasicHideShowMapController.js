        app.controller('BasicHideShowMapController', function($scope, $timeout, leafletData) {
            $scope.center = {
                lat: 35,
                lng: 0,
                zoom: 8
            };
            $scope.showMap = false;
            $scope.$watch("showMap", function(value) {
                if (value === true) {
                    leafletData.getMap().then(function(map) {
                      $timeout(function() {
                        map.invalidateSize();
                      }, 300);
                    });
                }
            });
        });