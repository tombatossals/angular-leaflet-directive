angular.module("leaflet-directive").factory('leafletEvents', function ($rootScope, $q, $log, leafletHelpers) {
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        isObject = leafletHelpers.isObject,
        Helpers = leafletHelpers;

    var _getAvailableLabelEvents = function() {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu'
        ];
    };

    var genLabelEvents = function(leafletScope, logic, marker, name) {
        var labelEvents = _getAvailableLabelEvents();
        var scopeWatchName = "markers." + name;
        for (var i = 0; i < labelEvents.length; i++) {
            var eventName = labelEvents[i];
            marker.label.on(eventName, genDispatchLabelEvent(leafletScope, eventName, logic, marker.label, scopeWatchName));
        }
    };

    var genDispatchMarkerEvent = function(eventName, logic, leafletScope, marker, name, markerData) {
        return function(e) {
            var broadcastName = 'leafletDirectiveMarker.' + eventName;

            // Broadcast old marker click name for backwards compatibility
            if (eventName === "click") {
                safeApply(leafletScope, function() {
                    $rootScope.$broadcast('leafletDirectiveMarkersClick', name);
                });
            } else if (eventName === 'dragend') {
                safeApply(leafletScope, function() {
                    markerData.lat = marker.getLatLng().lat;
                    markerData.lng = marker.getLatLng().lng;
                });
                if (markerData.message && markerData.focus === true) {
                    marker.openPopup();
                }
            }

            safeApply(leafletScope, function(scope){
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        markerName: name,
                        leafletEvent: e
                    });
                } else {
                    $rootScope.$broadcast(broadcastName, {
                        markerName: name,
                        leafletEvent: e
                    });
                }
            });
        };
    };

    var genDispatchPathEvent = function(eventName, logic, leafletScope, marker, name) {
        return function(e) {
            var broadcastName = 'leafletDirectivePath.' + eventName;

            safeApply(leafletScope, function(scope){
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        pathName: name,
                        leafletEvent: e
                    });
                } else {
                    $rootScope.$broadcast(broadcastName, {
                        pathName: name,
                        leafletEvent: e
                    });
                }
            });
        };
    };

    var genDispatchLabelEvent = function(scope, eventName, logic, label, scope_watch_name) {
        return function(e) {
            // Put together broadcast name
            var broadcastName = 'leafletDirectiveLabel.' + eventName;
            var markerName = scope_watch_name.replace('markers.', '');

            // Safely broadcast the event
            safeApply(scope, function(scope) {
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        leafletEvent : e,
                        label: label,
                        markerName: markerName
                    });
                } else if (logic === "broadcast") {
                    $rootScope.$broadcast(broadcastName, {
                        leafletEvent : e,
                        label: label,
                        markerName: markerName
                    });
                }
            });
        };
    };

    var _getAvailableMarkerEvents = function() {
        return [
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
    };

    var _getAvailablePathEvents = function() {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu',
            'add',
            'remove',
            'popupopen',
            'popupclose'
        ];
    };

    return {
        getAvailableMapEvents: function() {
            return [
                'click',
                'dblclick',
                'mousedown',
                'mouseup',
                'mouseover',
                'mouseout',
                'mousemove',
                'contextmenu',
                'focus',
                'blur',
                'preclick',
                'load',
                'unload',
                'viewreset',
                'movestart',
                'move',
                'moveend',
                'dragstart',
                'drag',
                'dragend',
                'zoomstart',
                'zoomend',
                'zoomlevelschange',
                'resize',
                'autopanstart',
                'layeradd',
                'layerremove',
                'baselayerchange',
                'overlayadd',
                'overlayremove',
                'locationfound',
                'locationerror',
                'popupopen',
                'popupclose',
                'draw:created',
                'draw:edited',
                'draw:deleted',
                'draw:drawstart',
                'draw:drawstop',
                'draw:editstart',
                'draw:editstop',
                'draw:deletestart',
                'draw:deletestop'
            ];
        },

        genDispatchMapEvent: function(scope, eventName, logic) {
            return function(e) {
                // Put together broadcast name
                var broadcastName = 'leafletDirectiveMap.' + eventName;
                // Safely broadcast the event
                safeApply(scope, function(scope) {
                    if (logic === "emit") {
                        scope.$emit(broadcastName, {
                            leafletEvent : e
                        });
                    } else if (logic === "broadcast") {
                        $rootScope.$broadcast(broadcastName, {
                            leafletEvent : e
                        });
                    }
                });
            };
        },

        getAvailableMarkerEvents: _getAvailableMarkerEvents,

        getAvailablePathEvents: _getAvailablePathEvents,

        bindMarkerEvents: function(marker, name, markerData, leafletScope) {
            var markerEvents = [];
            var i;
            var eventName;
            var logic = "broadcast";

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                markerEvents = _getAvailableMarkerEvents();
            } else if (!isObject(leafletScope.eventBroadcast)) {
                // Not a valid object
                $log.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.marker)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    markerEvents = _getAvailableMarkerEvents();
                } else if (!isObject(leafletScope.eventBroadcast.marker)) {
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
                                    if (_getAvailableMarkerEvents().indexOf(eventName) === -1) {
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
                            markerEvents = _getAvailableMarkerEvents();
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
                marker.on(eventName, genDispatchMarkerEvent(eventName, logic, leafletScope, marker, name, markerData));
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(marker.label)) {
                genLabelEvents(leafletScope, logic, marker, name);
            }
        },

        bindPathEvents: function(path, name, pathData, leafletScope) {
            var pathEvents = [];
            var i;
            var eventName;
            var logic = "broadcast";

            window.lls = leafletScope;

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                pathEvents = _getAvailablePathEvents();
            } else if (!isObject(leafletScope.eventBroadcast)) {
                // Not a valid object
                $log.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.path)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    pathEvents = _getAvailablePathEvents();
                } else if (isObject(leafletScope.eventBroadcast.paths)) {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast.path must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (leafletScope.eventBroadcast.path.logic !== undefined && leafletScope.eventBroadcast.path.logic !== null) {
                        // We take care of possible propagation logic
                        if (leafletScope.eventBroadcast.path.logic !== "emit" && leafletScope.eventBroadcast.path.logic !== "broadcast") {
                            // This is an error
                            $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                        } else if (leafletScope.eventBroadcast.path.logic === "emit") {
                            logic = "emit";
                        }
                    }
                    // Enable / Disable
                    var pathEventsEnable = false, pathEventsDisable = false;
                    if (leafletScope.eventBroadcast.pats.enable !== undefined && leafletScope.eventBroadcast.path.enable !== null) {
                        if (typeof leafletScope.eventBroadcast.path.enable === 'object') {
                            pathEventsEnable = true;
                        }
                    }
                    if (leafletScope.eventBroadcast.path.disable !== undefined && leafletScope.eventBroadcast.path.disable !== null) {
                        if (typeof leafletScope.eventBroadcast.path.disable === 'object') {
                            pathEventsDisable = true;
                        }
                    }
                    if (pathEventsEnable && pathEventsDisable) {
                        // Both are active, this is an error
                        $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                    } else if (!pathEventsEnable && !pathEventsDisable) {
                        // Both are inactive, this is an error
                        $log.warn("[AngularJS - Leaflet] must enable or disable events");
                    } else {
                        // At this point the path object is OK, lets enable or disable events
                        if (pathEventsEnable) {
                            // Enable events
                            for (i = 0; i < leafletScope.eventBroadcast.path.enable.length; i++) {
                                eventName = leafletScope.eventBroadcast.path.enable[i];
                                // Do we have already the event enabled?
                                if (pathEvents.indexOf(eventName) !== -1) {
                                    // Repeated event, this is an error
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                } else {
                                    // Does the event exists?
                                    if (_getAvailablePathEvents().indexOf(eventName) === -1) {
                                        // The event does not exists, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                    } else {
                                        // All ok enable the event
                                        pathEvents.push(eventName);
                                    }
                                }
                            }
                        } else {
                            // Disable events
                            pathEvents = _getAvailablePathEvents();
                            for (i = 0; i < leafletScope.eventBroadcast.path.disable.length; i++) {
                                eventName = leafletScope.eventBroadcast.path.disable[i];
                                var index = pathEvents.indexOf(eventName);
                                if (index === -1) {
                                    // The event does not exist
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");

                                } else {
                                    pathEvents.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }

            for (i = 0; i < pathEvents.length; i++) {
                eventName = pathEvents[i];
                path.on(eventName, genDispatchPathEvent(eventName, logic, leafletScope, pathEvents, name));
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(path.label)) {
                genLabelEvents(leafletScope, logic, path, name);
            }
        }

    };
});

