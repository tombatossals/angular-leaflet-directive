angular.module("leaflet-directive").directive('bounds', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            setupBounds(map);

            function isBoundsValid(bounds) {
                return isDefined(bounds) && isDefined(bounds.southWest) &&
                       isDefined(bounds.northEast) && isNumber(bounds.southWest.lat) &&
                       isNumber(bounds.southWest.lng) && isNumber(bounds.northEast.lat) &&
                       isNumber(bounds.northEast.lng);
            }

            function setupBounds(map) {
                $scope.$watch('bounds', function(bounds) {
                    if (!isDefined(bounds) || !isBoundsValid(bounds)) {
                        $log.error('[AngularJS - Leaflet] Invalid bounds');
                        return;
                    }

                    var southWest = bounds.southWest;
                    var northEast = bounds.northEast;
                    var new_latlng_bounds = new L.LatLngBounds(
                            new L.LatLng(southWest.lat, southWest.lng),
                            new L.LatLng(northEast.lat, northEast.lng));

                    if (!map.getBounds().equals(new_latlng_bounds)) {
                        map.fitBounds(new_latlng_bounds);
                    }
                }, true);
            }
        }
    };
});
