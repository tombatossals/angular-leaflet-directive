(function(angular){ 
var app = angular.module('webapp');
        app.controller('BasicCenterAutodiscoverController', [ '$scope', function($scope) {
            angular.extend($scope, {
                center: {
                    autoDiscover: true
                }
            });
       }]);

        app.controller('BasicCenterController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                }
            });
       }]);

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
            }
        }]);

        app.controller("BasicFirstController", [ "$scope", function($scope) {
            // Nothing here!
        }]);
}(angular));