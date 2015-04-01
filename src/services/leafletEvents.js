angular.module("leaflet-directive").factory('leafletEvents',
    function (leafletMapEvents, leafletMarkerEvents, leafletPathEvents) {
        var retObj = {};
        angular.extend(retObj,leafletMapEvents, leafletMarkerEvents, leafletPathEvents);
        return retObj;
});
