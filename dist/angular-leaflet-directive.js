(function() {

"use strict";

// Determine if a reference is defined
function isDefined(value) {
    return angular.isDefined(value);
}

// Determine if a reference is defined and not null
function isDefinedAndNotNull(value) {
    return angular.isDefined(value) && value !== null;
}

// Determine if a reference is a number
function isNumber(value) {
  return angular.isNumber(value);
}

// Determine if a reference is a string
function isString(value) {
  return angular.isString(value);
}

// Determine if a reference is an array
function isArray(value) {
  return angular.isArray(value);
}

// Determine if a reference is an object
function isObject(value) {
  return angular.isObject(value);
}

// Determine if two objects have the same properties
function equals(o1, o2) {
  return angular.equals(o1, o2);
}

function safeApply($scope, fn) {
    var phase = $scope.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
        $scope.$eval(fn);
    } else {
        $scope.$apply(fn);
    }
}

// Get the mapDefaults dictionary, and override the properties defined by the user
function parseMapDefaults(defaults) {
    var mapDefaults = _getMapDefaults();

    if (isDefined(defaults)) {
        mapDefaults.maxZoom = isDefined(defaults.maxZoom) ?  parseInt(defaults.maxZoom, 10) : mapDefaults.maxZoom;
        mapDefaults.minZoom = isDefined(defaults.minZoom) ?  parseInt(defaults.minZoom, 10) : mapDefaults.minZoom;
        mapDefaults.doubleClickZoom = isDefined(defaults.doubleClickZoom) ?  defaults.doubleClickZoom : mapDefaults.doubleClickZoom;
        mapDefaults.scrollWheelZoom = isDefined(defaults.scrollWheelZoom) ?  defaults.scrollWheelZoom : mapDefaults.doubleClickZoom;
        mapDefaults.zoomControl = isDefined(defaults.zoomControl) ?  defaults.zoomControl : mapDefaults.zoomControl;
        mapDefaults.attributionControl = isDefined(defaults.attributionControl) ?  defaults.attributionControl : mapDefaults.attributionControl;
        mapDefaults.tileLayer = isDefined(defaults.tileLayer) ? defaults.tileLayer : mapDefaults.tileLayer;
        mapDefaults.zoomControlPosition = isDefined(defaults.zoomControlPosition) ? defaults.zoomControlPosition : mapDefaults.zoomControlPosition;
        mapDefaults.keyboard = isDefined(defaults.keyboard) ? defaults.keyboard : mapDefaults.keyboard;
        mapDefaults.dragging = isDefined(defaults.dragging) ? defaults.dragging : mapDefaults.dragging;
        mapDefaults.controlLayersPosition = isDefined(defaults.controlLayersPosition) ? defaults.controlLayersPosition : mapDefaults.controlLayersPosition;

        if (isDefined(defaults.tileLayerOptions)) {
            angular.copy(defaults.tileLayerOptions, mapDefaults.tileLayerOptions);
        }
    }
    return mapDefaults;
}

function _getMapDefaults() {
    return {
        maxZoom: 18,
        minZoom: 1,
        keyboard: true,
        dragging: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
        zoomsliderControl: false,
        zoomControlPosition: 'topleft',
        controlLayersPosition: 'topright',
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        icon: {
            url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon-2x.png',
            size: [25, 41],
            anchor: [12, 40],
            labelAnchor: [10, -20],
            popup: [0, -40],
            shadow: {
                url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
                retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        },
        path: {
            weight: 10,
            opacity: 1,
            color: '#0000ff'
        },
        center: {
            lat: 0,
            lng: 0,
            zoom: 1
        }
    };
}

var Helpers = {
    AwesomeMarkersPlugin: {
        isLoaded: function() {
            if (L.AwesomeMarkers !== undefined) {
                return (L.AwesomeMarkers.Icon !== undefined);
            } else {
                return false;
            }
        },
        is: function(icon) {
            if (this.isLoaded()) {
                return icon instanceof L.AwesomeMarkers.Icon;
            } else {
                return false;
            }
        },
        equal: function (iconA, iconB) {
            if (!this.isLoaded) {
                return false;
            }
            if (this.is(iconA) && this.is(iconB)) {
                return (iconA.options.icon === iconB.options.icon &&
                        iconA.options.iconColor === iconB.options.iconColor &&
                        iconA.options.color === iconB.options.color &&
                        iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                        iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                        iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                        iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1] &&
                        iconA.options.popupAnchor[0] === iconB.options.popupAnchor[0] &&
                        iconA.options.popupAnchor[1] === iconB.options.popupAnchor[1] &&
                        iconA.options.shadowAnchor[0] === iconB.options.shadowAnchor[0] &&
                        iconA.options.shadowAnchor[1] === iconB.options.shadowAnchor[1] &&
                        iconA.options.shadowSize[0] === iconB.options.shadowSize[0] &&
                        iconA.options.shadowSize[1] === iconB.options.shadowSize[1]);
            } else {
                return false;
            }
        }
    },
    MarkerClusterPlugin: {
        isLoaded: function() {
            return L.MarkerClusterGroup !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.MarkerClusterGroup;
            } else {
                return false;
            }
        },
    },
    GoogleLayerPlugin: {
        isLoaded: function() {
            return L.Google !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.Google;
            } else {
                return false;
            }
        },
    },
    BingLayerPlugin: {
        isLoaded: function() {
            return L.BingLayer !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.BingLayer;
            } else {
                return false;
            }
        },
    },
    Leaflet: {
        DivIcon: {
            is: function(icon) {
                return icon instanceof L.DivIcon;
            },
            equal: function(iconA, iconB) {
                if (this.is(iconA) && this.is(iconB)) {
                    return (iconA.options.html === iconB.options.html &&
                            iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                            iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                            iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                            iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1]);
                } else {
                    return false;
                }
            }
        },
        Icon: {
            is: function(icon) {
                return icon instanceof L.Icon;
            },
            equal: function(iconA, iconB) {
                if (this.is(iconA) && this.is(iconB)) {
                    return (iconA.options.iconUrl === iconB.options.iconUrl &&
                            iconA.options.iconRetinaUrl === iconB.options.iconRetinaUrl &&
                            iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                            iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                            iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                            iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1] &&
                            iconA.options.shadowUrl === iconB.options.shadowUrl &&
                            iconA.options.shadowRetinaUrl === iconB.options.shadowRetinaUrl &&
                            iconA.options.shadowSize[0] === iconB.options.shadowSize[0] &&
                            iconA.options.shadowSize[1] === iconB.options.shadowSize[1] &&
                            iconA.options.shadowAnchor[0] === iconB.options.shadowAnchor[0] &&
                            iconA.options.shadowAnchor[1] === iconB.options.shadowAnchor[1] &&
                            iconA.options.popupAnchor[0] === iconB.options.popupAnchor[0] &&
                            iconA.options.popupAnchor[1] === iconB.options.popupAnchor[1]);
                } else {
                    return false;
                }
            }
        }
    }
};

