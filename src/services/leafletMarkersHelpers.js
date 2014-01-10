angular.module("leaflet-directive").factory('leafletMarkersHelpers', function ($rootScope, leafletHelpers, $log, leafletEvents) {

    var isDefined = leafletHelpers.isDefined,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isNumber  = leafletHelpers.isNumber,
        isObject = leafletHelpers.isObject,
        safeApply = leafletHelpers.safeApply,
        availableMarkerEvents = leafletEvents.getAvailableMarkerEvents();

    var genLabelEvents = function(leafletScope, logic, marker, scope_watch_name) {
        var labelEvents = leafletEvents.getAvailableLabelEvents();
        for (var i = 0; i < labelEvents.length; i++) {
            var eventName = labelEvents[i];
            marker.label.on(eventName, leafletEvents.genDispatchLabelEvent(leafletScope, eventName, logic, marker.label, scope_watch_name));
        }
    };

    var genDispatchEventCB = function(eventName, logic, scope_watch_name, leafletScope, marker, markerData) {
        return function(e) {
            var broadcastName = 'leafletDirectiveMarker.' + eventName;
            var markerName = scope_watch_name.replace('markers.', '');

            // Broadcast old marker click name for backwards compatibility
            if (eventName === "click") {
                safeApply(leafletScope, function() {
                    $rootScope.$broadcast('leafletDirectiveMarkersClick', markerName);
                });
            } else if (eventName === 'dragend') {
                safeApply(leafletScope, function() {
                    markerData.lat = marker.getLatLng().lat;
                    markerData.lng = marker.getLatLng().lng;
                });
                if (markerData.message) {
                    if (markerData.focus === true) {
                        marker.openPopup();
                    }
                }
            }

            safeApply(leafletScope, function(scope){
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
    };

    var createLeafletIcon = function(iconData) {
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'div') {
            if (!isDefined(iconData.html)) {
                $log.error('[AngularJS - Leaflet] The div icon definition must have an "html" property.');
                return new L.Icon.Default();
            }
            return new L.divIcon(iconData);
        }

        if (!isDefined(iconData)) {
            return new L.Icon.Default();
        }
        return new L.Icon.Default(iconData);
    };

    var _deleteMarker = function(marker, map, layers) {
        marker.closePopup();
        // There is no easy way to know if a marker is added to a layer, so we search for it
        // if there are overlays
        if (isDefined(layers) && isDefined(layers.overlays)) {
            for (var key in layers.overlays) {
                if (layers.overlays[key] instanceof L.LayerGroup) {
                    if (layers.overlays[key].hasLayer(marker)) {
                        layers.overlays[key].removeLayer(marker);
                        return;
                    }
                }
            }
        }
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    };

    return {
        deleteMarker: _deleteMarker,

        createMarker: function(markerData) {
            if (!isDefined(markerData)) {
                $log.error('[AngularJS - Leaflet] The marker definition is not valid.');
                return;
            }

            var markerOptions = {
                icon: createLeafletIcon(markerData.icon),
                title: isDefined(markerData.title) ? markerData.title : '',
                draggable: isDefined(markerData.draggable) ? markerData.draggable : false,
                clickable: isDefined(markerData.clickable) ? markerData.clickable : true,
                riseOnHover: isDefined(markerData.riseOnHover) ? markerData.riseOnHover : false
            };

            return new L.marker(markerData, markerOptions);
        },
        addMarkerEvents: function(marker, name, markerData, leafletScope) {
            var scope_watch_name = "markers." + name;
            var markerEvents = [];
            var i;
            var eventName;
            var logic = "broadcast";

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                markerEvents = availableMarkerEvents;
            } else if (typeof leafletScope.eventBroadcast !== 'object') {
                // Not a valid object
                $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.marker)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    markerEvents = availableMarkerEvents;
                } else if (isObject(leafletScope.eventBroadcast.marker)) {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (leafletScope.eventBroadcast.marker.logic !== undefined && leafletScope.eventBroadcast.marker.logic !== null) {
                        // We take care of possible propagation logic
                        if (leafletScope.eventBroadcast.marker.logic !== "emit" && leafletScope.eventBroadcast.marker.logic !== "broadcast") {
                            // This is an error
                            $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                        } else if (leafletScope.eventBroadcast.marker.logic === "emit") {
                            logic = "emit";
                        }
                    }
                    // Enable / Disable
                    var markerEventsEnable = false, markerEventsDisable = false;
                    if (leafletScope.eventBroadcast.marker.enable !== undefined && leafletScope.eventBroadcast.marker.enable !== null) {
                        if (typeof leafletScope.eventBroadcast.marker.enable === 'object') {
                            markerEventsEnable = true;
                        }
                    }
                    if (leafletScope.eventBroadcast.marker.disable !== undefined && leafletScope.eventBroadcast.marker.disable !== null) {
                        if (typeof leafletScope.eventBroadcast.marker.disable === 'object') {
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
                            for (i = 0; i < leafletScope.eventBroadcast.marker.enable.length; i++) {
                                eventName = leafletScope.eventBroadcast.marker.enable[i];
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
                            for (i = 0; i < leafletScope.eventBroadcast.marker.disable.length; i++) {
                                eventName = leafletScope.eventBroadcast.marker.disable[i];
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
                marker.on(eventName, genDispatchEventCB(eventName, logic, scope_watch_name, leafletScope, marker, markerData), {
                    eventName: eventName,
                    scope_watch_name: scope_watch_name
                });
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(marker.label)) {
                genLabelEvents(leafletScope, logic, marker, scope_watch_name);
            }
        },

        addMarkerWatcher: function(marker, name, leafletScope, layers, map) {
            var clearWatch = leafletScope.$watch("markers."+name, function(markerData, oldMarkerData) {
                if (!isDefined(markerData)) {
                    _deleteMarker(marker, map, layers);
                    clearWatch();
                    return;
                }

                if (!isDefined(oldMarkerData)) {
                    return;
                }
                //TODO Check for layers !== null
                //TODO Check for layers.overlays !== null !== undefined
                // It is possible the the layer has been removed or the layer marker does not exist

                // Update the layer group if present or move it to the map if not
                if (!isString(markerData.layer)) {
                    // There is no layer information, we move the marker to the map if it was in a layer group
                    if (isString(oldMarkerData.layer)) {
                        // Remove from the layer group that is supposed to be
                        if (isDefined(layers.overlays[oldMarkerData.layer])) {
                            if (layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                                layers.overlays[oldMarkerData.layer].removeLayer(marker);
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
                } else if (isDefined(oldMarkerData.layer) || oldMarkerData.layer !== markerData.layer) {
                    // If it was on a layer group we have to remove it
                    if (typeof oldMarkerData.layer === 'string') {
                        if (layers.overlays[oldMarkerData.layer] !== undefined) {
                            if (layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                                layers.overlays[oldMarkerData.layer].removeLayer(marker);
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
                    // The markerData.layer is defined so we add the marker to the layer if it is different from the old data
                    if (layers.overlays[markerData.layer] !== undefined) {
                        // Is a group layer?
                        var layerGroup = layers.overlays[markerData.layer];
                        if (layerGroup instanceof L.LayerGroup) {
                            // The marker goes to a correct layer group, so first of all we add it
                            layerGroup.addLayer(marker);
                            // The marker is automatically added to the map depending on the visibility
                            // of the layer, so we only have to open the popup if the marker is in the map
                            if (map.hasLayer(marker)) {
                                if (markerData.focus === true) {
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
                if (markerData.draggable === undefined || markerData.draggable === null || markerData.draggable !== true) {
                    // If there isn't or wasn't the draggable property or is false and previously true update the dragging
                    // the !== true prevents for not boolean values in the draggable property
                    if (oldMarkerData.draggable !== undefined && oldMarkerData.draggable !== null && oldMarkerData.draggable === true) {
                        if (marker.dragging) {
                            marker.dragging.disable();
                        }
                    }
                } else if (oldMarkerData.draggable === undefined || oldMarkerData.draggable === null || oldMarkerData.draggable !== true) {
                    // The markerData.draggable property must be true so we update if there wasn't a previous value or it wasn't true
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
                if (markerData.icon === undefined || markerData.icon === null || typeof markerData.icon !== 'object') {
                    // If there is no icon property or it's not an object
                    if (oldMarkerData.icon !== undefined && oldMarkerData.icon !== null && typeof oldMarkerData.icon === 'object') {
                        // If there was an icon before restore to the default
                        marker.setIcon(createLeafletIcon());
                        marker.closePopup();
                        marker.unbindPopup();
                        if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                            marker.bindPopup(markerData.message);
                        }
                    }
                } else if (oldMarkerData.icon === undefined || oldMarkerData.icon === null || typeof oldMarkerData.icon !== 'object') {
                    // The markerData.icon exists so we create a new icon if there wasn't an icon before
                    var dragA = false;
                    if (marker.dragging) {
                        dragA = marker.dragging.enabled();
                    }
                    if (Helpers.AwesomeMarkersPlugin.is(markerData.icon)) {
                        // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                        marker.setIcon(markerData.icon);
                        // As the new icon creates a new DOM object some elements, as drag, are reseted.
                    } else if (Helpers.Leaflet.DivIcon.is(markerData.icon) || Helpers.Leaflet.Icon.is(markerData.icon)) {
                        // This is a Leaflet.DivIcon or a Leaflet.Icon
                        marker.setIcon(markerData.icon);
                    } else {
                        // This icon is a icon set in the model trough options
                        marker.setIcon(createLeafletIcon(markerData.icon));
                    }
                    if (dragA) {
                        marker.dragging.enable();
                    }
                    marker.closePopup();
                    marker.unbindPopup();
                    if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                        marker.bindPopup(markerData.message);
                    }
                } else {
                    if (Helpers.AwesomeMarkersPlugin.is(markerData.icon)) {
                        // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                        if (!Helpers.AwesomeMarkersPlugin.equal(markerData.icon, oldMarkerData.icon)) {
                            var dragD = false;
                            if (marker.dragging) {
                                dragD = marker.dragging.enabled();
                            }
                            marker.setIcon(markerData.icon);
                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                            if (dragD) {
                                marker.dragging.enable();
                            }
                            //TODO: Improve depending on anchorPopup
                            marker.closePopup();
                            marker.unbindPopup();
                            if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                                marker.bindPopup(markerData.message);
                            }
                        }
                    } else if (Helpers.Leaflet.DivIcon.is(markerData.icon)) {
                        // This is a Leaflet.DivIcon
                        if (!Helpers.Leaflet.DivIcon.equal(markerData.icon, oldMarkerData.icon)) {
                            var dragE = false;
                            if (marker.dragging) {
                                dragE = marker.dragging.enabled();
                            }
                            marker.setIcon(markerData.icon);
                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                            if (dragE) {
                                marker.dragging.enable();
                            }
                            //TODO: Improve depending on anchorPopup
                            marker.closePopup();
                            marker.unbindPopup();
                            if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                                marker.bindPopup(markerData.message);
                            }
                        }
                    } else if (Helpers.Leaflet.Icon.is(markerData.icon)) {
                        // This is a Leaflet.DivIcon
                        if (!Helpers.Leaflet.Icon.equal(markerData.icon, oldMarkerData.icon)) {
                            var dragF = false;
                            if (marker.dragging) {
                                dragF = marker.dragging.enabled();
                            }
                            marker.setIcon(markerData.icon);
                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                            if (dragF) {
                                marker.dragging.enable();
                            }
                            //TODO: Improve depending on anchorPopup
                            marker.closePopup();
                            marker.unbindPopup();
                            if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                                marker.bindPopup(markerData.message);
                            }
                        }
                    } else {
                        // This icon is an icon defined in the marker model through options
                        // There is an icon and there was an icon so if they are different we create a new icon
                        if (JSON.stringify(markerData.icon) !== JSON.stringify(oldMarkerData.icon)) {
                            var dragG = false;
                            if (marker.dragging) {
                                dragG = marker.dragging.enabled();
                            }
                            marker.setIcon(createLeafletIcon(markerData.icon));
                            if (dragG) {
                                marker.dragging.enable();
                            }
                            //TODO: Improve depending on anchorPopup
                            marker.closePopup();
                            marker.unbindPopup();
                            if (markerData.message !== undefined && markerData.message !== null && typeof markerData.message === 'string' && markerData.message !== "") {
                                marker.bindPopup(markerData.message);
                            }
                        }
                    }
                }

                // Update the Popup message property
                if (markerData.message === undefined || markerData.message === null || typeof markerData.message !== 'string' || markerData.message === "") {
                    // There is no popup to show, so if it has previously existed it must be unbinded
                    if (oldMarkerData.message !== undefined && oldMarkerData.message !== null && typeof oldMarkerData.message === 'string' && oldMarkerData.message !== "") {
                        marker.closePopup();
                        marker.unbindPopup();
                    }
                } else {
                    // There is some text in the popup, so we must show the text or update existing
                    if (oldMarkerData.message === undefined || oldMarkerData.message === null || typeof oldMarkerData.message !== 'string' || oldMarkerData.message === "") {
                        // There was no message before so we create it
                        marker.bindPopup(markerData.message);
                        if (markerData.focus === true) {
                            // If the focus is set, we must open the popup, because we do not know if it was opened before
                            marker.openPopup();
                        }
                    } else if (markerData.message !== oldMarkerData.message) {
                        // There was a different previous message so we update it
                        marker.setPopupContent(markerData.message);
                    }
                }

                // Update the focus property
                if (markerData.focus === undefined || markerData.focus === null || markerData.focus !== true) {
                    // If there is no focus property or it's false
                    if (oldMarkerData.focus !== undefined && oldMarkerData.focus !== null && oldMarkerData.focus === true) {
                        // If there was a focus property and was true we turn it off
                        marker.closePopup();
                    }
                } else if (oldMarkerData.focus === undefined || oldMarkerData.focus === null || oldMarkerData.focus !== true) {
                    // The markerData.focus property must be true so we update if there wasn't a previous value or it wasn't true
                    marker.openPopup();
                } else if(oldMarkerData.focus === true && markerData.focus === true){
                    // Reopen the popup when focus is still true
                    marker.openPopup();
                }

                // Update the lat-lng property (always present in marker properties)
                if (!(isNumber(markerData.lat) && isNumber(markerData.lng))) {
                    $log.warn('There are problems with lat-lng data, please verify your marker model');
                    // Remove the marker from the layers and map if it is not valid
                    if (isDefined(layers)) {
                        if (isDefined(layers.overlays)) {
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
                    // triggers this watch expression. Then we call
                    // setLatLng and triggers move event on marker and
                    // causes digest already in progress error.
                    //
                    // This check is to make sure we don't trigger move
                    // event manually after dragend, which is redundant
                    // anyway. Because before dragend event fired, marker
                    // sate is already updated by leaflet.
                    if (cur_latlng.lat !== markerData.lat || cur_latlng.lng !== markerData.lng) {
                        // if the marker is in a clustermarker layer it has to be removed and added again to the layer
                        var isCluster = false;
                        if (isString(markerData.layer)) {
                            if (Helpers.MarkerClusterPlugin.is(layers.overlays[markerData.layer])) {
                                layers.overlays[markerData.layer].removeLayer(marker);
                                isCluster = true;
                            }
                        }
                        marker.setLatLng([markerData.lat, markerData.lng]);
                        if (isCluster) {
                            layers.overlays[markerData.layer].addLayer(marker);
                        }
                    }
                }
            }, true);
        }
    };
});
