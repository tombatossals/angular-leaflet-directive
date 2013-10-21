angular.module("leaflet-directive", []).service('leafletData', function ($log) {
    var map;

    this.setMap = function(leafletMap) {
        $log.warn("map set");
        map = leafletMap;
    };

    this.getMap = function() {
        return map;
    };
});
