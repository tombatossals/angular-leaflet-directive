app.controller("BoundsController", [ '$scope', 'leafletBoundsHelpers', function($scope, leafletBoundsHelpers) {

    var bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ 51.508742458803326, -0.087890625 ],
        [ 51.508742458803326, -0.087890625 ]
    ]);

    angular.extend($scope, {
        bounds: bounds,
        center: { lat: 1, lng: 1, zoom: 1 },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);
