angular.module("leaflet-directive").directive('markers', function ($log, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var markers = $scope.markers;
            var layers = $scope.layers;

            // Default leaflet icon object used in all markers as a default
            var LeafletIcon = L.Icon.extend({
                options: {
                    iconUrl: defaults.icon.url,
                    iconRetinaUrl: defaults.icon.retinaUrl,
                    iconSize: defaults.icon.size,
                    iconAnchor: defaults.icon.anchor,
                    popupAnchor: defaults.icon.popup,
                    shadowUrl: defaults.icon.shadow.url,
                    shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
                    shadowSize: defaults.icon.shadow.size,
                    shadowAnchor: defaults.icon.shadow.anchor
                }
            });

            setupMarkers(markers, layers, map);

            function setupMarkers(markers, layers, map) {
                var leafletMarkers = {};

                if (!isDefined(markers)) {
                    return;
                }

                for (var name in markers) {
                    var newMarker = createMarker('markers.'+name, markers[name], map);
                    if (newMarker !== null) {
                        leafletMarkers[name] = newMarker;
                    }
                }

                $scope.$watch('markers', function(newMarkers) {
                    // Delete markers from the array
                    for (var name in leafletMarkers) {
                        if (newMarkers[name] === undefined) {
                            // First we check if the marker is in a layer group
                            markers[name].closePopup();
                            // There is no easy way to know if a marker is added to a layer, so we search for it
                            // if there are overlays
                            if (layers !== undefined && layers !== null) {
                                if (layers.overlays !== undefined) {
                                    for (var key in layers.overlays) {
                                        if (layers.overlays[key] instanceof L.LayerGroup) {
                                            if (layers.overlays[key].hasLayer(leafletMarkers[name])) {
                                                layers.overlays[key].removeLayer(leafletMarkers[name]);
                                            }
                                        }
                                    }
                                }
                            }
                            // Remove the marker from the map
                            map.removeLayer(leafletMarkers[name]);
                            // TODO: If we remove the marker we don't have to clear the $watches?
                            // Delete the marker
                            delete leafletMarkers[name];
                        }
                    }
                    // add new markers
                    for (var new_name in newMarkers) {
                        if (leafletMarkers[new_name] === undefined) {
                            var newMarker = createMarker('markers.'+new_name, markers[new_name], map);
                            if (newMarker !== null) {
                                leafletMarkers[new_name] = newMarker;
                            }
                        }
                    }
                }, true);
            }

            function createMarker(scope_watch_name, marker_data, map) {
                var marker = buildMarker(marker_data);

                // Marker belongs to a layer group?
                if (marker_data.layer === undefined) {
                    // We do not have a layer attr, so the marker goes to the map layer
                    map.addLayer(marker);
                    if (marker_data.focus === true) {
                        marker.openPopup();
                    }
                } else if (typeof marker_data.layer === 'string') {
                    if (layers !== null) {
                        // We have layers so continue testing
                        if (layers.overlays !== null && layers.overlays !== undefined) {
                            // There is a layer name so we will try to add it to the layer, first does the layer exists
                            if (layers.overlays[marker_data.layer] !== undefined || layers.overlays[marker_data.layer] !== null) {
                                // Is a group layer?
                                var layerGroup = layers.overlays[marker_data.layer];
                                if (layerGroup instanceof L.LayerGroup) {
                                    // The marker goes to a correct layer group, so first of all we add it
                                    layerGroup.addLayer(marker);
                                    // The marker is automatically added to the map depending on the visibility
                                    // of the layer, so we only have to open the popup if the marker is in the map
                                    if (map.hasLayer(marker)) {
                                        if (marker_data.focus === true) {
                                            marker.openPopup();
                                        }
                                    }
                                } else {
                                    $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                    return null;
                                }
                            } else {
                                $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                                return null;
                            }
                        } else {
                            $log.error('[AngularJS - Leaflet] You must add layers overlays to the directive if used in a marker');
                            return null;
                        }
                    } else {
                        $log.error('[AngularJS - Leaflet] You must add layers to the directive if used in a marker');
                        return null;
                    }
                } else {
                    $log.error('[AngularJS - Leaflet] A layername must be a string');
                    return null;
                }

                function genDispatchEventCB(eventName, logic) {
                    return function(e) {
                        var broadcastName = 'leafletDirectiveMarker.' + eventName;
                        var markerName = scope_watch_name.replace('markers.', '');

                        // Broadcast old marker click name for backwards compatibility
                        if (eventName === "click") {
                            safeApply($scope, function() {
                                $rootScope.$broadcast('leafletDirectiveMarkersClick', markerName);
                            });
                        } else if (eventName === 'dragend') {
                            safeApply($scope, function() {
                                marker_data.lat = marker.getLatLng().lat;
                                marker_data.lng = marker.getLatLng().lng;
                            });
                            if (marker_data.message) {
                                if (marker_data.focus === true) {
                                    marker.openPopup();
                                }
                            }
                        }

                        safeApply($scope, function(scope){
                            if (logic === "emit") {
                                scope.$emit(broadcastName, {
                                    markerName: markerName,
                                    leafletEvent: e
                                });
                            } else {
                                $rootScope.$broadcast(broadcastName, {
                                    markerName: markerName,
                                    leafletEvent: e
                                });
                            }
                        });
                    };
                }

                // Set up marker event broadcasting
                var availableMarkerEvents = [
                    'click',
                    'dblclick',
                    'mousedown',
                    'mouseover',
                    'mouseout',
                    'contextmenu',
                    'dragstart',
                    'drag',
                    'dragend',
                    'move',
                    'remove',
                    'popupopen',
                    'popupclose'
                ];

                var markerEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                if ($scope.eventBroadcast === undefined || $scope.eventBroadcast === null) {
                    // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                    markerEvents = availableMarkerEvents;
                } else if (typeof $scope.eventBroadcast !== 'object') {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                } else {
                    // We have a possible valid object
                    if ($scope.eventBroadcast.marker === undefined || $scope.eventBroadcast.marker === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        markerEvents = availableMarkerEvents;
                    } else if (typeof $scope.eventBroadcast.marker !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if ($scope.eventBroadcast.marker.logic !== undefined && $scope.eventBroadcast.marker.logic !== null) {
                            // We take care of possible propagation logic
                            if ($scope.eventBroadcast.marker.logic !== "emit" && $scope.eventBroadcast.marker.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if ($scope.eventBroadcast.marker.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var markerEventsEnable = false, markerEventsDisable = false;
                        if ($scope.eventBroadcast.marker.enable !== undefined && $scope.eventBroadcast.marker.enable !== null) {
                            if (typeof $scope.eventBroadcast.marker.enable === 'object') {
                                markerEventsEnable = true;
                            }
                        }
                        if ($scope.eventBroadcast.marker.disable !== undefined && $scope.eventBroadcast.marker.disable !== null) {
                            if (typeof $scope.eventBroadcast.marker.disable === 'object') {
                                markerEventsDisable = true;
                            }
                        }
                        if (markerEventsEnable && markerEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                        } else if (!markerEventsEnable && !markerEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the marker object is OK, lets enable or disable events
                            if (markerEventsEnable) {
                                // Enable events
                                for (i = 0; i < $scope.eventBroadcast.marker.enable.length; i++) {
                                    eventName = $scope.eventBroadcast.marker.enable[i];
                                    // Do we have already the event enabled?
                                    if (markerEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMarkerEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            markerEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                markerEvents = availableMarkerEvents;
                                for (i = 0; i < $scope.eventBroadcast.marker.disable.length; i++) {
                                    eventName = $scope.eventBroadcast.marker.disable[i];
                                    var index = markerEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        markerEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }


                for (i = 0; i < markerEvents.length; i++) {
                    eventName = markerEvents[i];
                    marker.on(eventName, genDispatchEventCB(eventName, logic), {
                        eventName: eventName,
                        scope_watch_name: scope_watch_name
                    });
                }

                var clearWatch = $scope.$watch(scope_watch_name, function(data, old_data) {
                    if (!isDefined(data)) {
                        marker.closePopup();
                        // There is no easy way to know if a marker is added to a layer, so we search for it
                        // if there are overlays
                        if (layers !== undefined && layers !== null) {
                            if (layers.overlays !== undefined) {
                                for (var key in layers.overlays) {
                                    if (layers.overlays[key] instanceof L.LayerGroup) {
                                        if (layers.overlays[key].hasLayer(marker)) {
                                            layers.overlays[key].removeLayer(marker);
                                        }
                                    }
                                }
                            }
                        }
                        map.removeLayer(marker);
                        clearWatch();
                        return;
                    }

                    if (old_data) {

                        //TODO Check for layers !== null
                        //TODO Check for layers.overlays !== null !== undefined
                        // It is possible the the layer has been removed or the layer marker does not exist

                        // Update the layer group if present or move it to the map if not
                        if (data.layer === undefined || data.layer === null || typeof data.layer !== 'string') {
                            // There is no layer information, we move the marker to the map if it was in a layer group
                            if (old_data.layer !== undefined && old_data.layer !== null && typeof old_data.layer === 'string') {
                                // Remove from the layer group that is supposed to be
                                if (layers.overlays[old_data.layer] !== undefined) {
                                    if (layers.overlays[old_data.layer].hasLayer(marker)) {
                                        layers.overlays[old_data.layer].removeLayer(marker);
                                        // If the marker had a popup we close it because we do not know if the popup in on the map
                                        // or on the layer group. This is ineficient, but as we can't check if the popup is opened
                                        // in Leaflet we can't determine if it has to be open in the new layer. So removing the
                                        // layer group of a marker always closes the popup.
                                        // TODO: Improve popup behaviour when removing a marker from a layer group
                                        marker.closePopup();
                                    }
                                }
                                // Test if it is not on the map and add it
                                if (!map.hasLayer(marker)) {
                                    map.addLayer(marker);
                                }
                            }
                        } else if (old_data.layer === undefined || old_data.layer === null || old_data.layer !== data.layer) {
                            // If it was on a layer group we have to remove it
                            if (typeof old_data.layer === 'string') {
                                if (layers.overlays[old_data.layer] !== undefined) {
                                    if (layers.overlays[old_data.layer].hasLayer(marker)) {
                                        layers.overlays[old_data.layer].removeLayer(marker);
                                    }
                                }
                            }
                            // If the marker had a popup we close it because we do not know how the new layer
                            // will be. This is ineficient, but as we can't check if the opoup is opened in Leaflet
                            // we can't determine if it has to be open in the new layer. So changing the layer group
                            // of a marker always closes the popup.
                            // TODO: Improve popup behaviour when changing a marker from a layer group
                            marker.closePopup();
                            // Remove it from the map in case the new layer is hidden or there is an error in the new layer
                            if (map.hasLayer(marker)) {
                                map.removeLayer(marker);
                            }
                            // The data.layer is defined so we add the marker to the layer if it is different from the old data
                            if (layers.overlays[data.layer] !== undefined) {
                                // Is a group layer?
                                var layerGroup = layers.overlays[data.layer];
                                if (layerGroup instanceof L.LayerGroup) {
                                    // The marker goes to a correct layer group, so first of all we add it
                                    layerGroup.addLayer(marker);
                                    // The marker is automatically added to the map depending on the visibility
                                    // of the layer, so we only have to open the popup if the marker is in the map
                                    if (map.hasLayer(marker)) {
                                        if (data.focus === true) {
                                            marker.openPopup();
                                        }
                                    }
                                } else {
                                    $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                }
                            } else {
                                $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                            }
                        } else {
                            // Never has to enter here...
                        }

                        // Update the draggable property
                        if (data.draggable === undefined || data.draggable === null || data.draggable !== true) {
                            // If there isn't or wasn't the draggable property or is false and previously true update the dragging
                            // the !== true prevents for not boolean values in the draggable property
                            if (old_data.draggable !== undefined && old_data.draggable !== null && old_data.draggable === true) {
                                if (marker.dragging) {
                                    marker.dragging.disable();
                                }
                            }
                        } else if (old_data.draggable === undefined || old_data.draggable === null || old_data.draggable !== true) {
                            // The data.draggable property must be true so we update if there wasn't a previous value or it wasn't true
                            if (marker.dragging) {
                                marker.dragging.enable();
                            } else {
                                if (L.Handler.MarkerDrag) {
                                    marker.dragging = new L.Handler.MarkerDrag(marker);
                                    marker.options.draggable = true;
                                    marker.dragging.enable();
                                }
                            }
                        }

                        // Update the icon property
                        if (data.icon === undefined || data.icon === null || typeof data.icon !== 'object') {
                            // If there is no icon property or it's not an object
                            if (old_data.icon !== undefined && old_data.icon !== null && typeof old_data.icon === 'object') {
                                // If there was an icon before restore to the default
                                marker.setIcon(new LeafletIcon());
                                marker.closePopup();
                                marker.unbindPopup();
                                if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                    marker.bindPopup(data.message);
                                }
                            }
                        } else if (old_data.icon === undefined || old_data.icon === null || typeof old_data.icon !== 'object') {
                            // The data.icon exists so we create a new icon if there wasn't an icon before
                            var dragA = false;
                            if (marker.dragging) {
                                dragA = marker.dragging.enabled();
                            }
                            if (Helpers.AwesomeMarkersPlugin.is(data.icon)) {
                                // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                                marker.setIcon(data.icon);
                                // As the new icon creates a new DOM object some elements, as drag, are reseted.
                            } else if (Helpers.Leaflet.DivIcon.is(data.icon) || Helpers.Leaflet.Icon.is(data.icon)) {
                                // This is a Leaflet.DivIcon or a Leaflet.Icon
                                marker.setIcon(data.icon);
                            } else {
                                // This icon is a icon set in the model trough options
                                marker.setIcon(new LeafletIcon(data.icon));
                            }
                            if (dragA) {
                                marker.dragging.enable();
                            }
                            marker.closePopup();
                            marker.unbindPopup();
                            if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                marker.bindPopup(data.message);
                            }

                        } else {
                            if (Helpers.AwesomeMarkersPlugin.is(data.icon)) {
                                // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                                if (!Helpers.AwesomeMarkersPlugin.equal(data.icon, old_data.icon)) {
                                    var dragD = false;
                                    if (marker.dragging) {
                                        dragD = marker.dragging.enabled();
                                    }
                                    marker.setIcon(data.icon);
                                    // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                    if (dragD) {
                                        marker.dragging.enable();
                                    }
                                    //TODO: Improve depending on anchorPopup
                                    marker.closePopup();
                                    marker.unbindPopup();
                                    if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                        marker.bindPopup(data.message);
                                    }
                                }
                            } else if (Helpers.Leaflet.DivIcon.is(data.icon)) {
                                // This is a Leaflet.DivIcon
                                if (!Helpers.Leaflet.DivIcon.equal(data.icon, old_data.icon)) {
                                    var dragE = false;
                                    if (marker.dragging) {
                                        dragE = marker.dragging.enabled();
                                    }
                                    marker.setIcon(data.icon);
                                    // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                    if (dragE) {
                                        marker.dragging.enable();
                                    }
                                    //TODO: Improve depending on anchorPopup
                                    marker.closePopup();
                                    marker.unbindPopup();
                                    if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                        marker.bindPopup(data.message);
                                    }
                                }
                            } else if (Helpers.Leaflet.Icon.is(data.icon)) {
                                // This is a Leaflet.DivIcon
                                if (!Helpers.Leaflet.Icon.equal(data.icon, old_data.icon)) {
                                    var dragF = false;
                                    if (marker.dragging) {
                                        dragF = marker.dragging.enabled();
                                    }
                                    marker.setIcon(data.icon);
                                    // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                    if (dragF) {
                                        marker.dragging.enable();
                                    }
                                    //TODO: Improve depending on anchorPopup
                                    marker.closePopup();
                                    marker.unbindPopup();
                                    if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                        marker.bindPopup(data.message);
                                    }
                                }
                            } else {
                                // This icon is an icon defined in the marker model through options
                                // There is an icon and there was an icon so if they are different we create a new icon
                                if (JSON.stringify(data.icon) !== JSON.stringify(old_data.icon)) {
                                    var dragG = false;
                                    if (marker.dragging) {
                                        dragG = marker.dragging.enabled();
                                    }
                                    marker.setIcon(new LeafletIcon(data.icon));
                                    if (dragG) {
                                        marker.dragging.enable();
                                    }
                                    //TODO: Improve depending on anchorPopup
                                    marker.closePopup();
                                    marker.unbindPopup();
                                    if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                        marker.bindPopup(data.message);
                                    }
                                }
                            }
                        }

                        // Update the Popup message property
                        if (data.message === undefined || data.message === null || typeof data.message !== 'string' || data.message === "") {
                            // There is no popup to show, so if it has previously existed it must be unbinded
                            if (old_data.message !== undefined && old_data.message !== null && typeof old_data.message === 'string' && old_data.message !== "") {
                                marker.closePopup();
                                marker.unbindPopup();
                            }
                        } else {
                            // There is some text in the popup, so we must show the text or update existing
                            if (old_data.message === undefined || old_data.message === null || typeof old_data.message !== 'string' || old_data.message === "") {
                                // There was no message before so we create it
                                marker.bindPopup(data.message);
                                if (data.focus === true) {
                                    // If the focus is set, we must open the popup, because we do not know if it was opened before
                                    marker.openPopup();
                                }
                            } else if (data.message !== old_data.message) {
                                // There was a different previous message so we update it
                                marker.setPopupContent(data.message);
                            }
                        }

                        // Update the focus property
                        if (data.focus === undefined || data.focus === null || data.focus !== true) {
                            // If there is no focus property or it's false
                            if (old_data.focus !== undefined && old_data.focus !== null && old_data.focus === true) {
                                // If there was a focus property and was true we turn it off
                                marker.closePopup();
                            }
                        } else if (old_data.focus === undefined || old_data.focus === null || old_data.focus !== true) {
                            // The data.focus property must be true so we update if there wasn't a previous value or it wasn't true
                            marker.openPopup();
                        }

                        // Update the lat-lng property (always present in marker properties)
                        if (data.lat === undefined || data.lat === null || isNaN(data.lat) || typeof data.lat !== 'number' || data.lng === undefined || data.lng === null || isNaN(data.lng) || typeof data.lng !== 'number') {
                            $log.warn('There are problems with lat-lng data, please verify your marker model');
                            // Remove the marker from the layers and map if it is not valid
                            if (layers !== null) {
                                if (layers.overlays !== undefined && layers.overlays !== null) {
                                    for (var olname in layers.overlays) {
                                        if (layers.overlays[olname] instanceof L.LayerGroup || Helpers.MarkerClusterPlugin.is(layers.overlays[olname])) {
                                            if (layers.overlays[olname].hasLayer(marker)) {
                                                layers.overlays[olname].removeLayer(marker);
                                            }
                                        }
                                    }
                                }
                            }
                            map.removeLayer(marker);
                        } else {
                            var cur_latlng = marker.getLatLng();
                            // On dragend event, scope will be updated, which
                            // tirggers this watch expression. Then we call
                            // setLatLng and triggers move event on marker and
                            // causes digest already in progress error.
                            //
                            // This check is to make sure we don't trigger move
                            // event manually after dragend, which is redundant
                            // anyway. Because before dragend event fired, marker
                            // sate is already updated by leaflet.
                            if (cur_latlng.lat !== data.lat || cur_latlng.lng !== data.lng) {
                                // if the marker is in a clustermarker layer it has to be removed and added again to the layer
                                var isCluster = false;
                                if (data.layer !== undefined && data.layer !== null && typeof data.layer === 'string') {
                                    if (Helpers.MarkerClusterPlugin.is(layers.overlays[data.layer])) {
                                        layers.overlays[data.layer].removeLayer(marker);
                                        isCluster = true;
                                    }
                                }
                                marker.setLatLng([data.lat, data.lng]);
                                if (isCluster) {
                                    layers.overlays[data.layer].addLayer(marker);
                                }
                            }
                        }
                    }
                }, true);
                return marker;
            }

            function buildMarker(data) {
                var micon = null;
                if (data.icon) {
                    micon = data.icon;
                } else {
                    micon = new LeafletIcon();
                }
                var moptions = {
                    icon: micon,
                    draggable: data.draggable ? true : false
                };
                if (data.title) {
                    moptions.title = data.title;
                }
                var marker = new L.marker(data, moptions);
                if (data.message) {
                    marker.bindPopup(data.message);
                }
                return marker;
            }

            function setupPaths() {
                var paths = {};
                $scope.leaflet.paths = !!attrs.testing ? paths : str_inspect_hint;

                if (!$scope.paths) {
                    return;
                }

                $log.warn("[AngularJS - Leaflet] Creating polylines and adding them to the map will break the directive's scope's inspection in AngularJS Batarang");

                for (var name in $scope.paths) {
                    paths[name] = createPath(name, $scope.paths[name], map);
                }

                $scope.$watch("paths", function (newPaths) {
                    for (var new_name in newPaths) {
                        if (paths[new_name] === undefined) {
                            paths[new_name] = createPath(new_name, newPaths[new_name], map);
                        }
                    }
                    // Delete paths from the array
                    for (var name in paths) {
                        if (newPaths[name] === undefined) {
                            delete paths[name];
                        }
                    }

                }, true);
            }

            function createPath(name, scopePath, map) {
                var path;

                var options = {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                };
                if(scopePath.stroke !== undefined) {
                    options.stroke = scopePath.stroke;
                }
                if(scopePath.fill !== undefined) {
                    options.fill = scopePath.fill;
                }
                if(scopePath.fillColor !== undefined) {
                    options.fillColor = scopePath.fillColor;
                }
                if(scopePath.fillOpacity !== undefined) {
                    options.fillOpacity = scopePath.fillOpacity;
                }
                if(scopePath.smoothFactor !== undefined) {
                    options.smoothFactor = scopePath.smoothFactor;
                }
                if(scopePath.noClip !== undefined) {
                    options.noClip = scopePath.noClip;
                }

                if(scopePath.type === undefined) {
                    scopePath.type = "polyline";
                }

                function setPathOptions(data, oldData) {
                    if (data.latlngs !== undefined && (oldData === undefined || data.latlngs !== oldData.latlngs)) {
                        switch(data.type) {
                            default:
                            case "polyline":
                            case "polygon":
                                path.setLatLngs(convertToLeafletLatLngs(data.latlngs));
                                break;
                            case "multiPolyline":
                            case "multiPolygon":
                                path.setLatLngs(convertToLeafletMultiLatLngs(data.latlngs));
                                break;
                            case "rectangle":
                                path.setBounds(new L.LatLngBounds(convertToLeafletLatLngs(data.latlngs)));
                                break;
                            case "circle":
                            case "circleMarker":
                                path.setLatLng(convertToLeafletLatLng(data.latlngs));
                                if(data.radius !== undefined && (oldData === undefined || data.radius !== oldData.radius)) {
                                    path.setRadius(data.radius);
                                }
                                break;
                        }
                    }

                    if (data.weight !== undefined && (oldData === undefined || data.weight !== oldData.weight)) {
                        path.setStyle({ weight: data.weight });
                    }

                    if (data.color !== undefined && (oldData === undefined || data.color !== oldData.color)) {
                        path.setStyle({ color: data.color });
                    }

                    if (data.opacity !== undefined && (oldData === undefined || data.opacity !== oldData.opacity)) {
                        path.setStyle({ opacity: data.opacity });
                    }
                }

                switch(scopePath.type) {
                    default:
                    case "polyline":
                        path = new L.Polyline([], options);
                        break;
                    case "multiPolyline":
                        path = new L.multiPolyline([[[0,0],[1,1]]], options);
                        break;
                    case "polygon":
                        path = new L.Polygon([], options);
                        break;
                    case "multiPolygon":
                        path = new L.MultiPolygon([[[0,0],[1,1],[0,1]]], options);
                        break;
                    case "rectangle":
                        path = new L.Rectangle([[0,0],[1,1]], options);
                        break;
                    case "circle":
                        path = new L.Circle([0,0], 1, options);
                        break;
                    case "circleMarker":
                        path = new L.CircleMarker([0,0], options);
                        break;
                }

                setPathOptions(scopePath);
                map.addLayer(path);

                var clearWatch = $scope.$watch('paths.' + name, function(data, oldData) {
                    if (!data) {
                        map.removeLayer(path);
                        clearWatch();
                        return;
                    }
                    setPathOptions(data,oldData);
                }, true);

                return path;
            }

            function convertToLeafletLatLng(latlng) {
                return new L.LatLng(latlng.lat, latlng.lng);
            }

            function convertToLeafletLatLngs(latlngs) {
                return latlngs.filter(function(latlng) {
                    return !!latlng.lat && !!latlng.lng;
                }).map(function (latlng) {
                    return new L.LatLng(latlng.lat, latlng.lng);
                });
            }

            function convertToLeafletMultiLatLngs(paths) {
                return paths.map(function(latlngs) {
                    return convertToLeafletLatLngs(latlngs);
                });
            }

            function setupControls() {
                //@TODO add document for this option  11.08 2013 (houqp)
                if (map.zoomControl && $scope.defaults && $scope.defaults.zoomControlPosition) {
                    map.zoomControl.setPosition($scope.defaults.zoomControlPosition);
                }

                if(map.zoomControl && $scope.defaults && $scope.defaults.zoomControl===false) {
                    map.zoomControl.removeFrom(map);
                }

                if(map.zoomsliderControl && $scope.defaults && !$scope.defaults.zoomsliderControl) {
                    map.zoomsliderControl.removeFrom(map);
                }
            }

            function setupCustomControls() {
                if (!$scope.customControls) {
                    return;
                }

                for(var i = 0, count = $scope.customControls.length; i < count; i++) {
                    map.addControl($scope.customControls[i]);
                }
            }
        }
    };
});
