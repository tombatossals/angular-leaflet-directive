angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                isNumber  = leafletHelpers.isNumber,
                leafletScope = controller.getLeafletScope(),
                bounds = leafletScope.bounds;


            leafletData.getMap(attrs.id).then(function(map) {
                leafletScope.$watch('bounds', function(bounds) {
                    if (!isDefined(bounds) || !isBoundsValid(bounds)) {
                            $log.error('[AngularJS - Leaflet] Invalid bounds');
                            return;
                        }

                        var southWest = bounds.getSouthWest();
                        var northEast = bounds.getNorthEast();
                        var new_latlng_bounds = new L.LatLngBounds(
                                new L.LatLng(southWest.lat, southWest.lng),
                                new L.LatLng(northEast.lat, northEast.lng));

                        if (!map.getBounds().equals(new_latlng_bounds)) {
                            map.fitBounds(new_latlng_bounds);
                        }
                }, true);

                leafletScope.$watch('center', function(center) {
                    if (!bounds) {
                        return;
                    }

                    var leafletBounds = map.getBounds();
                    var sw_latlng = leafletBounds.getSouthWest();
                    var ne_latlng = leafletBounds.getNorthEast();
                    bounds = {
                        southWest: {
                            lat: sw_latlng.lat,
                            lng: sw_latlng.lng
                        },
                        northEast: {
                            lat: ne_latlng.lat,
                            lng: ne_latlng.lng
                        }
                    };
                });

                function isBoundsValid(bounds) {
                    if (isDefined(bounds) && isDefined(bounds.isValid)) {
                        return bounds.isValid();
                    }
                }

            });
        }
    };
});
