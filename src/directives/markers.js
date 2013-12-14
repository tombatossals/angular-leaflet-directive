angular.module("leaflet-directive").directive('markers', function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkerHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', '?layers'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                isDefined = leafletHelpers.isDefined,
                leafletScope  = mapController.getLeafletScope(),
                markers = leafletScope.markers,
                deleteMarker = leafletMarkerHelpers.deleteMarker,
                createMarker = leafletMarkerHelpers.createMarker;

            mapController.getMap().then(function(map) {
                var leafletMarkers = {},
                    groups = {},
                    getLayers;

                if (isDefined(controller[1])) {
                    getLayers = controller[1].getLayers;
                } else {
                    getLayers = function() {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }

                if (!isDefined(markers)) {
                    return;
                }

                var shouldWatch = (
                    leafletScope.watchMarkers === undefined ||
                    leafletScope.watchMarkers === 'true' || leafletScope.watchMarkers === true
                );

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    leafletScope.$watch('markers', function(newMarkers) {
                        // Delete markers from the array
                        for (var name in leafletMarkers) {
                            if (!isDefined(newMarkers) || !isDefined(newMarkers[name])) {
                                deleteMarker(map, leafletMarkers, layers, groups, name);
                            }
                        }

                        // add new markers
                        for (var new_name in newMarkers) {
                            if (!isDefined(leafletMarkers[new_name])) {
                                var newMarker = createMarker('markers.'+new_name, newMarkers[new_name], leafletScope, map, layers, groups, shouldWatch);
                                if (newMarker !== null) {
                                    leafletMarkers[new_name] = newMarker;
                                }
                            }
                        }
                    }, shouldWatch);
                });
            });
        }
    };
});
