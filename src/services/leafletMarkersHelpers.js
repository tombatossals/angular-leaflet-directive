angular.module("leaflet-directive").factory('leafletMarkersHelpers', function ($rootScope, leafletHelpers, $log) {

    var isDefined = leafletHelpers.isDefined,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isNumber  = leafletHelpers.isNumber,
        isObject = leafletHelpers.isObject;

    var createLeafletIcon = function(iconData) {
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'div') {
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

                // Update the lat-lng property (always present in marker properties)
                if (!(isNumber(markerData.lat) && isNumber(markerData.lng))) {
                    $log.warn('There are problems with lat-lng data, please verify your marker model');
                    _deleteMarker(marker, map, layers);
                    return;
                }

                // It is possible the the layer has been removed or the layer marker does not exist
                // Update the layer group if present or move it to the map if not
                if (!isString(markerData.layer)) {
                    // There is no layer information, we move the marker to the map if it was in a layer group
                    if (isString(oldMarkerData.layer)) {
                        // Remove from the layer group that is supposed to be
                        if (isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                            layers.overlays[oldMarkerData.layer].removeLayer(marker);
                            marker.closePopup();
                        }
                        // Test if it is not on the map and add it
                        if (!map.hasLayer(marker)) {
                            map.addLayer(marker);
                        }
                    }
                }

                if (isString(markerData.layer) && (isDefined(oldMarkerData.layer) || oldMarkerData.layer !== markerData.layer)) {
                    // If it was on a layer group we have to remove it
                    if (isString(oldMarkerData.layer) && isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                        layers.overlays[oldMarkerData.layer].removeLayer(marker);
                    }
                    marker.closePopup();

                    // Remove it from the map in case the new layer is hidden or there is an error in the new layer
                    if (map.hasLayer(marker)) {
                        map.removeLayer(marker);
                    }

                    // The markerData.layer is defined so we add the marker to the layer if it is different from the old data
                    if (!isDefined(layers.overlays[markerData.layer])) {
                        $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                        return;
                    }
                    // Is a group layer?
                    var layerGroup = layers.overlays[markerData.layer];
                    if (!(layerGroup instanceof L.LayerGroup)) {
                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                        return;
                    }
                    // The marker goes to a correct layer group, so first of all we add it
                    layerGroup.addLayer(marker);
                    // The marker is automatically added to the map depending on the visibility
                    // of the layer, so we only have to open the popup if the marker is in the map
                    if (map.hasLayer(marker) && markerData.focus === true) {
                        marker.openPopup();
                    }
                }

                // Update the draggable property
                if (markerData.draggable !== true && oldMarkerData.draggable === true && marker.dragging === true) {
                    marker.dragging.disable();
                }
                if (markerData.draggable === true && oldMarkerData.draggable !== true) {
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
                if (!isObject(markerData.icon)) {
                    // If there is no icon property or it's not an object
                    if (isObject(oldMarkerData.icon)) {
                        // If there was an icon before restore to the default
                        marker.setIcon(createLeafletIcon());
                        marker.closePopup();
                        marker.unbindPopup();
                        if (isString(markerData.message)) {
                            marker.bindPopup(markerData.message);
                        }
                    }
                }

                if (isObject(markerData.icon) && isObject(oldMarkerData.icon) && !angular.equals(markerData.icon, oldMarkerData.icon)) {
                    var dragG = false;
                    if (marker.dragging) {
                        dragG = marker.dragging.enabled();
                    }
                    marker.setIcon(createLeafletIcon(markerData.icon));
                    if (dragG) {
                        marker.dragging.enable();
                    }
                    marker.closePopup();
                    marker.unbindPopup();
                    if (isString(markerData.message)) {
                        marker.bindPopup(markerData.message);
                    }
                }

                // Update the Popup message property
                if (!isString(markerData.message) && isString(oldMarkerData.message)) {
                    marker.closePopup();
                    marker.unbindPopup();
                }

                // There is some text in the popup, so we must show the text or update existing
                if (isString(markerData) && !isString(oldMarkerData)) {
                    // There was no message before so we create it
                    marker.bindPopup(markerData.message);
                    if (markerData.focus === true) {
                        // If the focus is set, we must open the popup, because we do not know if it was opened before
                        marker.openPopup();
                    }
                }

                if (isString(markerData) && isString(oldMarkerData) && markerData.message !== oldMarkerData.message) {
                    // There was a different previous message so we update it
                    marker.setPopupContent(markerData.message);
                }

                // Update the focus property
                if (markerData.focus !== true && oldMarkerData.focus === true) {
                    // If there was a focus property and was true we turn it off
                    marker.closePopup();
                }

                // The markerData.focus property must be true so we update if there wasn't a previous value or it wasn't true
                if (markerData.focus === true && oldMarkerData.focus !== true) {
                    marker.openPopup();
                }

                if(oldMarkerData.focus === true && markerData.focus === true){
                    // Reopen the popup when focus is still true
                    marker.openPopup();
                }

                var markerLatLng = marker.getLatLng();
                if (markerLatLng.lat !== markerData.lat || markerLatLng.lng !== markerData.lng) {
                    // if the marker is in a clustermarker layer it has to be removed and added again to the layer
                    var isCluster = false;
                    if (isString(markerData.layer) && Helpers.MarkerClusterPlugin.is(layers.overlays[markerData.layer])) {
                        layers.overlays[markerData.layer].removeLayer(marker);
                        isCluster = true;
                    }
                    marker.setLatLng([markerData.lat, markerData.lng]);
                    if (isCluster) {
                        layers.overlays[markerData.layer].addLayer(marker);
                    }
                }
            }, true);
        }
    };
});