angular.module("leaflet-directive", []).directive('leaflet', function ($log, $q, leafletData) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            defaults: '=defaults',
            maxBounds: '=maxbounds',
            bounds: '=bounds',
            marker: '=marker',
            markers: '=markers',
            legend: '=legend',
            geojson: '=geojson',
            paths: '=paths',
            tiles: '=tiles',
            layers: '=layers',
            controls: '=controls',
            eventBroadcast: '=eventBroadcast'
        },
        template: '<div class="angular-leaflet-map" ng-transclude></div>',
        controller: function ($scope) {
            $scope.leafletMap = $q.defer();
            this.getMap = function () {
                return $scope.leafletMap.promise;
            };
        },

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            leafletData.setDefaults(defaults);

            // If we are going to set maxBounds, undefine the minZoom property
            if (isDefined($scope.maxBounds)) {
                defaults.minZoom = undefined;
            }

            // Set width and height if they are defined
            if (isDefined(attrs.width)) {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }
            if (isDefined(attrs.height)) {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            if (isDefined(attrs.marker)) {
                 $log.warn("[AngularJS - Leaflet] The 'marker' property is currently deprecated, please use the 'markers' property instead.");
            }

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], {
                maxZoom: defaults.maxZoom,
                minZoom: defaults.minZoom,
                keyboard: defaults.keyboard,
                dragging: defaults.dragging,
                zoomControl: defaults.zoomControl,
                doubleClickZoom: defaults.doubleClickZoom,
                scrollWheelZoom: defaults.scrollWheelZoom,
                attributionControl: defaults.attributionControl
            });

            // Resolve the map object to the promises
            $scope.leafletMap.resolve(map);
            leafletData.setMap(map, attrs.id);

            if (!isDefined(attrs.center)) {
                 $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                 map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            // If no layers nor tiles defined, set the default tileLayer
            if (!isDefined(attrs.tiles) && (!isDefined(attrs.layers) || !isDefined(attrs.layers.baselayers))) {
                var tileLayerObj = L.tileLayer(defaults.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj);
            }

            // Set zoom control configuration
            if (isDefined(map.zoomControl) && isDefined(defaults.zoomControlPosition)) {
                map.zoomControl.setPosition(defaults.zoomControlPosition);
            }
        }
    };
});

angular.module("leaflet-directive").directive('center', function ($log, $parse) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var center = $scope.center;
            var bounds = $scope.bounds;

            controller.getMap().then(function(map) {

                if (isDefined(center)) {
                    if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: defaults.maxZoom });
                    }

                    var centerModel = {
                        lat:  $parse("center.lat"),
                        lng:  $parse("center.lng"),
                        zoom: $parse("center.zoom")
                    };
                } else {
                    $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                }

                var movingMap = false;

                $scope.$watch("center", function(center) {
                    if (!isValidCenter(center)) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        updateCenter(map, defaults.center);
                        return;
                    }
                    if (movingMap) {
                        // Can't update. The map is moving.
                        return;
                    }
                    updateCenter(map, center);
                }, true);

                map.on("movestart", function(/* event */) {
                    movingMap = true;
                });

                map.on("moveend", function(/* event */) {
                    movingMap = false;
                    safeApply($scope, function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                        }
                        scope.$emit("centerUpdated");
                    });
                });

                function updateBoundsInScope(map) {
                    if (!bounds) {
                        return;
                    }

                    var leafletBounds = map.getBounds();
                    var sw_latlng = leafletBounds.getSouthWest();
                    var ne_latlng = leafletBounds.getNorthEast();
                    bounds = {
                        southWest: {
                            lat: sw_latlng.lat,
                            lng: sw_latlng.lng
                        },
                        northEast: {
                            lat: ne_latlng.lat,
                            lng: ne_latlng.lng
                        }
                    };
                }

                function updateCenter(map, center) {
                    map.setView([center.lat, center.lng], center.zoom);
                    updateBoundsInScope(map);
                }

                function isValidCenter(center) {
                    return isDefined(center) && isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom);
                }

            });
        }
    };
});

angular.module("leaflet-directive").directive('tiles', function ($log, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var tiles = $scope.tiles;

            controller.getMap().then(function(map) {

                var tileLayerObj;
                var tileLayerUrl = defaults.tileLayer;
                var tileLayerOptions = defaults.tileLayerOptions;

                if (angular.isDefined(tiles) && angular.isDefined(tiles.url)) {
                    tileLayerUrl = tiles.url;
                    $scope.$watch("tiles.url", function(url) {
                        if (angular.isDefined(url)) {
                            tileLayerObj.setUrl(url);
                        }
                    });
                } else {
                    $log.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.");
                }

                if (angular.isDefined(tiles) && angular.isDefined(tiles.options)) {
                    angular.copy(tiles.options, tileLayerOptions);
                }

                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj, attrs.id);
            });
        }
    };
});

angular.module("leaflet-directive").directive('legend', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            controller.getMap().then(function(map) {
                var legend = $scope.legend;

                if (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length) {
                    $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                } else {
                    var legendClass = legend.legendClass ? legend.legendClass : "legend";
                    var position = legend.position || 'bottomright';
                    var leafletLegend = L.control({ position: position });
                    leafletLegend.onAdd = function (map) {
                        var div = L.DomUtil.create('div', legendClass);
                        for (var i = 0; i < legend.colors.length; i++) {
                            div.innerHTML +=
                                '<div><i style="background:' + legend.colors[i] + '"></i>' + legend.labels[i] + '</div>';
                        }
                        return div;
                    };
                    leafletLegend.addTo(map);
                }
            });
        }
    };
});

