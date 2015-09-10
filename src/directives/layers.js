angular.module("leaflet-directive").directive('layers', function (leafletLogger, $q, leafletData, leafletHelpers, leafletLayerHelpers, leafletControlHelpers) {
    // var $log = leafletLogger;
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function ($scope) {
            $scope._leafletLayers = $q.defer();
            this.getLayers = function () {
                return $scope._leafletLayers.promise;
            };
        },
        link: function(scope, element, attrs, controller){
            var isDefined = leafletHelpers.isDefined,
                leafletLayers = {},
                leafletScope  = controller.getLeafletScope(),
                layers = leafletScope.layers,
                createLayer = leafletLayerHelpers.createLayer,
                safeAddLayer = leafletLayerHelpers.safeAddLayer,
                safeRemoveLayer = leafletLayerHelpers.safeRemoveLayer,
                updateLayersControl = leafletControlHelpers.updateLayersControl,
                isLayersControlVisible = false;

            controller.getMap().then(function(map) {

                // We have baselayers to add to the map
                scope._leafletLayers.resolve(leafletLayers);
                leafletData.setLayers(leafletLayers, attrs.id);

                leafletLayers.baselayers = {};
                leafletLayers.overlays = {};

                var mapId = attrs.id;

                // Setup all baselayers definitions
                var oneVisibleLayer = false;
                for (var layerName in layers.baselayers) {
                    var newBaseLayer = createLayer(layers.baselayers[layerName]);
                    if (!isDefined(newBaseLayer)) {
                        delete layers.baselayers[layerName];
                        continue;
                    }
                    leafletLayers.baselayers[layerName] = newBaseLayer;
                    // Only add the visible layer to the map, layer control manages the addition to the map
                    // of layers in its control
                    if (layers.baselayers[layerName].top === true) {
                        safeAddLayer(map, leafletLayers.baselayers[layerName]);
                        oneVisibleLayer = true;
                    }
                }

                // If there is no visible layer add first to the map
                if (!oneVisibleLayer && Object.keys(leafletLayers.baselayers).length > 0) {
                    safeAddLayer(map, leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                }

                // Setup the Overlays
                for (layerName in layers.overlays) {
                    if(layers.overlays[layerName].type === 'cartodb') {

                    }
                    var newOverlayLayer = createLayer(layers.overlays[layerName]);
                    if (!isDefined(newOverlayLayer)) {
                        delete layers.overlays[layerName];
                        continue;
                    }
                    leafletLayers.overlays[layerName] = newOverlayLayer;
                    // Only add the visible overlays to the map
                    if (layers.overlays[layerName].visible === true) {
                        safeAddLayer(map, leafletLayers.overlays[layerName]);
                    }
                }

                // Watch for the base layers
                leafletScope.$watch('layers.baselayers', function(newBaseLayers, oldBaseLayers) {
                    if(angular.equals(newBaseLayers, oldBaseLayers)) {
                        isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, newBaseLayers, layers.overlays, leafletLayers);
                        return true;
                    }
                    // Delete layers from the array
                    for (var name in leafletLayers.baselayers) {
                        if (!isDefined(newBaseLayers[name]) || newBaseLayers[name].doRefresh) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.baselayers[name])) {
                                map.removeLayer(leafletLayers.baselayers[name]);
                            }
                            delete leafletLayers.baselayers[name];

                            if (newBaseLayers[name] && newBaseLayers[name].doRefresh) {
                                newBaseLayers[name].doRefresh = false;
                            }
                        }
                    }
                    // add new layers
                    for (var newName in newBaseLayers) {
                        if (!isDefined(leafletLayers.baselayers[newName])) {
                            var testBaseLayer = createLayer(newBaseLayers[newName]);
                            if (isDefined(testBaseLayer)) {
                                leafletLayers.baselayers[newName] = testBaseLayer;
                                // Only add the visible layer to the map
                                if (newBaseLayers[newName].top === true) {
                                    safeAddLayer(map, leafletLayers.baselayers[newName]);
                                }
                            }
                        } else {
                            if (newBaseLayers[newName].top === true && !map.hasLayer(leafletLayers.baselayers[newName])) {
                                safeAddLayer(map, leafletLayers.baselayers[newName]);
                            } else if (newBaseLayers[newName].top === false && map.hasLayer(leafletLayers.baselayers[newName])) {
                                map.removeLayer(leafletLayers.baselayers[newName]);
                            }
                        }
                    }

                    //we have layers, so we need to make, at least, one active
                    var found = false;
                    // search for an active layer
                    for (var key in leafletLayers.baselayers) {
                        if (map.hasLayer(leafletLayers.baselayers[key])) {
                            found = true;
                            break;
                        }
                    }
                    // If there is no active layer make one active
                    if (!found && Object.keys(leafletLayers.baselayers).length > 0) {
                        safeAddLayer(map, leafletLayers.baselayers[Object.keys(leafletLayers.baselayers)[0]]);
                    }

                    // Only show the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, newBaseLayers, layers.overlays, leafletLayers);
                }, true);

                // Watch for the overlay layers
                leafletScope.$watch('layers.overlays', function(newOverlayLayers, oldOverlayLayers) {
                    if(angular.equals(newOverlayLayers, oldOverlayLayers)) {
                        isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, layers.baselayers, newOverlayLayers, leafletLayers);
                        return true;
                    }

                    // Delete layers from the array
                    for (var name in leafletLayers.overlays) {
                        if (!isDefined(newOverlayLayers[name]) || newOverlayLayers[name].doRefresh) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.overlays[name])) {
                                // Safe remove when ArcGIS layers is loading.
                                var options = isDefined(newOverlayLayers[name])?
                                    newOverlayLayers[name].layerOptions:null;
                                safeRemoveLayer(map, leafletLayers.overlays[name], options);
                            }
                            // TODO: Depending on the layer type we will have to delete what's included on it
                            delete leafletLayers.overlays[name];

                            if (newOverlayLayers[name] && newOverlayLayers[name].doRefresh) {
                                newOverlayLayers[name].doRefresh = false;
                            }
                        }
                    }

                    // add new overlays
                    for (var newName in newOverlayLayers) {
                        if (!isDefined(leafletLayers.overlays[newName])) {
                            var testOverlayLayer = createLayer(newOverlayLayers[newName]);
                            if (!isDefined(testOverlayLayer)) {
                                // If the layer creation fails, continue to the next overlay
                                continue;
                            }
                            leafletLayers.overlays[newName] = testOverlayLayer;
                            if (newOverlayLayers[newName].visible === true) {
                                safeAddLayer(map, leafletLayers.overlays[newName]);
                            }
                        } else {
                            // check for the .visible property to hide/show overLayers
                            if (newOverlayLayers[newName].visible && !map.hasLayer(leafletLayers.overlays[newName])) {
                                safeAddLayer(map, leafletLayers.overlays[newName]);
                            } else if (newOverlayLayers[newName].visible === false && map.hasLayer(leafletLayers.overlays[newName])) {
                                // Safe remove when ArcGIS layers is loading.
                                safeRemoveLayer(map, leafletLayers.overlays[newName], newOverlayLayers[newName].layerOptions);
                            }
                        }

                        //refresh heatmap data if present
                        if (newOverlayLayers[newName].visible && map._loaded && newOverlayLayers[newName].data && newOverlayLayers[newName].type === "heatmap") {
                            leafletLayers.overlays[newName].setData(newOverlayLayers[newName].data);
                            leafletLayers.overlays[newName].update();
                        }
                    }

                    // Only add the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, layers.baselayers, newOverlayLayers, leafletLayers);
                }, true);
            });
        }
    };
});
