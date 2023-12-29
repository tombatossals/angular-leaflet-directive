app.controller("HeaderController", [
    "$scope",
    "$location",
    function ($scope, $location) {
        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 3,
            },
            defaults: {
                scrollWheelZoom: false,
                attributionControl: false,
                tileLayerOptions: {
                    opacity: 0.9,
                    detectRetina: true,
                    reuseTiles: true,
                },
            },
        });

        $scope.$on("leafletDirectiveMap.click", function (event) {
            $location.path("/");
        });
    },
]);
