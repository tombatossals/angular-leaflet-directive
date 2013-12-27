angular.module("leaflet-directive").directive('maxbounds', function ($log, leafletMapDefaults, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
                isValidBounds = leafletBoundsHelpers.isValidBounds;


            controller.getMap().then(function(map) {
                leafletScope.$watch("maxBounds", function (maxBounds) {
                    // Unset any previous maxbounds
                    map.setMaxBounds();
                    map.fire("zoomlevelschange");

                    if (!isValidBounds(maxBounds)) {
                        return;
                    }
                    map.setMaxBounds( [
                        [ maxBounds.southWest.lat, maxBounds.southWest.lng ],
                        [ maxBounds.northEast.lat, maxBounds.northEast.lng ]
                    ]);
                });
            });
        }
    };
});
