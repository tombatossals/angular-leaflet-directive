app.controller("TilesZoomChangerController", [ '$scope', function($scope) {
    angular.extend($scope, {
        cairo: {
            lat: 30.05,
            lng: 31.25,
            zoom: 10
        },
        tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.$watch("cairo.zoom", function(zoom) {
        $scope.tiles.url = (zoom > 12) ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    });
}]);
