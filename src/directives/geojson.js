angular.module("leaflet-directive").directive('geojson', function ($log, $rootScope, leafletData, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                leafletGeoJSON = {};

            controller.getMap().then(function(map) {
                leafletScope.$watch("geojson", function(geojson) {
                    if (!isDefined(geojson)) {
                        return;
                    }

                    if (isDefined(leafletGeoJSON)) {
                        map.removeLayer(leafletGeoJSON);
                    }

                    if (isDefined(geojson.data)) {
                        var resetStyleOnMouseout = geojson.resetStyleOnMouseout,
                            onEachFeatureDefault = function(feature, layer) {
                                layer.on({
                                    mouseover: function(e) {
                                        safeApply(leafletScope, function() {
                                            geojson.selected = feature;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                                        });
                                    },
                                    mouseout: function(e) {
                                        if (resetStyleOnMouseout) {
                                            leafletGeoJSON.resetStyle(e.target);
                                        }
                                        safeApply(leafletScope, function() {
                                            geojson.selected = undefined;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                        });
                                    },
                                    click: function(e) {
                                        safeApply(leafletScope, function() {
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', geojson.selected, e);
                                        });
                                    }
                                });
                            };
                        if (!isDefined(geojson.options)) {
                            // If geojson.options is not defined then set it to the standard.
                            geojson.options = {
                                style: geojson.style,
                                onEachFeature: onEachFeatureDefault
                            };
                        } else if (!isDefined(geojson.options.onEachFeature)) {
                            // If geojson.options is defined, but onEachFeature is not defined then set onEachFeature to the default
                            geojson.options.onEachFeature = onEachFeatureDefault;
                        }

                        leafletGeoJSON = L.geoJson(geojson.data, geojson.options);

                        if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(geojson.options) && isDefined(geojson.options.label)) {
                            leafletGeoJSON.bindLabel(geojson.options.label)
                        }

                        leafletData.setGeoJSON(leafletGeoJSON);
                        leafletGeoJSON.addTo(map);
                    }
                });
            });
        }
    };
});
