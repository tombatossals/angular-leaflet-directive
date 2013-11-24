angular.module("leaflet-directive").directive('maxbounds', function ($log, leafletMapDefaults, leafletHelpers, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                isNumber  = leafletHelpers.isNumber,
                leafletScope  = controller.getLeafletScope(),
                maxBounds = leafletScope.maxBounds;


            leafletData.getMap(attrs.id).then(function(map) {
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

                function isValidBounds(bounds) {
                    return isDefined(bounds.southWest) &&
                           isDefined(bounds.northEast) &&
                           isNumber(bounds.southWest.lat) &&
                           isNumber(bounds.southWest.lng) &&
                           isNumber(bounds.northEast.lat) &&
                           isNumber(bounds.northEast.lng);
                }
            });
        }
    };
});