angular.module("leaflet-directive").directive('geojson', function($log, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var leafletGeoJSON;

            controller.getMap().then(function(map) {
                $scope.$watch("geojson", function(geojson) {
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
                                        safeApply($scope, function() {
                                            geojson.selected = feature;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                                        });
                                    },
                                    mouseout: function(e) {
                                        if (resetStyleOnMouseout) {
                                            leafletGeoJSON.resetStyle(e.target);
                                        }
                                        safeApply($scope, function() {
                                            geojson.selected = undefined;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                        });
                                    },
                                    click: function(e) {
                                        safeApply($scope, function() {
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

                        leafletGeoJSON = L.geoJson(geojson.data, geojson.options).addTo(map);
                    }
                });
            });
        }
    };
});

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

angular.module("leaflet-directive").directive('bounds', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            controller.getMap().then(function(map) {
                setupBounds(map);

                function isBoundsValid(bounds) {
                    return isDefined(bounds) && isDefined(bounds.southWest) &&
                        isDefined(bounds.northEast) && isNumber(bounds.southWest.lat) &&
                        isNumber(bounds.southWest.lng) && isNumber(bounds.northEast.lat) &&
                        isNumber(bounds.northEast.lng);
                }

                function setupBounds(map) {
                    $scope.$watch('bounds', function(bounds) {
                        if (!isDefined(bounds) || !isBoundsValid(bounds)) {
                            $log.error('[AngularJS - Leaflet] Invalid bounds');
                            return;
                        }

                        var southWest = bounds.southWest;
                        var northEast = bounds.northEast;
                        var new_latlng_bounds = new L.LatLngBounds(
                                new L.LatLng(southWest.lat, southWest.lng),
                                new L.LatLng(northEast.lat, northEast.lng));

                        if (!map.getBounds().equals(new_latlng_bounds)) {
                            map.fitBounds(new_latlng_bounds);
                        }
                    }, true);
                }
            });
        }
    };
});

