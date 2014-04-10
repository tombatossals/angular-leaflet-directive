angular.module("leaflet-directive").directive('markers', function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkersHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', '?layers'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                Helpers = leafletHelpers,
                isDefined = leafletHelpers.isDefined,
                isString = leafletHelpers.isString,
                leafletScope  = mapController.getLeafletScope(),
                markers = leafletScope.markers,
                deleteMarker = leafletMarkersHelpers.deleteMarker,
                addMarkerWatcher = leafletMarkersHelpers.addMarkerWatcher,
                listenMarkerEvents = leafletMarkersHelpers.listenMarkerEvents,
                addMarkerToGroup = leafletMarkersHelpers.addMarkerToGroup,
                bindMarkerEvents = leafletEvents.bindMarkerEvents,
                createMarker = leafletMarkersHelpers.createMarker;

            mapController.getMap().then(function(map) {
                var leafletMarkers = {},
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
                    return;
                }

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    leafletScope.$watch('markers', function(newMarkers) {
                        // Delete markers from the array
                        for (var name in leafletMarkers) {
                            if (!isDefined(newMarkers) || !isDefined(newMarkers[name])) {
                                deleteMarker(leafletMarkers[name], map, layers);
                                delete leafletMarkers[name];
                            }
                        }

                        // add new markers
                        for (var newName in newMarkers) {
                            if (newName.search("-") !== -1) {
                                $log.error('The marker can\'t use a "-" on his key name: "' + newName + '".');
                                continue;
                            }

                            if (!isDefined(leafletMarkers[newName])) {
                                var markerData = newMarkers[newName];
                                var marker = createMarker(markerData);
                                if (!isDefined(marker)) {
                                    $log.error('[AngularJS - Leaflet] Received invalid data on the marker ' + newName + '.');
                                    continue;
                                }
                                leafletMarkers[newName] = marker;

                                // Bind message
                                if (isDefined(markerData.message)) {
                                    marker.bindPopup(markerData.message, markerData.popupOptions);
                                }

                                // Add the marker to a cluster group if needed
                                if (isDefined(markerData.group)) {
                                    addMarkerToGroup(marker, markerData.group, map);
                                }

                                // Show label if defined
                                if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message)) {
                                    marker.bindLabel(markerData.label.message, markerData.label.options);
                                }

                                // Check if the marker should be added to a layer
                                if (isDefined(markerData) && isDefined(markerData.layer)) {
                                    if (!isString(markerData.layer)) {
                                        $log.error('[AngularJS - Leaflet] A layername must be a string');
                                        continue;
                                    }
                                    if (!isDefined(layers)) {
                                        $log.error('[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.');
                                        continue;
                                    }

                                    if (!isDefined(layers.overlays) || !isDefined(layers.overlays[markerData.layer])) {
                                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                        continue;
                                    }
                                    var layerGroup = layers.overlays[markerData.layer];
                                    if (!(layerGroup instanceof L.LayerGroup)) {
                                        $log.error('[AngularJS - Leaflet] Adding a marker to an overlay needs a overlay of the type "group"');
                                        continue;
                                    }

                                    // The marker goes to a correct layer group, so first of all we add it
                                    layerGroup.addLayer(marker);

                                    // The marker is automatically added to the map depending on the visibility
                                    // of the layer, so we only have to open the popup if the marker is in the map
                                    if (map.hasLayer(marker) && markerData.focus === true) {
                                        marker.openPopup();
                                    }

                                // Add the marker to the map if it hasn't been added to a layer or to a group
                                } else if (!isDefined(markerData.group)) {
                                    // We do not have a layer attr, so the marker goes to the map layer
                                    map.addLayer(marker);
                                    if (markerData.focus === true) {
                                        marker.openPopup();
                                    }
                                    if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.options) && markerData.label.options.noHide === true) {
                                        marker.showLabel();
                                    }
                                }

                                // Should we watch for every specific marker on the map?
                                var shouldWatch = (!isDefined(attrs.watchMarkers) || attrs.watchMarkers === 'true');

                                if (shouldWatch) {
                                    addMarkerWatcher(marker, newName, leafletScope, layers, map);
                                    listenMarkerEvents(marker, markerData, leafletScope);
                                }
                                bindMarkerEvents(marker, newName, markerData, leafletScope);
                            }
                        }
                    }, true);
                });
            });
        }
    };
});
