angular.module("leaflet-directive").directive('maxbounds', function ($log, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
                isValidBounds = leafletHelpers.isValidBounds;


            controller.getMap().then(function(map) {
                leafletScope.$watch("maxBounds", function (maxBounds) {
                    if (!isValidBounds(maxBounds)) {
                        // Unset any previous maxbounds
                        map.setMaxBounds();
                        return;
                    }
                    map.setMaxBounds(
                        new L.LatLngBounds(
                            new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                            new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                        ),
                        maxBounds.options
                    );
                });
            });
        }
    };
});
