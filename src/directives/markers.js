angular.module("leaflet-directive").directive('markers',
    function ($log, $rootScope, $q, $compile, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkersHelpers,
              leafletEvents, leafletIterators) {
    //less terse vars to helpers
    var isDefined = leafletHelpers.isDefined,
        errorHeader = leafletHelpers.errorHeader,
        defaultTo= leafletHelpers.defaultTo,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        addMarkerWatcher = leafletMarkersHelpers.addMarkerWatcher,
        listenMarkerEvents = leafletMarkersHelpers.listenMarkerEvents,
        addMarkerToGroup = leafletMarkersHelpers.addMarkerToGroup,
        bindMarkerEvents = leafletEvents.bindMarkerEvents,
        createMarker = leafletMarkersHelpers.createMarker,
        deleteMarker = leafletMarkersHelpers.deleteMarker,
        $it = leafletIterators;

    var _maybeAddMarkerToLayer = function(layerName, layers, markerData, marker, shouldWatch, map){

        if (!isString(layerName)) {
            $log.error(errorHeader + ' A layername must be a string');
            return false;
        }

        if (!isDefined(layers)) {
            $log.error(errorHeader + ' You must add layers to the directive if the markers are going to use this functionality.');
            return false;
        }

        if (!isDefined(layers.overlays) || !isDefined(layers.overlays[layerName])) {
            $log.error(errorHeader +' A marker can only be added to a layer of type "group"');
            return false;
        }
        var layerGroup = layers.overlays[layerName];
        if (!(layerGroup instanceof L.LayerGroup || layerGroup instanceof L.FeatureGroup)) {
            $log.error(errorHeader + ' Adding a marker to an overlay needs a overlay of the type "group" or "featureGroup"');
            return false;
        }

        // The marker goes to a correct layer group, so first of all we add it
        layerGroup.addLayer(marker);

        // The marker is automatically added to the map depending on the visibility
        // of the layer, so we only have to open the popup if the marker is in the map
        if (!shouldWatch && map.hasLayer(marker) && markerData.focus === true) {
            leafletMarkersHelpers.manageOpenPopup(marker, markerData);
        }
        return true;
    };
    //TODO: move to leafletMarkersHelpers??? or make a new class/function file (leafletMarkersHelpers is large already)
    var _addMarkers = function(markersToRender, map, layers, leafletMarkers, leafletScope, shouldWatch, maybeLayerName){
        shouldWatch = defaultTo(shouldWatch, false);


        for (var newName in markersToRender) {
            if (newName.search("-") !== -1) {
                $log.error('The marker can\'t use a "-" on his key name: "' + newName + '".');
                continue;
            }

            if (!isDefined(leafletMarkers[newName])) {
                var markerData = markersToRender[newName];
                var marker = createMarker(markerData);
                var layerName = (markerData? markerData.layer : undefined) || maybeLayerName; //original way takes pref
                if (!isDefined(marker)) {
                    $log.error(errorHeader + ' Received invalid data on the marker ' + newName + '.');
                    continue;
                }
                leafletMarkers[newName] = marker;

                // Bind message and compile if needed
                if (isDefined(markerData.message) || isDefined(markerData.compile)) {
                    if (markerData.compile) {
                        var newScope = leafletScope.$new();
                        newScope.data = markerData;
                        marker.bindPopup($compile(markerData.compile)(newScope)[0]);
                    } else {
                        marker.bindPopup(markerData.message);
                    }
                }

                // Add the marker to a cluster group if needed
                if (isDefined(markerData.group)) {
                    var groupOptions = isDefined(markerData.groupOption) ? markerData.groupOption : null;
                    addMarkerToGroup(marker, markerData.group, groupOptions, map);
                }

                // Show label if defined
                if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message)) {
                    marker.bindLabel(markerData.label.message, markerData.label.options);
                }

                // Check if the marker should be added to a layer
                if (isDefined(markerData) && (isDefined(markerData.layer) || isDefined(maybeLayerName))){

                    var pass = _maybeAddMarkerToLayer(layerName, layers, markerData, marker, shouldWatch, map);
                    if(!pass)
                        continue; //something went wrong move on in the loop
                } else if (!isDefined(markerData.group)) {
                    // We do not have a layer attr, so the marker goes to the map layer
                    map.addLayer(marker);
                    if (!shouldWatch && markerData.focus === true) {
                        leafletMarkersHelpers.manageOpenPopup(marker, markerData);
                    }
                }
                var pathToMarker = Helpers.getObjectDotPath(maybeLayerName? [maybeLayerName, newName]: [newName]);
                if (shouldWatch) {
                    addMarkerWatcher(marker, pathToMarker, leafletScope, layers, map);
                }

                listenMarkerEvents(marker, markerData, leafletScope, shouldWatch);
                bindMarkerEvents(marker, pathToMarker, markerData, leafletScope, layerName);
            }
        }
    };
    var _destroy = function(markerModels, lMarkers, map, layers){
        // Delete markers from the array
        var hasLogged = false;
        for (var name in lMarkers) {
            if(!hasLogged) {
                $log.debug(errorHeader + "[markers] destroy: ");
                hasLogged = true;
            }
            if (!isDefined(markerModels) || !isDefined(markerModels[name])) {
                deleteMarker(lMarkers[name], map, layers);
                delete lMarkers[name];
            }
        }
    };

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', '?layers'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                leafletScope  = mapController.getLeafletScope();

            mapController.getMap().then(function(map) {
                var leafletMarkers = {}, getLayers;

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

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    leafletScope.$watch('markers', function(newMarkers) {
                        _destroy(newMarkers, leafletMarkers, map, layers);
                        // Should we watch for every specific marker on the map?
                        var shouldWatch = (!isDefined(attrs.watchMarkers) || Helpers.isTruthy(attrs.watchMarkers));
                        var isNested = (isDefined(attrs.markersNested) && Helpers.isTruthy(attrs.markersNested));

                        if(isNested) {
                            $it.each(newMarkers, function(markersToAdd, layerName) {
                                _addMarkers(markersToAdd, map, layers, leafletMarkers, leafletScope, shouldWatch, layerName);
                            });
                            return;
                        }
                        _addMarkers(newMarkers, map, layers, leafletMarkers, leafletScope, shouldWatch);
                    }, true);
                });
            });
        }
    };
});
