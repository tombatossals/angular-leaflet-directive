angular.module("leaflet-directive").directive('layers', function ($log, $q, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',
        controller: function ($scope) {
            $scope.leafletLayers = $q.defer();
            this.getLayers = function() {
                return $scope.leafletLayers.promise;
            };
        },
        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var layers = $scope.layers;
            var leafletLayers;

            controller.getMap().then(function(map) {

                if (isDefined(layers)) {
                    // Do we have a baselayers property?
                    if (!isDefined(layers.baselayers) || Object.keys($scope.layers.baselayers).length <= 0) {
                        // No baselayers property
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        return;
                    }
                    // We have baselayers to add to the map
                    leafletLayers = {};
                    $scope.leafletLayers.resolve(leafletLayers);
                    leafletData.setLayers(leafletLayers, attrs.id);

                    leafletLayers.baselayers = {};
                    leafletLayers.controls = {};
                    leafletLayers.controls.layers = new L.control.layers();
                    leafletLayers.controls.layers.setPosition(defaults.controlLayersPosition);
                    leafletLayers.controls.layers.addTo(map);


                    // Setup all baselayers definitions
                    var top = false;
                    for (var layerName in layers.baselayers) {
                        var newBaseLayer = createLayer(layers.baselayers[layerName]);
                        if (newBaseLayer !== null) {
                            leafletLayers.baselayers[layerName] = newBaseLayer;
                            // Only add the visible layer to the map, layer control manages the addition to the map
                            // of layers in its control
                            if (layers.baselayers[layerName].top === true) {
                                map.addLayer(leafletLayers.baselayers[layerName]);
                                top = true;
                            }
                            leafletLayers.controls.layers.addBaseLayer(leafletLayers.baselayers[layerName], layers.baselayers[layerName].name);
                        }
                    }
                    // If there is no visible layer add first to the map
                    if (!top && Object.keys(leafletLayers.baselayers).length > 0) {
                        map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                    }
                    // Setup the Overlays
                    leafletLayers.overlays = {};
                    for (layerName in layers.overlays) {
                        var newOverlayLayer = createLayer(layers.overlays[layerName]);
                        if (newOverlayLayer !== null) {
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
                    $scope.$watch('layers.baselayers', function(newBaseLayers) {
                        // Delete layers from the array
                        for (var name in leafletLayers.baselayers) {
                            if (newBaseLayers[name] === undefined) {
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
                            if (leafletLayers.baselayers[new_name] === undefined) {
                                var testBaseLayer = createLayer(newBaseLayers[new_name]);
                                if (testBaseLayer !== null) {
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
                        if (Object.keys(leafletLayers.baselayers).length <= 0) {
                            // No baselayers property
                            $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        } else {
                            //we have layers, so we need to make, at least, one active
                            var found = false;
                            // serach for an active layer
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
                        }
                    }, true);

                    // Watch for the overlay layers
                    $scope.$watch('layers.overlays', function(newOverlayLayers) {
                        // Delete layers from the array
                        for (var name in leafletLayers.overlays) {
                            if (newOverlayLayers[name] === undefined) {
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
                            if (leafletLayers.overlays[new_name] === undefined) {
                                var testOverlayLayer = createLayer(newOverlayLayers[new_name]);
                                if (testOverlayLayer !== null) {
                                    leafletLayers.overlays[new_name] = testOverlayLayer;
                                    leafletLayers.controls.layers.addOverlay(leafletLayers.overlays[new_name], newOverlayLayers[new_name].name);
                                    if (newOverlayLayers[new_name].visible === true) {
                                        map.addLayer(leafletLayers.overlays[new_name]);
                                    }
                                }
                            }
                        }
                    }, true);
                }

                function createLayer(layerDefinition) {
                    // Check if the baselayer has a valid type
                    if (!isString(layerDefinition.type)) {
                        $log.error('[AngularJS - Leaflet] A base layer must have a type');
                        return null;
                    } else if (layerDefinition.type !== 'xyz' && layerDefinition.type !== 'wms' && layerDefinition.type !== 'group' && layerDefinition.type !== 'markercluster' && layerDefinition.type !== 'google' && layerDefinition.type !== 'bing') {
                        $log.error('[AngularJS - Leaflet] A layer must have a valid type: "xyz, wms, group, google"');
                        return null;
                    }
                    if (layerDefinition.type === 'xyz' || layerDefinition.type === 'wms') {
                        // XYZ, WMS must have an url
                        if (!isString(layerDefinition.url)) {
                            $log.error('[AngularJS - Leaflet] A base layer must have an url');
                            return null;
                        }
                    }
                    if (!isString(layerDefinition.name)) {
                        $log.error('[AngularJS - Leaflet] A base layer must have a name');
                        return null;
                    }
                    if (layerDefinition.layerParams === undefined || layerDefinition.layerParams === null || typeof layerDefinition.layerParams !== 'object') {
                        layerDefinition.layerParams = {};
                    }
                    if (layerDefinition.layerOptions === undefined || layerDefinition.layerOptions === null || typeof layerDefinition.layerOptions !== 'object') {
                        layerDefinition.layerOptions = {};
                    }
                    // Mix the layer specific parameters with the general Leaflet options. Although this is an overhead
                    // the definition of a base layers is more 'clean' if the two types of parameters are differentiated
                    var layer = null;
                    for (var attrname in layerDefinition.layerParams) {
                        layerDefinition.layerOptions[attrname] = layerDefinition.layerParams[attrname];
                    }
                    switch (layerDefinition.type) {
                        case 'xyz':
                            layer = createXyzLayer(layerDefinition.url, layerDefinition.layerOptions);
                            break;
                        case 'wms':
                            layer = createWmsLayer(layerDefinition.url, layerDefinition.layerOptions);
                            break;
                        case 'group':
                            layer = createGroupLayer();
                            break;
                        case 'markercluster':
                            layer = createMarkerClusterLayer(layerDefinition.layerOptions);
                            break;
                        case 'google':
                            layer = createGoogleLayer(layerDefinition.layerType, layerDefinition.layerOptions);
                            break;
                        case 'bing':
                            layer = createBingLayer(layerDefinition.bingKey, layerDefinition.layerOptions);
                            break;
                        default:
                            layer = null;
                    }

                    //TODO Add $watch to the layer properties
                    return layer;
                }

                function createXyzLayer(url, options) {
                    var layer = L.tileLayer(url, options);
                    return layer;
                }

                function createWmsLayer(url, options) {
                    var layer = L.tileLayer.wms(url, options);
                    return layer;
                }

                function createGroupLayer() {
                    var layer = L.layerGroup();
                    return layer;
                }

                function createMarkerClusterLayer(options) {
                    if (Helpers.MarkerClusterPlugin.isLoaded()) {
                        var layer = new L.MarkerClusterGroup(options);
                        return layer;
                    } else {
                        return null;
                    }
                }

                function createGoogleLayer(type, options) {
				    type = type || 'SATELLITE';
				    if (Helpers.GoogleLayerPlugin.isLoaded()) {
                        var layer = new L.Google(type, options);
                        return layer;
                    } else {
                        return null;
                    }
                }

                function createBingLayer(key, options) {
				    if (Helpers.BingLayerPlugin.isLoaded()) {
                        var layer = new L.BingLayer(key, options);
                        return layer;
                    } else {
                        return null;
                    }
                }
            });
        }
    };
});
