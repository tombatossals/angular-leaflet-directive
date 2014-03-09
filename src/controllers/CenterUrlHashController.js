app.controller("CenterUrlHashController", [ '$scope', '$location', function($scope, $location) {

    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.$on("centerUrlHash", function(event, centerHash) {
        $location.search({ c: centerHash });
    });
}]);
