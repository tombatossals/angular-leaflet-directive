        app.controller("BasicBoundsController", [ "$scope", "leafletData", "leafletBoundsHelpers", function($scope, leafletData, leafletBoundsHelpers) {
            var bounds = leafletBoundsHelpers.createBoundsFromArray([
                [ 51.508742458803326, -0.087890625 ],
                [ 51.508742458803326, -0.087890625 ]
            ]);
            angular.extend($scope, {
                bounds: bounds,
                center: {}
            });
        }]);