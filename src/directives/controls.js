angular.module("leaflet-directive").directive('controls', function ($log, leafletHelpers, leafletLayerHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: '?^leaflet',

        link: function(scope, element, attrs, controller) {
            if(!controller) {
                return;
            }

            var isDefined = leafletHelpers.isDefined,
                createLayer = leafletLayerHelpers.createLayer,
                leafletScope  = controller.getLeafletScope(),
                controls = leafletScope.controls,
                errorHeader = leafletHelpers.errorHeader + ' [Controls] ';

            controller.getMap().then(function(map) {
                if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {

                    if (!isDefined(controls.edit)) {
                        controls.edit = { featureGroup: new L.FeatureGroup() };
                        map.addLayer(controls.edit.featureGroup);
                    }

                    var drawControl = new L.Control.Draw(controls);
                    map.addControl(drawControl);
                }

                if (isDefined(controls.scale)) {
                    var scaleControl = new L.control.scale(controls.scale);
                    map.addControl(scaleControl);
                }

                if (isDefined(controls.fullscreen)) {
                    if (leafletHelpers.FullScreenControlPlugin.isLoaded()) {
                        var fullscreenControl = new L.Control.Fullscreen(controls.fullscreen);
                        map.addControl(fullscreenControl);
                    } else {
                        $log.error(errorHeader + ' Fullscreen plugin is not loaded.');
                    }
                }

                if(isDefined(controls.minimap)) {
                    if (leafletHelpers.MiniMapControlPlugin.isLoaded()) {
                        if(isDefined(controls.minimap.layer)) {
                            var layer = createLayer(controls.minimap.layer);
                            delete controls.minimap.layer;

                            if(isDefined(layer)) {
                                if(isDefined(leafletScope.center)) {
                                    var moveend = function(/* event */) {
                                        var minimapControl = new L.Control.MiniMap(layer, controls.minimap);
                                        map.addControl(minimapControl);
                                        map.off('moveend', moveend);
                                    };
                                    map.on('moveend', moveend);
                                } else {
                                    var minimapControl = new L.Control.MiniMap(layer, controls.minimap);
                                    map.addControl(minimapControl);
                                }
                            } else {
                                $log.warn(errorHeader + ' Layer could not be created.');
                            }
                        } else {
                            $log.warn(errorHeader +' Layer option should be defined.');
                        }
                    } else {
                        $log.error(errorHeader + ' Minimap plugin is not loaded.');
                    }
                }

                if (isDefined(controls.custom)) {
                    for(var i in controls.custom) {
                        map.addControl(controls.custom[i]);
                    }
                }
            });
        }
    };
});
