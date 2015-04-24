angular.module("leaflet-directive").factory('leafletEvents',
    function (leafletMapEvents, leafletMarkerEvents, leafletPathEvents) {
        var retObj = {};
        angular.extend(retObj,
            leafletMapEvents, {
                bindMarkerEvents: leafletMarkerEvents.bindEvents
            },
            leafletPathEvents);
        return retObj;
});
