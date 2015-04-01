angular.module("leaflet-directive")
.factory('leafletMarkerEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers, leafletLabelEvents) {
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        isObject = leafletHelpers.isObject,
        Helpers = leafletHelpers,
        errorHeader = leafletHelpers.errorHeader,
        fire = leafletEventsHelpers.fire,
        lblHelp = leafletLabelEvents;

    /*
     argument: name: Note this can be a single string or dot notation
     Example:
     markerModel : {
     m1: { lat:_, lon: _}
     }
     //would yield name of
     name = "m1"

     If nested:
     markerModel : {
     cars: {
     m1: { lat:_, lon: _}
     }
     }
     //would yield name of
     name = "cars.m1"
     */
    var _genDispatchMarkerEvent = function (eventName, logic, leafletScope, lObject, name, model, layerName) {
        return function (e) {
            var broadcastName = 'leafletDirectiveMarker.' + eventName;

            // Broadcast old marker click name for backwards compatibility
            if (eventName === "click") {
                safeApply(leafletScope, function () {
                    $rootScope.$broadcast('leafletDirectiveMarkersClick', name);
                });
            } else if (eventName === 'dragend') {
                safeApply(leafletScope, function () {
                    model.lat = lObject.getLatLng().lat;
                    model.lng = lObject.getLatLng().lng;
                });
                if (model.message && model.focus === true) {
                    lObject.openPopup();
                }
            }

            fire(leafletScope, broadcastName, logic, e, e.target || lObject, model, name, layerName);
        };
    };

    var _getAvailableMarkerEvents = function () {
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

    return {
        getAvailableMarkerEvents: _getAvailableMarkerEvents,

        bindMarkerEvents: function (lObject, name, model, leafletScope, layerName) {
            var markerEvents = [];
            var i;
            var eventName;
            var logic = "emit";

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                markerEvents = _getAvailableMarkerEvents();
            } else if (!isObject(leafletScope.eventBroadcast)) {
                // Not a valid object
                $log.error(errorHeader + "event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.marker)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    markerEvents = _getAvailableMarkerEvents();
                } else if (!isObject(leafletScope.eventBroadcast.marker)) {
                    // Not a valid object
                    $log.warn(errorHeader + "event-broadcast.marker must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (leafletScope.eventBroadcast.marker.logic !== undefined && leafletScope.eventBroadcast.marker.logic !== null) {
                        // We take care of possible propagation logic
                        if (leafletScope.eventBroadcast.marker.logic !== "emit" && leafletScope.eventBroadcast.marker.logic !== "broadcast") {
                            // This is an error
                            $log.warn(errorHeader + "Available event propagation logic are: 'emit' or 'broadcast'.");
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
                        $log.warn(errorHeader + "can not enable and disable events at the same time");
                    } else if (!markerEventsEnable && !markerEventsDisable) {
                        // Both are inactive, this is an error
                        $log.warn(errorHeader + "must enable or disable events");
                    } else {
                        // At this point the marker object is OK, lets enable or disable events
                        if (markerEventsEnable) {
                            // Enable events
                            for (i = 0; i < leafletScope.eventBroadcast.marker.enable.length; i++) {
                                eventName = leafletScope.eventBroadcast.marker.enable[i];
                                // Do we have already the event enabled?
                                if (markerEvents.indexOf(eventName) !== -1) {
                                    // Repeated event, this is an error
                                    $log.warn(errorHeader + "This event " + eventName + " is already enabled");
                                } else {
                                    // Does the event exists?
                                    if (_getAvailableMarkerEvents().indexOf(eventName) === -1) {
                                        // The event does not exists, this is an error
                                        $log.warn(errorHeader + "This event " + eventName + " does not exist");
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
                                    $log.warn(errorHeader + "This event " + eventName + " does not exist or has been already disabled");

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
                lObject.on(eventName,
                    _genDispatchMarkerEvent(eventName, logic, leafletScope, lObject, name, model, layerName));
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(lObject.label)) {
                lblHelp.genLabelEvents(name, logic, leafletScope, lObject, model, layerName);
            }
        }
    };
});
