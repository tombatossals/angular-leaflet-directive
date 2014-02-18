angular.module("leaflet-directive").factory('leafletControlHelpers', function ($rootScope, $log, leafletHelpers) {
    var isObject = leafletHelpers.isObject;

    return {
        addControlLayers: function(map, control, baselayers, overlays, loaded) {
            var numberOfLayers = 0;
            if (isObject(baselayers)) {
                numberOfLayers += Object.keys(baselayers).length;
            }
            if (isObject(overlays)) {
                numberOfLayers += Object.keys(overlays).length;
            }
            if (numberOfLayers > 1 && loaded === false) {
                if (!map.hasLayer(control)) {
                    control.addTo(map);
                }
				return true;
            }
            if(numberOfLayers <= 1 && loaded === true){
				//map.removeControl(control);
				//return false;
            }
            return loaded;
        }
    };
});
