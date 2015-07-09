angular.module("leaflet-directive").factory('leafletEvents',
    function (leafletMapEvents, leafletMarkerEvents, leafletPathEvents, leafletIterators) {
        //NOTE THIS SHOULD BE DEPRECATED infavor of getting a specific events helper
        var instance = angular.extend({},
            leafletMapEvents, {
                bindMarkerEvents: leafletMarkerEvents.bindEvents,
                getAvailableMarkerEvents: leafletMarkerEvents.getAvailableEvents
            }, leafletPathEvents);

        var genDispatchMapEvent = instance.genDispatchMapEvent;

        instance.addEvents =  function(map, mapEvents, contextName, scope, logic){
            leafletIterators.each(mapEvents, function(eventName) {
                var context = {};
                context[contextName] = eventName;
                map.on(eventName, genDispatchMapEvent(scope, eventName, logic), context);
            });
        };

        return instance;
});
