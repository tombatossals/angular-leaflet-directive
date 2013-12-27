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
                leafletScope.$watch("maxbounds", function (maxbounds) {
                    // Unset any previous maxbounds
                    map.setMaxBounds();
                    map.fire("zoomlevelschange");

                    if (!isValidBounds(maxbounds)) {
                        return;
                    }
                    map.setMaxBounds( [
                        [ maxbounds.southWest.lat, maxbounds.southWest.lng ],
                        [ maxbounds.northEast.lat, maxbounds.northEast.lng ]
                    ]);
                });
            });
        }
    };
});