angular.module("leaflet-directive").directive('markers', function ($log, $rootScope, $q, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: ['leaflet', '?layers'],

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var mapController = controller[0];

            mapController.getMap().then(function(map) {
                var markers = $scope.markers;
                var getLayers;
                var leafletMarkers = {};
                var groups = {};


                if (isDefined(controller[1])) {
                    getLayers = controller[1].getLayers;
                } else {
                    getLayers = function() {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }

                // Default leaflet icon object used in all markers as a default
                var LeafletIcon = L.Icon.extend({
                    options: {
                        iconUrl: defaults.icon.url,
                        iconRetinaUrl: defaults.icon.retinaUrl,
                        iconSize: defaults.icon.size,
                        iconAnchor: defaults.icon.anchor,
                        labelAnchor: defaults.icon.labelAnchor,
                        popupAnchor: defaults.icon.popup,
                        shadowUrl: defaults.icon.shadow.url,
                        shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
                        shadowSize: defaults.icon.shadow.size,
                        shadowAnchor: defaults.icon.shadow.anchor
                    }
                });

                if (!isDefined(markers)) {
                    return;
                }

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    $scope.$watch('markers', function(newMarkers) {
                        // Delete markers from the array
                        for (var name in leafletMarkers) {
                            if (!isDefined(newMarkers[name])) {
                                // First we check if the marker is in a layer group
                                leafletMarkers[name].closePopup();
                                // There is no easy way to know if a marker is added to a layer, so we search for it
                                // if there are overlays
                                if (isDefinedAndNotNull(layers)) {
                                    if (isDefined(layers.overlays)) {
                                        for (var key in layers.overlays) {
                                            if (layers.overlays[key] instanceof L.LayerGroup) {
                                                if (layers.overlays[key].hasLayer(leafletMarkers[name])) {
                                                    layers.overlays[key].removeLayer(leafletMarkers[name]);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (isDefinedAndNotNull(groups)) {
                                    for (var groupKey in groups) {
                                        if (groups[groupKey].hasLayer(leafletMarkers[name])) {
                                            groups[groupKey].removeLayer(leafletMarkers[name]);
                                        }
                                    }
                                }

                                // Remove the marker from the map
                                map.removeLayer(leafletMarkers[name]);
                                // TODO: If we remove the marker we don't have to clear the $watches?
                                // Delete the marker
                                delete leafletMarkers[name];
                            }
                        }
                        // add new markers
                        for (var new_name in newMarkers) {
                            if (!isDefined(leafletMarkers[new_name])) {
                                var newMarker = createMarker('markers.'+new_name, newMarkers[new_name], map);
                                if (newMarker !== null) {
                                    leafletMarkers[new_name] = newMarker;
                                }
                            }
                        }
                    }, true);

                    function createMarker(scope_watch_name, marker_data, map) {
                        var marker = buildMarker(marker_data);

                        // Marker belongs to a layer group?
                        if (!isDefined(marker_data.layer)) {
                            if (isDefined(marker_data.group)) {
                                if (!isDefined(groups[marker_data.group])) {
                                    groups[marker_data.group] = L.markerClusterGroup({ spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false });
                                    map.addLayer(groups[marker_data.group]);
                                }
                                groups[marker_data.group].addLayer(marker);
                            } else {
                                // We do not have a layer attr, so the marker goes to the map layer
                                map.addLayer(marker);
                            }
                            if (isDefined(L.Label) && isDefined(marker_data.label) && isDefined(marker_data.label.options)) {
                                if (marker_data.label.options.noHide === true) {
                                    marker.showLabel();
                                }
                            }
                            if (marker_data.focus === true) {
                                marker.openPopup();
                            }
                        } else if (isString(marker_data.layer)) {
                            if (isDefinedAndNotNull(layers)) {
                                // We have layers so continue testing
                                if (isDefinedAndNotNull(layers.overlays)) {
                                    // There is a layer name so we will try to add it to the layer, first does the layer exists
                                    if (isDefinedAndNotNull(layers.overlays[marker_data.layer])) {
                                        // Is a group layer?
                                        var layerGroup = layers.overlays[marker_data.layer];
                                        if (layerGroup instanceof L.LayerGroup) {
                                            // The marker goes to a correct layer group, so first of all we add it
                                            layerGroup.addLayer(marker);
                                            // The marker is automatically added to the map depending on the visibility
                                            // of the layer, so we only have to open the popup if the marker is in the map
                                            if (map.hasLayer(marker)) {
                                                if (marker_data.focus === true) {
                                                    marker.openPopup();
                                                }
                                            }
                                        } else {
                                            $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                            return null;
                                        }
                                    } else {
                                        $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                                        return null;
                                    }
                                } else {
                                    $log.error('[AngularJS - Leaflet] You must add layers overlays to the directive if used in a marker');
                                    return null;
                                }
                            } else {
                                $log.error('[AngularJS - Leaflet] You must add layers to the directive if used in a marker');
                                return null;
                            }
                        } else {
                            $log.error('[AngularJS - Leaflet] A layername must be a string');
                            return null;
                        }

                        function genDispatchEventCB(eventName, logic) {
                            return function(e) {
                                var broadcastName = 'leafletDirectiveMarker.' + eventName;
                                var markerName = scope_watch_name.replace('markers.', '');

                                // Broadcast old marker click name for backwards compatibility
                                if (eventName === "click") {
                                    safeApply($scope, function() {
                                        $rootScope.$broadcast('leafletDirectiveMarkersClick', markerName);
                                    });
                                } else if (eventName === 'dragend') {
                                    safeApply($scope, function() {
                                        marker_data.lat = marker.getLatLng().lat;
                                        marker_data.lng = marker.getLatLng().lng;
                                    });
                                    if (marker_data.message) {
                                        if (marker_data.focus === true) {
                                            marker.openPopup();
                                        }
                                    }
                                }

                                safeApply($scope, function(scope){
                                    if (logic === "emit") {
                                        scope.$emit(broadcastName, {
                                            markerName: markerName,
                                            leafletEvent: e
                                        });
                                    } else {
                                        $rootScope.$broadcast(broadcastName, {
                                            markerName: markerName,
                                            leafletEvent: e
                                        });
                                    }
                                });
                            };
                        }

                        // Set up marker event broadcasting
                        var availableMarkerEvents = [
                            'click',
                            'dblclick',
                            'mousedown',
                            'mouseover',
                            'mouseout',
                            'contextmenu',
                            'dragstart',
                            'drag',
                            'dragend',
                            'move',
                            'remove',
                            'popupopen',
                            'popupclose'
                        ];

                        var markerEvents = [];
                        var i;
                        var eventName;
                        var logic = "broadcast";

                        if ($scope.eventBroadcast === undefined || $scope.eventBroadcast === null) {
                            // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                            markerEvents = availableMarkerEvents;
                        } else if (typeof $scope.eventBroadcast !== 'object') {
                            // Not a valid object
                            $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                        } else {
                            // We have a possible valid object
                            if ($scope.eventBroadcast.marker === undefined || $scope.eventBroadcast.marker === null) {
                                // We do not have events enable/disable do we do nothing (all enabled by default)
                                markerEvents = availableMarkerEvents;
                            } else if (typeof $scope.eventBroadcast.marker !== 'object') {
                                // Not a valid object
                                $log.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                            } else {
                                // We have a possible valid map object
                                // Event propadation logic
                                if ($scope.eventBroadcast.marker.logic !== undefined && $scope.eventBroadcast.marker.logic !== null) {
                                    // We take care of possible propagation logic
                                    if ($scope.eventBroadcast.marker.logic !== "emit" && $scope.eventBroadcast.marker.logic !== "broadcast") {
                                        // This is an error
                                        $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                                    } else if ($scope.eventBroadcast.marker.logic === "emit") {
                                        logic = "emit";
                                    }
                                }
                                // Enable / Disable
                                var markerEventsEnable = false, markerEventsDisable = false;
                                if ($scope.eventBroadcast.marker.enable !== undefined && $scope.eventBroadcast.marker.enable !== null) {
                                    if (typeof $scope.eventBroadcast.marker.enable === 'object') {
                                        markerEventsEnable = true;
                                    }
                                }
                                if ($scope.eventBroadcast.marker.disable !== undefined && $scope.eventBroadcast.marker.disable !== null) {
                                    if (typeof $scope.eventBroadcast.marker.disable === 'object') {
                                        markerEventsDisable = true;
                                    }
                                }
                                if (markerEventsEnable && markerEventsDisable) {
                                    // Both are active, this is an error
                                    $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                                } else if (!markerEventsEnable && !markerEventsDisable) {
                                    // Both are inactive, this is an error
                                    $log.warn("[AngularJS - Leaflet] must enable or disable events");
                                } else {
                                    // At this point the marker object is OK, lets enable or disable events
                                    if (markerEventsEnable) {
                                        // Enable events
                                        for (i = 0; i < $scope.eventBroadcast.marker.enable.length; i++) {
                                            eventName = $scope.eventBroadcast.marker.enable[i];
                                            // Do we have already the event enabled?
                                            if (markerEvents.indexOf(eventName) !== -1) {
                                                // Repeated event, this is an error
                                                $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                            } else {
                                                // Does the event exists?
                                                if (availableMarkerEvents.indexOf(eventName) === -1) {
                                                    // The event does not exists, this is an error
                                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                                } else {
                                                    // All ok enable the event
                                                    markerEvents.push(eventName);
                                                }
                                            }
                                        }
                                    } else {
                                        // Disable events
                                        markerEvents = availableMarkerEvents;
                                        for (i = 0; i < $scope.eventBroadcast.marker.disable.length; i++) {
                                            eventName = $scope.eventBroadcast.marker.disable[i];
                                            var index = markerEvents.indexOf(eventName);
                                            if (index === -1) {
                                                // The event does not exist
                                                $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                            } else {
                                                markerEvents.splice(index, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        for (i = 0; i < markerEvents.length; i++) {
                            eventName = markerEvents[i];
                            marker.on(eventName, genDispatchEventCB(eventName, logic), {
                                eventName: eventName,
                                scope_watch_name: scope_watch_name
                            });
                        }

                        var clearWatch = $scope.$watch(scope_watch_name, function(data, old_data) {
                            if (!isDefinedAndNotNull(data)) {
                                marker.closePopup();
                                // There is no easy way to know if a marker is added to a layer, so we search for it
                                // if there are overlays
                                if (isDefinedAndNotNull(layers)) {
                                    if (isDefined(layers.overlays)) {
                                        for (var key in layers.overlays) {
                                            if (layers.overlays[key] instanceof L.LayerGroup) {
                                                if (layers.overlays[key].hasLayer(marker)) {
                                                    layers.overlays[key].removeLayer(marker);
                                                }
                                            }
                                        }
                                    }
                                }
                                map.removeLayer(marker);
                                clearWatch();
                                return;
                            }

                            if (isDefined(old_data)) {

                                //TODO Check for layers !== null
                                //TODO Check for layers.overlays !== null !== undefined
                                // It is possible the the layer has been removed or the layer marker does not exist

                                // Update the layer group if present or move it to the map if not
                                if (!isString(data.layer)) {
                                    // There is no layer information, we move the marker to the map if it was in a layer group
                                    if (isString(old_data.layer)) {
                                        // Remove from the layer group that is supposed to be
                                        if (isDefined(layers.overlays[old_data.layer])) {
                                            if (layers.overlays[old_data.layer].hasLayer(marker)) {
                                                layers.overlays[old_data.layer].removeLayer(marker);
                                                // If the marker had a popup we close it because we do not know if the popup in on the map
                                                // or on the layer group. This is ineficient, but as we can't check if the popup is opened
                                                // in Leaflet we can't determine if it has to be open in the new layer. So removing the
                                                // layer group of a marker always closes the popup.
                                                // TODO: Improve popup behaviour when removing a marker from a layer group
                                                marker.closePopup();
                                            }
                                        }
                                        // Test if it is not on the map and add it
                                        if (!map.hasLayer(marker)) {
                                            map.addLayer(marker);
                                        }
                                    }
                                } else if (isDefinedAndNotNull(old_data.layer) || old_data.layer !== data.layer) {
                                    // If it was on a layer group we have to remove it
                                    if (typeof old_data.layer === 'string') {
                                        if (layers.overlays[old_data.layer] !== undefined) {
                                            if (layers.overlays[old_data.layer].hasLayer(marker)) {
                                                layers.overlays[old_data.layer].removeLayer(marker);
                                            }
                                        }
                                    }
                                    // If the marker had a popup we close it because we do not know how the new layer
                                    // will be. This is ineficient, but as we can't check if the opoup is opened in Leaflet
                                    // we can't determine if it has to be open in the new layer. So changing the layer group
                                    // of a marker always closes the popup.
                                    // TODO: Improve popup behaviour when changing a marker from a layer group
                                    marker.closePopup();
                                    // Remove it from the map in case the new layer is hidden or there is an error in the new layer
                                    if (map.hasLayer(marker)) {
                                        map.removeLayer(marker);
                                    }
                                    // The data.layer is defined so we add the marker to the layer if it is different from the old data
                                    if (layers.overlays[data.layer] !== undefined) {
                                        // Is a group layer?
                                        var layerGroup = layers.overlays[data.layer];
                                        if (layerGroup instanceof L.LayerGroup) {
                                            // The marker goes to a correct layer group, so first of all we add it
                                            layerGroup.addLayer(marker);
                                            // The marker is automatically added to the map depending on the visibility
                                            // of the layer, so we only have to open the popup if the marker is in the map
                                            if (map.hasLayer(marker)) {
                                                if (data.focus === true) {
                                                    marker.openPopup();
                                                }
                                            }
                                        } else {
                                            $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                        }
                                    } else {
                                        $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                                    }
                                } else {
                                    // Never has to enter here...
                                }

                                // Update the draggable property
                                if (data.draggable === undefined || data.draggable === null || data.draggable !== true) {
                                    // If there isn't or wasn't the draggable property or is false and previously true update the dragging
                                    // the !== true prevents for not boolean values in the draggable property
                                    if (old_data.draggable !== undefined && old_data.draggable !== null && old_data.draggable === true) {
                                        if (marker.dragging) {
                                            marker.dragging.disable();
                                        }
                                    }
                                } else if (old_data.draggable === undefined || old_data.draggable === null || old_data.draggable !== true) {
                                    // The data.draggable property must be true so we update if there wasn't a previous value or it wasn't true
                                    if (marker.dragging) {
                                        marker.dragging.enable();
                                    } else {
                                        if (L.Handler.MarkerDrag) {
                                            marker.dragging = new L.Handler.MarkerDrag(marker);
                                            marker.options.draggable = true;
                                            marker.dragging.enable();
                                        }
                                    }
                                }

                                // Update the icon property
                                if (data.icon === undefined || data.icon === null || typeof data.icon !== 'object') {
                                    // If there is no icon property or it's not an object
                                    if (old_data.icon !== undefined && old_data.icon !== null && typeof old_data.icon === 'object') {
                                        // If there was an icon before restore to the default
                                        marker.setIcon(new LeafletIcon());
                                        marker.closePopup();
                                        marker.unbindPopup();
                                        if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                            marker.bindPopup(data.message);
                                        }
                                    }
                                } else if (old_data.icon === undefined || old_data.icon === null || typeof old_data.icon !== 'object') {
                                    // The data.icon exists so we create a new icon if there wasn't an icon before
                                    var dragA = false;
                                    if (marker.dragging) {
                                        dragA = marker.dragging.enabled();
                                    }
                                    if (Helpers.AwesomeMarkersPlugin.is(data.icon)) {
                                        // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                                        marker.setIcon(data.icon);
                                        // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                    } else if (Helpers.Leaflet.DivIcon.is(data.icon) || Helpers.Leaflet.Icon.is(data.icon)) {
                                        // This is a Leaflet.DivIcon or a Leaflet.Icon
                                        marker.setIcon(data.icon);
                                    } else {
                                        // This icon is a icon set in the model trough options
                                        marker.setIcon(new LeafletIcon(data.icon));
                                    }
                                    if (dragA) {
                                        marker.dragging.enable();
                                    }
                                    marker.closePopup();
                                    marker.unbindPopup();
                                    if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                        marker.bindPopup(data.message);
                                    }
                                } else {
                                    if (Helpers.AwesomeMarkersPlugin.is(data.icon)) {
                                        // This icon is a L.AwesomeMarkers.Icon so it is using the AwesomeMarker PlugIn
                                        if (!Helpers.AwesomeMarkersPlugin.equal(data.icon, old_data.icon)) {
                                            var dragD = false;
                                            if (marker.dragging) {
                                                dragD = marker.dragging.enabled();
                                            }
                                            marker.setIcon(data.icon);
                                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                            if (dragD) {
                                                marker.dragging.enable();
                                            }
                                            //TODO: Improve depending on anchorPopup
                                            marker.closePopup();
                                            marker.unbindPopup();
                                            if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                                marker.bindPopup(data.message);
                                            }
                                        }
                                    } else if (Helpers.Leaflet.DivIcon.is(data.icon)) {
                                        // This is a Leaflet.DivIcon
                                        if (!Helpers.Leaflet.DivIcon.equal(data.icon, old_data.icon)) {
                                            var dragE = false;
                                            if (marker.dragging) {
                                                dragE = marker.dragging.enabled();
                                            }
                                            marker.setIcon(data.icon);
                                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                            if (dragE) {
                                                marker.dragging.enable();
                                            }
                                            //TODO: Improve depending on anchorPopup
                                            marker.closePopup();
                                            marker.unbindPopup();
                                            if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                                marker.bindPopup(data.message);
                                            }
                                        }
                                    } else if (Helpers.Leaflet.Icon.is(data.icon)) {
                                        // This is a Leaflet.DivIcon
                                        if (!Helpers.Leaflet.Icon.equal(data.icon, old_data.icon)) {
                                            var dragF = false;
                                            if (marker.dragging) {
                                                dragF = marker.dragging.enabled();
                                            }
                                            marker.setIcon(data.icon);
                                            // As the new icon creates a new DOM object some elements, as drag, are reseted.
                                            if (dragF) {
                                                marker.dragging.enable();
                                            }
                                            //TODO: Improve depending on anchorPopup
                                            marker.closePopup();
                                            marker.unbindPopup();
                                            if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                                marker.bindPopup(data.message);
                                            }
                                        }
                                    } else {
                                        // This icon is an icon defined in the marker model through options
                                        // There is an icon and there was an icon so if they are different we create a new icon
                                        if (JSON.stringify(data.icon) !== JSON.stringify(old_data.icon)) {
                                            var dragG = false;
                                            if (marker.dragging) {
                                                dragG = marker.dragging.enabled();
                                            }
                                            marker.setIcon(new LeafletIcon(data.icon));
                                            if (dragG) {
                                                marker.dragging.enable();
                                            }
                                            //TODO: Improve depending on anchorPopup
                                            marker.closePopup();
                                            marker.unbindPopup();
                                            if (data.message !== undefined && data.message !== null && typeof data.message === 'string' && data.message !== "") {
                                                marker.bindPopup(data.message);
                                            }
                                        }
                                    }
                                }

                                // Update the Popup message property
                                if (data.message === undefined || data.message === null || typeof data.message !== 'string' || data.message === "") {
                                    // There is no popup to show, so if it has previously existed it must be unbinded
                                    if (old_data.message !== undefined && old_data.message !== null && typeof old_data.message === 'string' && old_data.message !== "") {
                                        marker.closePopup();
                                        marker.unbindPopup();
                                    }
                                } else {
                                    // There is some text in the popup, so we must show the text or update existing
                                    if (old_data.message === undefined || old_data.message === null || typeof old_data.message !== 'string' || old_data.message === "") {
                                        // There was no message before so we create it
                                        marker.bindPopup(data.message);
                                        if (data.focus === true) {
                                            // If the focus is set, we must open the popup, because we do not know if it was opened before
                                            marker.openPopup();
                                        }
                                    } else if (data.message !== old_data.message) {
                                        // There was a different previous message so we update it
                                        marker.setPopupContent(data.message);
                                    }
                                }

                                // Update the focus property
                                if (data.focus === undefined || data.focus === null || data.focus !== true) {
                                    // If there is no focus property or it's false
                                    if (old_data.focus !== undefined && old_data.focus !== null && old_data.focus === true) {
                                        // If there was a focus property and was true we turn it off
                                        marker.closePopup();
                                    }
                                } else if (old_data.focus === undefined || old_data.focus === null || old_data.focus !== true) {
                                    // The data.focus property must be true so we update if there wasn't a previous value or it wasn't true
                                    marker.openPopup();
                                } else if(old_data.focus === true && data.focus === true){
                                    // Reopen the popup when focus is still true
                                    marker.openPopup();
                                }

                                // Update the lat-lng property (always present in marker properties)
                                if (!(isNumber(data.lat) && isNumber(data.lng))) {
                                    $log.warn('There are problems with lat-lng data, please verify your marker model');
                                    // Remove the marker from the layers and map if it is not valid
                                    if (isDefinedAndNotNull(layers)) {
                                        if (isDefinedAndNotNull(layers.overlays)) {
                                            for (var olname in layers.overlays) {
                                                if (layers.overlays[olname] instanceof L.LayerGroup || Helpers.MarkerClusterPlugin.is(layers.overlays[olname])) {
                                                    if (layers.overlays[olname].hasLayer(marker)) {
                                                        layers.overlays[olname].removeLayer(marker);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    map.removeLayer(marker);
                                } else {
                                    var cur_latlng = marker.getLatLng();
                                    // On dragend event, scope will be updated, which
                                    // triggers this watch expression. Then we call
                                    // setLatLng and triggers move event on marker and
                                    // causes digest already in progress error.
                                    //
                                    // This check is to make sure we don't trigger move
                                    // event manually after dragend, which is redundant
                                    // anyway. Because before dragend event fired, marker
                                    // sate is already updated by leaflet.
                                    if (cur_latlng.lat !== data.lat || cur_latlng.lng !== data.lng) {
                                        // if the marker is in a clustermarker layer it has to be removed and added again to the layer
                                        var isCluster = false;
                                        if (isString(data.layer)) {
                                            if (Helpers.MarkerClusterPlugin.is(layers.overlays[data.layer])) {
                                                layers.overlays[data.layer].removeLayer(marker);
                                                isCluster = true;
                                            }
                                        }
                                        marker.setLatLng([data.lat, data.lng]);
                                        if (isCluster) {
                                            layers.overlays[data.layer].addLayer(marker);
                                        }
                                    }
                                }
                            }
                        }, true);
                        return marker;
                    }

                    function buildMarker(data) {
                        var micon = null;
                        if (data.icon) {
                            micon = data.icon;
                        } else {
                            micon = new LeafletIcon();
                        }
                        var moptions = {
                            icon: micon,
                            draggable: data.draggable ? true : false
                        };
                        if (data.title) {
                            moptions.title = data.title;
                        }
                        var marker = new L.marker(data, moptions);

                        if (data.message) {
                            marker.bindPopup(data.message);
                        }
                        if (isDefined(L.Label) && isDefined(data.label) && isDefined(data.label.message)) {
                            marker.bindLabel(data.label.message, data.label.options);
                        }

                        return marker;
                    }
                });
            });
        }
    };
});

angular.module("leaflet-directive").directive('paths', function ($log, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var paths = $scope.paths;

            controller.getMap().then(function(map) {

            setupPaths(paths, map, defaults);

            function setupPaths(paths, map, defaults) {
                var leafletPaths = {};
                leafletData.setPaths(leafletPaths, attrs.id);

                if (!isDefined(paths)) {
                    return;
                }

                $scope.$watch("paths", function (newPaths) {
                    for (var new_name in newPaths) {
                        if (!isDefined(leafletPaths[new_name])) {
                            leafletPaths[new_name] = createPath(new_name, newPaths[new_name], map, defaults);
                        }
                    }
                    // Delete paths from the array
                    for (var name in leafletPaths) {
                        if (!isDefined(newPaths[name])) {
                            delete leafletPaths[name];
                        }
                    }
                }, true);
            }

            function createPath(name, scopePath, map, defaults) {
                var path;
                var options = {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                };
                if(isDefined(scopePath.stroke)) {
                    options.stroke = scopePath.stroke;
                }
                if(isDefined(scopePath.fill)) {
                    options.fill = scopePath.fill;
                }
                if(isDefined(scopePath.fillColor)) {
                    options.fillColor = scopePath.fillColor;
                }
                if(isDefined(scopePath.fillOpacity)) {
                    options.fillOpacity = scopePath.fillOpacity;
                }
                if(isDefined(scopePath.smoothFactor)) {
                    options.smoothFactor = scopePath.smoothFactor;
                }
                if(isDefined(scopePath.noClip)) {
                    options.noClip = scopePath.noClip;
                }
                if(!isDefined(scopePath.type)) {
                    scopePath.type = "polyline";
                }

                function setPathOptions(data) {
                    if (isDefined(data.latlngs)) {
                        switch(data.type) {
                            default:
                            case "polyline":
                            case "polygon":
                                path.setLatLngs(convertToLeafletLatLngs(data.latlngs));
                                break;
                            case "multiPolyline":
                            case "multiPolygon":
                                path.setLatLngs(convertToLeafletMultiLatLngs(data.latlngs));
                                break;
                            case "rectangle":
                                path.setBounds(new L.LatLngBounds(convertToLeafletLatLngs(data.latlngs)));
                                break;
                            case "circle":
                            case "circleMarker":
                                path.setLatLng(convertToLeafletLatLng(data.latlngs));
                                if (isDefined(data.radius)) {
                                    path.setRadius(data.radius);
                                }
                                break;
                        }
                    }

                    if (isDefined(data.weight)) {
                        path.setStyle({ weight: data.weight });
                    }

                    if (isDefined(data.color)) {
                        path.setStyle({ color: data.color });
                    }

                    if (isDefined(data.opacity)) {
                        path.setStyle({ opacity: data.opacity });
                    }
                }

                switch(scopePath.type) {
                    default:
                    case "polyline":
                        path = new L.Polyline([], options);
                        break;
                    case "multiPolyline":
                        path = new L.multiPolyline([[[0,0],[1,1]]], options);
                        break;
                    case "polygon":
                        path = new L.Polygon([], options);
                        break;
                    case "multiPolygon":
                        path = new L.MultiPolygon([[[0,0],[1,1],[0,1]]], options);
                        break;
                    case "rectangle":
                        path = new L.Rectangle([[0,0],[1,1]], options);
                        break;
                    case "circle":
                        path = new L.Circle([0,0], 1, options);
                        break;
                    case "circleMarker":
                        path = new L.CircleMarker([0,0], options);
                        break;
                }
                map.addLayer(path);

                var clearWatch = $scope.$watch('paths.' + name, function(data, oldData) {
                    if (!isDefined(data)) {
                        map.removeLayer(path);
                        clearWatch();
                        return;
                    }
                    setPathOptions(data);
                }, true);

                return path;
            }

            function convertToLeafletLatLng(latlng) {
                return new L.LatLng(latlng.lat, latlng.lng);
            }

            function convertToLeafletLatLngs(latlngs) {
                return latlngs.filter(function(latlng) {
                    return !!latlng.lat && !!latlng.lng;
                }).map(function (latlng) {
                    return new L.LatLng(latlng.lat, latlng.lng);
                });
            }

            function convertToLeafletMultiLatLngs(paths) {
                return paths.map(function(latlngs) {
                    return convertToLeafletLatLngs(latlngs);
                });
            }
        });
        }
    };
});

angular.module("leaflet-directive").directive('controls', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var controls = $scope.controls;
            controller.getMap().then(function(map) {
                if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {
                    var drawControl = new L.Control.Draw(controls.draw.options);
                    map.addControl(drawControl);
                }
            });
        }
    };
});

angular.module("leaflet-directive").directive('eventBroadcast', function ($log, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            controller.getMap().then(function(map) {

                function genDispatchMapEvent(eventName, logic) {
                    return function(e) {
                        // Put together broadcast name
                        var broadcastName = 'leafletDirectiveMap.' + eventName;
                        // Safely broadcast the event
                        safeApply($scope, function(scope) {
                            if (logic === "emit") {
                                scope.$emit(broadcastName, {
                                    leafletEvent : e
                                });
                            } else if (logic === "broadcast") {
                                $rootScope.$broadcast(broadcastName, {
                                    leafletEvent : e
                                });
                            }
                        });
                    };
                }

                var availableMapEvents = [
                    'click',
                    'dblclick',
                    'mousedown',
                    'mouseup',
                    'mouseover',
                    'mouseout',
                    'mousemove',
                    'contextmenu',
                    'focus',
                    'blur',
                    'preclick',
                    'load',
                    'unload',
                    'viewreset',
                    'movestart',
                    'move',
                    'moveend',
                    'dragstart',
                    'drag',
                    'dragend',
                    'zoomstart',
                    'zoomend',
                    'zoomlevelschange',
                    'resize',
                    'autopanstart',
                    'layeradd',
                    'layerremove',
                    'baselayerchange',
                    'overlayadd',
                    'overlayremove',
                    'locationfound',
                    'locationerror',
                    'popupopen',
                    'popupclose'
                ];

                var mapEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                if (!isDefinedAndNotNull($scope.eventBroadcast)) {
                    // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                    mapEvents = availableMapEvents;
                } else if (typeof $scope.eventBroadcast !== 'object') {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                } else {
                    // We have a possible valid object
                    if ($scope.eventBroadcast.map === undefined || $scope.eventBroadcast.map === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        mapEvents = availableMapEvents;
                    } else if (typeof $scope.eventBroadcast.map !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if ($scope.eventBroadcast.map.logic !== undefined && $scope.eventBroadcast.map.logic !== null) {
                            // We take care of possible propagation logic
                            if ($scope.eventBroadcast.map.logic !== "emit" && $scope.eventBroadcast.map.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if ($scope.eventBroadcast.map.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var mapEventsEnable = false, mapEventsDisable = false;
                        if ($scope.eventBroadcast.map.enable !== undefined && $scope.eventBroadcast.map.enable !== null) {
                            if (typeof $scope.eventBroadcast.map.enable === 'object') {
                                mapEventsEnable = true;
                            }
                        }
                        if ($scope.eventBroadcast.map.disable !== undefined && $scope.eventBroadcast.map.disable !== null) {
                            if (typeof $scope.eventBroadcast.map.disable === 'object') {
                                mapEventsDisable = true;
                            }
                        }
                        if (mapEventsEnable && mapEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                        } else if (!mapEventsEnable && !mapEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the map object is OK, lets enable or disable events
                            if (mapEventsEnable) {
                                // Enable events
                                for (i = 0; i < $scope.eventBroadcast.map.enable.length; i++) {
                                    eventName = $scope.eventBroadcast.map.enable[i];
                                    // Do we have already the event enabled?
                                    if (mapEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMapEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            mapEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                mapEvents = availableMapEvents;
                                for (i = 0; i < $scope.eventBroadcast.map.disable.length; i++) {
                                    eventName = $scope.eventBroadcast.map.disable[i];
                                    var index = mapEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        mapEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }

                for (i = 0; i < mapEvents.length; i++) {
                    eventName = mapEvents[i];
                    map.on(eventName, genDispatchMapEvent(eventName, logic), {
                        eventName: eventName
                    });
                }
            });
        }
    };
});

angular.module("leaflet-directive").directive('maxbounds', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            controller.getMap().then(function(map) {
            var maxBounds = $scope.maxBounds;
                if (isDefined(maxBounds) && isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast)) {
                    $scope.$watch("maxBounds", function (maxBounds) {
                        if (isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast) && isNumber(maxBounds.southWest.lat) && isNumber(maxBounds.southWest.lng) && isNumber(maxBounds.northEast.lat) && isNumber(maxBounds.northEast.lng)) {
                            map.setMaxBounds(
                                new L.LatLngBounds(
                                    new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                                    new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                                )
                            );
                        }
                    });
                } else {
                    $log.warn("[AngularJS - Leaflet] 'maxBounds' is defined in the current scope, but not correctly initialized.");
                }
            });
        }
    };
});

angular.module("leaflet-directive").service('leafletData', function ($log, $q) {
    var maps = {
        main: $q.defer()
    };
    var tiles = {
        main: $q.defer()
    };
    var layers = {
        main: $q.defer()
    };
    var paths = {
        main: $q.defer()
    };
    var markers = {
        main: $q.defer()
    };
    var defaults = {};

    function getDefer(d, scopeId) {
        if (!isDefined(scopeId)) {
            scopeId = "main";
        }
        var defer;
        if (!isDefined(d[scopeId])) {
            defer = $q.defer();
            d[scopeId] = defer;
        } else {
            defer = d[scopeId];
        }
        return defer;
    }

    this.setMap = function(leafletMap, scopeId) {
        var map = getDefer(maps, scopeId);
        map.resolve(leafletMap);
    };

    this.getMap = function(scopeId) {
        var map = getDefer(maps, scopeId);
        return map.promise;
    };

    this.getDefaults = function() {
        return defaults;
    };

    this.setDefaults = function(leafletDefaults) {
        defaults = leafletDefaults;
    };

    this.getPaths = function(scopeId) {
        var path = getDefer(paths, scopeId);
        return path.promise;
    };

    this.setPaths = function(leafletPaths, scopeId) {
        var path = getDefer(paths, scopeId);
        path.resolve(leafletPaths);
    };

    this.getMarkers = function(scopeId) {
        var marker = getDefer(markers, scopeId);
        return marker.promise;
    };

    this.setMarkers = function(leafletMarkers, scopeId) {
        var marker = getDefer(markers, scopeId);
        marker.resolve(leafletMarkers);
    };

    this.getLayers = function(scopeId) {
        var layer = getDefer(layers, scopeId);
        return layer.promise;
    };

    this.setLayers = function(leafletLayers, scopeId) {
        var layer = getDefer(layers, scopeId);
        layer.resolve(leafletLayers);
    };

    this.setTiles = function(leafletTiles, scopeId) {
        var tile = getDefer(tiles, scopeId);
        tile.resolve(leafletTiles);
    };

    this.getTiles = function(scopeId) {
        var tile = getDefer(tiles, scopeId);
        return tile.promise;
    };
});

}());