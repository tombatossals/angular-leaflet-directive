app.controller("BoundsController", [ '$scope', 'leafletBoundsHelpers', function($scope, leafletBoundsHelpers) {

    var bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ 51.508742458803326, -0.087890625 ],
        [ 51.508742458803326, -0.087890625 ]
    ]);

    angular.extend($scope, {
        bounds: bounds,
        center: {},
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);
