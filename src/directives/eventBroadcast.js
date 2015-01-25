angular.module("leaflet-directive").directive('eventBroadcast', function ($log, $rootScope, leafletHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isObject = leafletHelpers.isObject,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                eventBroadcast = leafletScope.eventBroadcast,
                availableMapEvents = leafletEvents.getAvailableMapEvents(),
                genDispatchMapEvent = leafletEvents.genDispatchMapEvent;

            controller.getMap().then(function(map) {

                var mapEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                // We have a possible valid object
                if (!isDefined(eventBroadcast.map)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    mapEvents = availableMapEvents;
                } else if (!isObject(eventBroadcast.map)) {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (eventBroadcast.map.logic !== "emit" && eventBroadcast.map.logic !== "broadcast") {
                        // This is an error
                        $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                    } else {
                        logic = eventBroadcast.map.logic;
                    }

                    if (!(isObject(eventBroadcast.map.enable) && eventBroadcast.map.enable.length >= 0)) {
                        $log.warn("[AngularJS - Leaflet] event-broadcast.map.enable must be an object check your model.");
                    } else {
                        // Enable events
                        for (i = 0; i < eventBroadcast.map.enable.length; i++) {
                            eventName = eventBroadcast.map.enable[i];
                            // Do we have already the event enabled?
                            if (mapEvents.indexOf(eventName) === -1 && availableMapEvents.indexOf(eventName) !== -1) {
                                mapEvents.push(eventName);
                            }
                        }
                    }

                }

                for (i = 0; i < mapEvents.length; i++) {
                    eventName = mapEvents[i];
                    map.on(eventName, genDispatchMapEvent(leafletScope, eventName, logic), {
                        eventName: eventName
                    });
                }
            });
        }
    };
});
