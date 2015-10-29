        app.controller('BasicCenterUrlHashController', [ '$scope', '$location', function($scope, $location) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
            $scope.$on("centerUrlHash", function(event, centerHash) {
                console.log("url", centerHash);
                $location.search({ c: centerHash });
            });
            $scope.changeLocation = function(centerHash) {
                $location.search({ c: centerHash });
            };
        }]);