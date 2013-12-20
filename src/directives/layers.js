angular.module("leaflet-directive").directive('layers', function ($log, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletLayerHelpers) {
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
                createLayer = leafletLayerHelpers.createLayer;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);

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
                leafletLayers.controls = {};
                
                var controlOptions = {
					collapsed: defaults.controlLayer && defaults.controlLayer.collapsed
				};
				if(defaults.controlLayer && isDefined(defaults.controlLayer.control)) {
					leafletLayers.controls.layers =
						defaults.controlLayer.control.apply(this, [[], [], controlOptions]);
				} else {
					leafletLayers.controls.layers = new L.control.layers([[], [], controlOptions]);
				}
				
				if(defaults.controlLayer && isDefined(defaults.controlLayer.position)) {
					leafletLayers.controls.layers.setPosition(defaults.controlLayer.position);
				}
                leafletLayers.controls.layers.addTo(map);


                // Setup all baselayers definitions
                var top = false;
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
                        top = true;
                    }

                    leafletLayers.controls.layers.addBaseLayer(leafletLayers.baselayers[layerName], layers.baselayers[layerName].name);
                }

                // Only add the layers switch selector control if we have more than one baselayer
                if (Object.keys(layers.baselayers).length > 1) {
                    leafletLayers.controls.layers.addTo(map);
                }

                // If there is no visible layer add first to the map
                if (!top && Object.keys(leafletLayers.baselayers).length > 0) {
                    map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                }

                // Setup the Overlays
                leafletLayers.overlays = {};
                for (layerName in layers.overlays) {
                    var newOverlayLayer = createLayer(layers.overlays[layerName]);
                    if (isDefined(newOverlayLayer)) {
                        leafletLayers.overlays[layerName] = newOverlayLayer;
                        // Only add the visible layer to the map, layer control manages the addition to the map
                        // of layers in its control
                        if (layers.overlays[layerName].visible === true) {
                            map.addLayer(leafletLayers.overlays[layerName]);
                        }
                        leafletLayers.controls.layers.addOverlay(leafletLayers.overlays[layerName], layers.overlays[layerName].name);
                    }
                }

                // Watch for the base layers
                leafletScope.$watch('layers.baselayers', function(newBaseLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.baselayers) {
                        if (!isDefined(newBaseLayers[name])) {
                            // Remove the layer from the control
                            leafletLayers.controls.layers.removeLayer(leafletLayers.baselayers[name]);
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.baselayers[name])) {
                                map.removeLayer(leafletLayers.baselayers[name]);
                            }
                            delete leafletLayers.baselayers[name];
                        }
                    }
                    // add new layers
                    for (var new_name in newBaseLayers) {
                        if (!isDefined(leafletLayers.baselayers[new_name])) {
                            var testBaseLayer = createLayer(newBaseLayers[new_name]);
                            if (isDefined(testBaseLayer)) {
                                leafletLayers.baselayers[new_name] = testBaseLayer;
                                // Only add the visible layer to the map, layer control manages the addition to the map
                                // of layers in its control
                                if (newBaseLayers[new_name].top === true) {
                                    map.addLayer(leafletLayers.baselayers[new_name]);
                                }
                                leafletLayers.controls.layers.addBaseLayer(leafletLayers.baselayers[new_name], newBaseLayers[new_name].name);
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
                }, true);

                var overLayersNotVisible = {};

                // Watch for the overlay layers
                leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.overlays) {
                        if (!isDefined(newOverlayLayers[name])) {
                            // Remove the layer from the control
                            leafletLayers.controls.layers.removeLayer(leafletLayers.overlays[name]);
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.overlays[name])) {
                                map.removeLayer(leafletLayers.overlays[name]);
                            }
                            // TODO: Depending on the layer type we will have to delete what's included on it
                            delete leafletLayers.overlays[name];
                        }
                    }

                    // add new layers
                    for (var new_name in newOverlayLayers) {
                        if (!isDefined(leafletLayers.overlays[new_name])) {
                            var testOverlayLayer = createLayer(newOverlayLayers[new_name]);
                            if (isDefined(testOverlayLayer)) {
                                leafletLayers.overlays[new_name] = testOverlayLayer;
                                leafletLayers.controls.layers.addOverlay(leafletLayers.overlays[new_name], newOverlayLayers[new_name].name);
                                if (newOverlayLayers[new_name].visible === true) {
                                    map.addLayer(leafletLayers.overlays[new_name]);
                                }
                            }
                        }

                        // watch for the .visible property to hide/show overLayers
                        if (newOverlayLayers[new_name].visible && !map.hasLayer(leafletLayers.overlays[new_name])) {
                            if (overLayersNotVisible[new_name]) {
                                map.addLayer(overLayersNotVisible[new_name]);
                            } else {
                                leafletLayers.controls.layers.addOverlay(leafletLayers.overlays[new_name], newOverlayLayers[new_name].name);
                                map.addLayer(leafletLayers.overlays[new_name]);
                            }
                        } else if (newOverlayLayers[new_name].visible === false && map.hasLayer(leafletLayers.overlays[new_name])) {
                            overLayersNotVisible[new_name] = leafletLayers.overlays[new_name];
                            map.removeLayer(leafletLayers.overlays[new_name]);
                        }
                    }
                }, true);
            });
        }
    };
});
