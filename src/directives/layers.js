angular.module("leaflet-directive").directive('layers', function ($log, $q, leafletData, leafletHelpers, leafletLayerHelpers, leafletControlHelpers) {
    var _leafletLayers;

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function () {
            _leafletLayers = $q.defer();
            this.getLayers = function() {
                return _leafletLayers.promise;
            };
        },
        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletLayers = {},
                leafletScope  = controller.getLeafletScope(),
                layers = leafletScope.layers,
                createLayer = leafletLayerHelpers.createLayer,
                updateLayersControl = leafletControlHelpers.updateLayersControl,
                isLayersControlVisible = false;

            controller.getMap().then(function(map) {
                // Do we have a baselayers property?
                if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
                    // No baselayers property
                    $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                    return;
                }

                // We have baselayers to add to the map
                _leafletLayers.resolve(leafletLayers);
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
                        map.addLayer(leafletLayers.baselayers[layerName]);
                        oneVisibleLayer = true;
                    }
                }

                // If there is no visible layer add first to the map
                if (!oneVisibleLayer && Object.keys(leafletLayers.baselayers).length > 0) {
                    map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                }

                // Setup the Overlays
                for (layerName in layers.overlays) {
                    var newOverlayLayer = createLayer(layers.overlays[layerName]);
                    if (!isDefined(newOverlayLayer)) {
                        delete layers.overlays[layerName];
                        continue;
                    }
                    leafletLayers.overlays[layerName] = newOverlayLayer;
                    // Only add the visible overlays to the map
                    if (layers.overlays[layerName].visible === true) {
                        map.addLayer(leafletLayers.overlays[layerName]);
                    }
                }

                // Watch for the base layers
                leafletScope.$watch('layers.baselayers', function(newBaseLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.baselayers) {
                        if (!isDefined(newBaseLayers[name])) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.baselayers[name])) {
                                map.removeLayer(leafletLayers.baselayers[name]);
                            }
                            delete leafletLayers.baselayers[name];
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
                                    map.addLayer(leafletLayers.baselayers[newName]);
                                }
                            }
                        }
                    }
                    if (Object.keys(leafletLayers.baselayers).length === 0) {
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        return;
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
                    if (!found) {
                        map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                    }

                    // Only show the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, newBaseLayers, layers.overlays, leafletLayers);
                }, true);

                // Watch for the overlay layers
                leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.overlays) {
                        if (!isDefined(newOverlayLayers[name])) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.overlays[name])) {
                                map.removeLayer(leafletLayers.overlays[name]);
                            }
                            // TODO: Depending on the layer type we will have to delete what's included on it
                            delete leafletLayers.overlays[name];
                        }
                    }

                    // add new overlays
                    for (var newName in newOverlayLayers) {
                        if (!isDefined(leafletLayers.overlays[newName])) {
                            var testOverlayLayer = createLayer(newOverlayLayers[newName]);
                            if (isDefined(testOverlayLayer)) {
                                leafletLayers.overlays[newName] = testOverlayLayer;
                                if (newOverlayLayers[newName].visible === true) {
                                    map.addLayer(leafletLayers.overlays[newName]);
                                }
                            }
                        }

                        // check for the .visible property to hide/show overLayers
                        if (newOverlayLayers[newName].visible && !map.hasLayer(leafletLayers.overlays[newName])) {
                            map.addLayer(leafletLayers.overlays[newName]);
                        } else if (newOverlayLayers[newName].visible === false && map.hasLayer(leafletLayers.overlays[newName])) {
                            map.removeLayer(leafletLayers.overlays[newName]);
                        }
                    }

                    // Only add the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, layers.baselayers, newOverlayLayers, leafletLayers);
                }, true);
            });
        }
    };
});
