angular.module("leaflet-directive").factory('leafletEvents',
    function (leafletMapEvents, leafletMarkerEvents, leafletPathEvents) {
      //NOTE THIS SHOULD BE DEPRECATED infavor of getting a specific events helper
        return angular.extend({},
            leafletMapEvents, {
                bindMarkerEvents: leafletMarkerEvents.bindEvents,
                getAvailableMarkerEvents: leafletMarkerEvents.getAvailableEvents
            },
            leafletPathEvents);
});
