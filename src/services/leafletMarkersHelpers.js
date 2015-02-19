angular.module("leaflet-directive").factory('leafletMarkersHelpers', function ($rootScope, leafletHelpers, $log, $compile) {

    var isDefined = leafletHelpers.isDefined,
        MarkerClusterPlugin = leafletHelpers.MarkerClusterPlugin,
        AwesomeMarkersPlugin = leafletHelpers.AwesomeMarkersPlugin,
        MakiMarkersPlugin = leafletHelpers.MakiMarkersPlugin,
        ExtraMarkersPlugin = leafletHelpers.ExtraMarkersPlugin,
        safeApply     = leafletHelpers.safeApply,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isNumber  = leafletHelpers.isNumber,
        isObject = leafletHelpers.isObject,
        groups = {};

    var createLeafletIcon = function(iconData) {
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'awesomeMarker') {
            if (!AwesomeMarkersPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The AwesomeMarkers Plugin is not loaded.');
            }

            return new L.AwesomeMarkers.icon(iconData);
        }

        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'makiMarker') {
            if (!MakiMarkersPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The MakiMarkers Plugin is not loaded.');
            }

            return new L.MakiMarkers.icon(iconData);
        }

        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'extraMarker') {
            if (!ExtraMarkersPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The ExtraMarkers Plugin is not loaded.');
            }
            return new L.ExtraMarkers.icon(iconData);
        }

        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'div') {
            return new L.divIcon(iconData);
        }

        // allow for any custom icon to be used... assumes the icon has already been initialized
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'icon') {
            return iconData.icon;
        }

        var base64icon = "data:image/png;base64,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";
        var base64shadow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=";

        if (!isDefined(iconData) || !isDefined(iconData.iconUrl)) {
            return new L.Icon.Default({
                iconUrl: base64icon,
                shadowUrl: base64shadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        }

        return new L.Icon(iconData);
    };

    var _resetMarkerGroup = function(groupName) {
      if (isDefined(groups[groupName])) {
        groups.splice(groupName, 1);
      }
    };

    var _resetMarkerGroups = function() {
      groups = {};
    };

    var _deleteMarker = function(marker, map, layers) {
        marker.closePopup();
        // There is no easy way to know if a marker is added to a layer, so we search for it
        // if there are overlays
        if (isDefined(layers) && isDefined(layers.overlays)) {
            for (var key in layers.overlays) {
                if (layers.overlays[key] instanceof L.LayerGroup || layers.overlays[key] instanceof L.FeatureGroup) {
                    if (layers.overlays[key].hasLayer(marker)) {
                        layers.overlays[key].removeLayer(marker);
                        return;
                    }
                }
            }
        }

        if (isDefined(groups)) {
            for (var groupKey in groups) {
                if (groups[groupKey].hasLayer(marker)) {
                    groups[groupKey].removeLayer(marker);
                }
            }
        }

        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    };

    var _manageOpenPopup = function(marker, markerData) {
        marker.openPopup();

        //the marker may have angular templates to compile
        var popup = marker.getPopup(),
            //the marker may provide a scope returning function used to compile the message
            //default to $rootScope otherwise
            markerScope = angular.isFunction(markerData.getMessageScope) ? markerData.getMessageScope() : $rootScope,
            compileMessage = isDefined(markerData.compileMessage) ? markerData.compileMessage : true;

        if (isDefined(popup)) {
            var updatePopup = function(popup) {
                popup._updateLayout();
                popup._updatePosition();
            };

            if (compileMessage) {
                $compile(popup._contentNode)(markerScope);
                //in case of an ng-include, we need to update the content after template load
                if (isDefined(popup._contentNode) && popup._contentNode.innerHTML.indexOf("ngInclude") > -1) {
                    var unregister = markerScope.$on('$includeContentLoaded', function() {
                        updatePopup(popup);
                        unregister();
                    });
                }
                else {
                    updatePopup(popup);
                }
            }
        }
        if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.options) && markerData.label.options.noHide === true) {
            if (compileMessage) {
                $compile(marker.label._container)(markerScope);
            }
            marker.showLabel();
        }
    };

    return {
        resetMarkerGroup: _resetMarkerGroup,

        resetMarkerGroups: _resetMarkerGroups,

        deleteMarker: _deleteMarker,

        manageOpenPopup: _manageOpenPopup,

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
                riseOnHover: isDefined(markerData.riseOnHover) ? markerData.riseOnHover : false,
                zIndexOffset: isDefined(markerData.zIndexOffset) ? markerData.zIndexOffset : 0,
                iconAngle: isDefined(markerData.iconAngle) ? markerData.iconAngle : 0
            };
            // Add any other options not added above to markerOptions
            for (var markerDatum in markerData) {
                if (markerData.hasOwnProperty(markerDatum) && !markerOptions.hasOwnProperty(markerDatum)) {
                    markerOptions[markerDatum] = markerData[markerDatum];
                }
            }

            var marker = new L.marker(markerData, markerOptions);

            if (!isString(markerData.message)) {
                marker.unbindPopup();
            }

            return marker;
        },

        addMarkerToGroup: function(marker, groupName, groupOptions, map) {
            if (!isString(groupName)) {
                $log.error('[AngularJS - Leaflet] The marker group you have specified is invalid.');
                return;
            }

            if (!MarkerClusterPlugin.isLoaded()) {
                $log.error("[AngularJS - Leaflet] The MarkerCluster plugin is not loaded.");
                return;
            }
            if (!isDefined(groups[groupName])) {
                groups[groupName] = new L.MarkerClusterGroup(groupOptions);
                map.addLayer(groups[groupName]);
            }
            groups[groupName].addLayer(marker);
        },

        listenMarkerEvents: function(marker, markerData, leafletScope, watching) {
            marker.on("popupopen", function(/* event */) {
                if (watching) {
                    safeApply(leafletScope, function() {
                        markerData.focus = true;
                    });
                } else {
                    _manageOpenPopup(marker, markerData);
                }
            });
            marker.on("popupclose", function(/* event */) {
                if (watching) {
                    safeApply(leafletScope, function() {
                        markerData.focus = false;
                    });
                }
            });
        },

        addMarkerWatcher: function(marker, name, leafletScope, layers, map) {
            var clearWatch = leafletScope.$watch("markers[\""+name+"\"]", function(markerData, oldMarkerData) {
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

                // watch is being initialized if old and new object is the same
                var isInitializing = markerData === oldMarkerData;

                // Update marker rotation
                if (isDefined(markerData.iconAngle) && oldMarkerData.iconAngle !== markerData.iconAngle) {
                    marker.setIconAngle(markerData.iconAngle);
                }

                // It is possible that the layer has been removed or the layer marker does not exist
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

                if ((isNumber(markerData.opacity) || isNumber(parseFloat(markerData.opacity))) && markerData.opacity !== oldMarkerData.opacity) {
                    // There was a different opacity so we update it
                    marker.setOpacity(markerData.opacity);
                }

                if (isString(markerData.layer) && oldMarkerData.layer !== markerData.layer) {
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
                    if (!(layerGroup instanceof L.LayerGroup || layerGroup instanceof L.FeatureGroup)) {
                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group" or "featureGroup"');
                        return;
                    }
                    // The marker goes to a correct layer group, so first of all we add it
                    layerGroup.addLayer(marker);
                    // The marker is automatically added to the map depending on the visibility
                    // of the layer, so we only have to open the popup if the marker is in the map
                    if (map.hasLayer(marker) && markerData.focus === true) {
                        _manageOpenPopup(marker, markerData);
                    }
                }

                // Update the draggable property
                if (markerData.draggable !== true && oldMarkerData.draggable === true && (isDefined(marker.dragging))) {
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
                            marker.bindPopup(markerData.message, markerData.popupOptions);
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
                        marker.bindPopup(markerData.message, markerData.popupOptions);
                    }
                }

                // Update the Popup message property
                if (!isString(markerData.message) && isString(oldMarkerData.message)) {
                    marker.closePopup();
                    marker.unbindPopup();
                }

                // Update the label content
                if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message) && !angular.equals(markerData.label.message, oldMarkerData.label.message)) {
                    marker.updateLabelContent(markerData.label.message);
                }

                // There is some text in the popup, so we must show the text or update existing
                if (isString(markerData.message) && !isString(oldMarkerData.message)) {
                    // There was no message before so we create it
                    marker.bindPopup(markerData.message, markerData.popupOptions);
                }

                if (isString(markerData.message) && isString(oldMarkerData.message) && markerData.message !== oldMarkerData.message) {
                    // There was a different previous message so we update it
                    marker.setPopupContent(markerData.message);
                }

                // Update the focus property
                var updatedFocus = false;
                if (markerData.focus !== true && oldMarkerData.focus === true) {
                    // If there was a focus property and was true we turn it off
                    marker.closePopup();
                    updatedFocus = true;
                }

                // The markerData.focus property must be true so we update if there wasn't a previous value or it wasn't true
                if (markerData.focus === true && ( !isDefined(oldMarkerData.focus) || oldMarkerData.focus === false) || (isInitializing && markerData.focus === true)) {
                    // Reopen the popup when focus is still true
                    _manageOpenPopup(marker, markerData);
                    updatedFocus = true;
                }

                // zIndexOffset adjustment
                if (oldMarkerData.zIndexOffset !== markerData.zIndexOffset) {
                    marker.setZIndexOffset(markerData.zIndexOffset);
                }

                var markerLatLng = marker.getLatLng();
                var isCluster = (isString(markerData.layer) && Helpers.MarkerClusterPlugin.is(layers.overlays[markerData.layer]));
                // If the marker is in a cluster it has to be removed and added to the layer when the location is changed
                if (isCluster) {
                    // The focus has changed even by a user click or programatically
                    if (updatedFocus) {
                        // We only have to update the location if it was changed programatically, because it was
                        // changed by a user drag the marker data has already been updated by the internal event
                        // listened by the directive
                        if ((markerData.lat !== oldMarkerData.lat) || (markerData.lng !== oldMarkerData.lng)) {
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        }
                    } else {
                        // The marker has possibly moved. It can be moved by a user drag (marker location and data are equal but old
                        // data is diferent) or programatically (marker location and data are diferent)
                        if ((markerLatLng.lat !== markerData.lat) || (markerLatLng.lng !== markerData.lng)) {
                            // The marker was moved by a user drag
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        } else if ((markerData.lat !== oldMarkerData.lat) || (markerData.lng !== oldMarkerData.lng)) {
                            // The marker was moved programatically
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        } else if (isObject(markerData.icon) && isObject(oldMarkerData.icon) && !angular.equals(markerData.icon, oldMarkerData.icon)) {
                            layers.overlays[markerData.layer].removeLayer(marker);
                            layers.overlays[markerData.layer].addLayer(marker);
                        }
                    }
                } else if (markerLatLng.lat !== markerData.lat || markerLatLng.lng !== markerData.lng) {
                    marker.setLatLng([markerData.lat, markerData.lng]);
                }
            }, true);
        }
    };
});
