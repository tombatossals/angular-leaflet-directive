angular.module("leaflet-directive").factory('leafletControlHelpers', function ($rootScope, $log, leafletHelpers, leafletMapDefaults) {
    var isObject = leafletHelpers.isObject,
        isDefined = leafletHelpers.isDefined;
    var _layersControl;

    var _controlLayersMustBeVisible = function(baselayers, overlays) {
        var numberOfLayers = 0;
        if (isObject(baselayers)) {
            numberOfLayers += Object.keys(baselayers).length;
        }
        if (isObject(overlays)) {
            numberOfLayers += Object.keys(overlays).length;
        }
        return numberOfLayers > 1;
    };

    var _createLayersControl = function(mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        var controlOptions = {
            collapsed: defaults.controls.layers.collapsed,
            posiiton: defaults.controls.layers.position
        };
        return new L.control.layers([], [], controlOptions);
    };

    return {
        layersControlMustBeVisible: _controlLayersMustBeVisible,

        updateLayersControl: function(map, mapId, loaded, baselayers, overlays, leafletLayers) {
            var i;

            var mustBeLoaded = _controlLayersMustBeVisible(baselayers, overlays);
            if (isDefined(_layersControl) && loaded) {
                for (i in leafletLayers.baselayers) {
                    _layersControl.removeLayer(leafletLayers.baselayers[i]);
                }
                for (i in leafletLayers.overlays) {
                    _layersControl.removeLayer(leafletLayers.overlays[i]);
                }
                _layersControl.removeFrom(map);
            }

            if (mustBeLoaded) {
                _layersControl = _createLayersControl(mapId);
                for (i in baselayers) {
                    if (isDefined(leafletLayers.baselayers[i])) {
                        _layersControl.addBaseLayer(leafletLayers.baselayers[i], baselayers[i].name);
                    }
                }
                for (i in overlays) {
                    if (isDefined(leafletLayers.overlays[i])) {
                        _layersControl.addOverlay(leafletLayers.overlays[i], overlays[i].name);
                    }
                }
                _layersControl.addTo(map);
            }
            return mustBeLoaded;
        }
    };
});
