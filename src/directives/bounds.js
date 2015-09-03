angular.module("leaflet-directive").directive('bounds', function (leafletLogger, $timeout, $http, leafletHelpers, nominatimService, leafletBoundsHelpers) {
    var $log = leafletLogger;
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: [ 'leaflet' ],

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined;
            var createLeafletBounds = leafletBoundsHelpers.createLeafletBounds;
            var leafletScope = controller[0].getLeafletScope();
            var mapController = controller[0];
            var errorHeader = leafletHelpers.errorHeader + ' [Bounds] ';

            var emptyBounds = function(bounds) {
                return (bounds._southWest.lat === 0 && bounds._southWest.lng === 0 &&
                        bounds._northEast.lat === 0 && bounds._northEast.lng === 0);
            };

            mapController.getMap().then(function (map) {
                leafletScope.$on('boundsChanged', function (event) {
                    var scope = event.currentScope;
                    var bounds = map.getBounds();

                    if (emptyBounds(bounds) || scope.settingBoundsFromScope) {
                        return;
                    }
                    scope.settingBoundsFromLeaflet = true;
                    var newScopeBounds = {
                        northEast: {
                            lat: bounds._northEast.lat,
                            lng: bounds._northEast.lng
                        },
                        southWest: {
                            lat: bounds._southWest.lat,
                            lng: bounds._southWest.lng
                        },
                        options: bounds.options
                    };
                    if (!angular.equals(scope.bounds, newScopeBounds)) {
                        scope.bounds = newScopeBounds;
                    }
                    $timeout( function() {
                        scope.settingBoundsFromLeaflet = false;
                    });
                });

                var lastNominatimQuery;
                leafletScope.$watch('bounds', function (bounds) {
                    if (scope.settingBoundsFromLeaflet)
                        return;
                    if (isDefined(bounds.address) && bounds.address !== lastNominatimQuery) {
                        scope.settingBoundsFromScope = true;
                        nominatimService.query(bounds.address, attrs.id).then(function(data) {
                            var b = data.boundingbox;
                            var newBounds = [ [ b[0], b[2]], [ b[1], b[3]] ];
                            map.fitBounds(newBounds);
                        }, function(errMsg) {
                            $log.error(errorHeader + ' ' + errMsg + '.');
                        });
                        lastNominatimQuery = bounds.address;
                        $timeout( function() {
                            scope.settingBoundsFromScope = false;
                        });
                        return;
                    }

                    var leafletBounds = createLeafletBounds(bounds);
                    if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                        scope.settingBoundsFromScope = true;
                        map.fitBounds(leafletBounds, bounds.options);
                        $timeout( function() {
                            scope.settingBoundsFromScope = false;
                        });
                    }
                }, true);
            });
        }
    };
});
