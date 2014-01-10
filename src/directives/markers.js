angular.module("leaflet-directive").directive('markers', function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkersHelpers) {
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
                deleteMarker = leafletMarkersHelpers.deleteMarker,
                createMarker = leafletMarkersHelpers.createMarker;

            mapController.getMap().then(function(map) {
                var leafletMarkers = {},
                    groups = {},
                    getLayers;

                // If the layers attribute is used, we must wait until the layers are created
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
                    $log.error('[AngularJS - Leaflet] Received an empty "markers" variable.');
                    return;
                }

                // Should we watch for every specific marker on the map?
                var shouldWatch = (!isDefined(attrs.watchMarkers) || attrs.watchMarkers === 'true');

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    leafletScope.$watch('markers', function(newMarkers) {
                        // Delete markers from the array
                        for (var name in leafletMarkers) {
                            if (!isDefined(newMarkers) || !isDefined(newMarkers[name])) {
                                deleteMarker(map, leafletMarkers[name], layers, groups);
                                delete leafletMarkers[name];
                            }
                        }

                        // add new markers
                        for (var newName in newMarkers) {
                            if (!isDefined(leafletMarkers[newName])) {
                                var newMarker = createMarker('markers.'+newName, newMarkers[newName], leafletScope, map, layers, groups, shouldWatch);
                                if (!isDefined(newMarker)) {
                                    $log.error('[AngularJS - Leaflet] Received invalid data on the marker ¡ ' + newName + '.');
                                    continue;
                                }
                                leafletMarkers[newName] = newMarker;
                            }
                        }
                    }, shouldWatch);
                });
            });
        }
    };
});
