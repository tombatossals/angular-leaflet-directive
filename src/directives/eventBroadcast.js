angular.module("leaflet-directive").directive('eventBroadcast', function ($log, $rootScope, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefinedAndNotNull = leafletHelpers.isDefinedAndNotNull,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                eventBroadcast = leafletScope.eventBroadcast;

            controller.getMap().then(function(map) {

                function genDispatchMapEvent(eventName, logic) {
                    return function(e) {
                        // Put together broadcast name
                        var broadcastName = 'leafletDirectiveMap.' + eventName;
                        // Safely broadcast the event
                        safeApply(leafletScope, function(scope) {
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
                }

                var availableMapEvents = [
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
                    'popupclose'
                ];

                var mapEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                if (!isDefinedAndNotNull(eventBroadcast)) {
                    // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                    mapEvents = availableMapEvents;
                } else if (typeof eventBroadcast !== 'object') {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                } else {
                    // We have a possible valid object
                    if (eventBroadcast.map === undefined || eventBroadcast.map === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        mapEvents = availableMapEvents;
                    } else if (typeof eventBroadcast.map !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if (eventBroadcast.map.logic !== undefined && eventBroadcast.map.logic !== null) {
                            // We take care of possible propagation logic
                            if (eventBroadcast.map.logic !== "emit" && eventBroadcast.map.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if (eventBroadcast.map.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var mapEventsEnable = false, mapEventsDisable = false;
                        if (eventBroadcast.map.enable !== undefined && eventBroadcast.map.enable !== null) {
                            if (typeof eventBroadcast.map.enable === 'object') {
                                mapEventsEnable = true;
                            }
                        }
                        if (eventBroadcast.map.disable !== undefined && eventBroadcast.map.disable !== null) {
                            if (typeof eventBroadcast.map.disable === 'object') {
                                mapEventsDisable = true;
                            }
                        }
                        if (mapEventsEnable && mapEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                        } else if (!mapEventsEnable && !mapEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the map object is OK, lets enable or disable events
                            if (mapEventsEnable) {
                                // Enable events
                                for (i = 0; i < eventBroadcast.map.enable.length; i++) {
                                    eventName = eventBroadcast.map.enable[i];
                                    // Do we have already the event enabled?
                                    if (mapEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMapEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            mapEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                mapEvents = availableMapEvents;
                                for (i = 0; i < eventBroadcast.map.disable.length; i++) {
                                    eventName = eventBroadcast.map.disable[i];
                                    var index = mapEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        mapEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }

                for (i = 0; i < mapEvents.length; i++) {
                    eventName = mapEvents[i];
                    map.on(eventName, genDispatchMapEvent(eventName, logic), {
                        eventName: eventName
                    });
                }
            });
        }
    };
});
