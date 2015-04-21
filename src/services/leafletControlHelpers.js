angular.module("leaflet-directive").factory('leafletControlHelpers', function ($rootScope, $log, leafletHelpers, leafletMapDefaults) {
    var isDefined = leafletHelpers.isDefined;
    var isObject = leafletHelpers.isObject;
    var _controls = {};

    var _controlLayersMustBeVisible = function(baselayers, overlays, mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        if(!defaults.controls.layers.visible) {
            return false;
        }

        var atLeastOneControlItemMustBeShown = false;

        if (isObject(baselayers)) {
            Object.keys(baselayers).forEach(function(key) {
                var layer = baselayers[key];
                if (!isDefined(layer.layerOptions) || layer.layerOptions.showOnSelector !== false) {
                    atLeastOneControlItemMustBeShown = true;
                }
            });
        }

        if (isObject(overlays)) {
            Object.keys(overlays).forEach(function(key) {
                var layer = overlays[key];
                if (!isDefined(layer.layerParams) || layer.layerParams.showOnSelector !== false) {
                    atLeastOneControlItemMustBeShown = true;
                }
            });
        }

        return atLeastOneControlItemMustBeShown;
    };

    var _createLayersControl = function(mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        var controlOptions = {
            collapsed: defaults.controls.layers.collapsed,
            position: defaults.controls.layers.position,
            autoZIndex: false
        };

        angular.extend(controlOptions, defaults.controls.layers.options);

        var control;
        if(defaults.controls.layers && isDefined(defaults.controls.layers.control)) {
			control = defaults.controls.layers.control.apply(this, [[], [], controlOptions]);
		} else {
			control = new L.control.layers([], [], controlOptions);
		}

        return control;
    };

    return {
        layersControlMustBeVisible: _controlLayersMustBeVisible,

        updateLayersControl: function(map, mapId, loaded, baselayers, overlays, leafletLayers) {
            var i;
            var _layersControl = _controls[mapId];
            var mustBeLoaded = _controlLayersMustBeVisible(baselayers, overlays, mapId);

            if (isDefined(_layersControl) && loaded) {
                for (i in leafletLayers.baselayers) {
                    _layersControl.removeLayer(leafletLayers.baselayers[i]);
                }
                for (i in leafletLayers.overlays) {
                    _layersControl.removeLayer(leafletLayers.overlays[i]);
                }
                map.removeControl(_layersControl);
                delete _controls[mapId];
            }

            if (mustBeLoaded) {
                _layersControl = _createLayersControl(mapId);
                _controls[mapId] = _layersControl;
                for (i in baselayers) {
                    var hideOnSelector = isDefined(baselayers[i].layerOptions) &&
                                         baselayers[i].layerOptions.showOnSelector === false;
                    if (!hideOnSelector && isDefined(leafletLayers.baselayers[i])) {
                        _layersControl.addBaseLayer(leafletLayers.baselayers[i], baselayers[i].name);
                    }
                }
                for (i in overlays) {
                	var hideOverlayOnSelector = isDefined(overlays[i].layerParams) &&
                            overlays[i].layerParams.showOnSelector === false;
                    if (!hideOverlayOnSelector && isDefined(leafletLayers.overlays[i])) {
                        _layersControl.addOverlay(leafletLayers.overlays[i], overlays[i].name);
                    }
                }

                map.addControl(_layersControl);
            }
            return mustBeLoaded;
        }
    };
});
