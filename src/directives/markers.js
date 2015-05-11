angular.module("leaflet-directive").directive('markers',
    function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults,
      leafletMarkersHelpers, leafletMarkerEvents, leafletIterators, leafletWatchHelpers,
      leafletDirectiveControlsHelpers) {
    //less terse vars to helpers
    var isDefined = leafletHelpers.isDefined,
        errorHeader = leafletHelpers.errorHeader,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        addMarkerWatcher = leafletMarkersHelpers.addMarkerWatcher,
        listenMarkerEvents = leafletMarkersHelpers.listenMarkerEvents,
        addMarkerToGroup = leafletMarkersHelpers.addMarkerToGroup,
        createMarker = leafletMarkersHelpers.createMarker,
        deleteMarker = leafletMarkersHelpers.deleteMarker,
        $it = leafletIterators,
        _markersWatchOptions = leafletHelpers.watchOptions,
        maybeWatch = leafletWatchHelpers.maybeWatch,
        extendDirectiveControls = leafletDirectiveControlsHelpers.extend;

    var _maybeAddMarkerToLayer = function(layerName, layers, model, marker, doIndividualWatch, map){

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
        if (!doIndividualWatch && map.hasLayer(marker) && model.focus === true) {
            leafletMarkersHelpers.manageOpenPopup(marker, model);
        }
        return true;
    };
    //TODO: move to leafletMarkersHelpers??? or make a new class/function file (leafletMarkersHelpers is large already)
    var _addMarkers = function(markersToRender, map, layers, leafletMarkers, leafletScope,
                               watchOptions, maybeLayerName){

        for (var newName in markersToRender) {
            if (newName.search("-") !== -1) {
                $log.error('The marker can\'t use a "-" on his key name: "' + newName + '".');
                continue;
            }

            if (!isDefined(leafletMarkers[newName])) {
                //(nmccready) very important to not have model changes when lObject is changed
                //this might be desirable in some cases but it causes two-way binding to lObject which is not ideal
                //if it is left as the reference then all changes from oldModel vs newModel are ignored
                //see _destroy (where modelDiff becomes meaningless if we do not copy here)
                var model = Helpers.copy(markersToRender[newName]);
                var marker = createMarker(model);
                var layerName = (model? model.layer : undefined) || maybeLayerName; //original way takes pref
                if (!isDefined(marker)) {
                    $log.error(errorHeader + ' Received invalid data on the marker ' + newName + '.');
                    continue;
                }
                leafletMarkers[newName] = marker;

                // Bind message
                if (isDefined(model.message)) {
                    marker.bindPopup(model.message, model.popupOptions);
                }

                // Add the marker to a cluster group if needed
                if (isDefined(model.group)) {
                    var groupOptions = isDefined(model.groupOption) ? model.groupOption : null;
                    addMarkerToGroup(marker, model.group, groupOptions, map);
                }

                // Show label if defined
                if (Helpers.LabelPlugin.isLoaded() && isDefined(model.label) && isDefined(model.label.message)) {
                    marker.bindLabel(model.label.message, model.label.options);
                }

                // Check if the marker should be added to a layer
                if (isDefined(model) && (isDefined(model.layer) || isDefined(maybeLayerName))){

                    var pass = _maybeAddMarkerToLayer(layerName, layers, model, marker,
                        watchOptions.individual.doWatch, map);
                    if(!pass)
                        continue; //something went wrong move on in the loop
                } else if (!isDefined(model.group)) {
                    // We do not have a layer attr, so the marker goes to the map layer
                    map.addLayer(marker);
                    if (!watchOptions.individual.doWatch && model.focus === true) {
                        leafletMarkersHelpers.manageOpenPopup(marker, model);
                    }
                }
                var pathToMarker = Helpers.getObjectDotPath(maybeLayerName? [maybeLayerName, newName]: [newName]);
                if (watchOptions.individual.doWatch) {
                    addMarkerWatcher(marker, pathToMarker, leafletScope, layers, map,
                        watchOptions.individual.doWatch);
                }

                listenMarkerEvents(marker, model, leafletScope, watchOptions.individual.doWatch);
                leafletMarkerEvents.bindEvents(marker, pathToMarker, model, leafletScope, layerName);
            }
        }
    };
    var _destroy = function(markerModels, oldMarkerModels, lMarkers, map, layers){
        // Delete markers from the array
        var hasLogged = false,
          modelIsDiff = false;
        var doCheckOldModel =  isDefined(oldMarkerModels);
        for (var name in lMarkers) {
            if(!hasLogged) {
                $log.debug(errorHeader + "[markers] destroy: ");
                hasLogged = true;
            }

            if(doCheckOldModel){
              //might want to make the option (in watch options) to disable deep checking
              //ie the options to only check !== (reference check) instead of angular.equals (slow)
              modelIsDiff = !angular.equals(markerModels[name],oldMarkerModels[name]);
            }
            if (!isDefined(markerModels) ||
                !Object.keys(markerModels).length ||
                !isDefined(markerModels[name]) ||
                !Object.keys(markerModels[name]).length ||
                modelIsDiff) {
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

                var watchOptions = leafletScope.markersWatchOptions || _markersWatchOptions;

                // backwards compat
                if(isDefined(attrs.watchMarkers))
                  watchOptions.doWatch = watchOptions.individual.doWatch =
                        (!isDefined(attrs.watchMarkers) || Helpers.isTruthy(attrs.watchMarkers));

                var isNested = (isDefined(attrs.markersNested) && Helpers.isTruthy(attrs.markersNested));

                getLayers().then(function(layers) {
                    var _clean = function(models, oldModels){
                        _destroy(models, oldModels, leafletMarkers, map, layers);
                    };

                    var _create = function(models, oldModels){
                        _clean(models, oldModels);
                        if(isNested) {
                            $it.each(models, function(markersToAdd, layerName) {
                                _addMarkers(markersToAdd, map, layers, leafletMarkers, leafletScope,
                                    watchOptions, layerName);
                            });
                            return;
                        }
                        _addMarkers(models, map, layers, leafletMarkers, leafletScope,
                            watchOptions);
                    };
                    extendDirectiveControls(attrs.id, 'markers', _create, _clean);
                    leafletData.setMarkers(leafletMarkers, attrs.id);

                    maybeWatch(leafletScope,'markers', watchOptions, function(newMarkers, oldMarkers){
                        _create(newMarkers, oldMarkers);
                    });
                });
            });
        }
    };
});
