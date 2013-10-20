(function() {

"use strict";

// Determine if a reference is defined
function isDefined(value) {
    return angular.isDefined(value);
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

// Determine if two objects have the same properties
function equals(o1, o2) {
  return angular.equals(o1, o2);
}

function _isSafeToApply($scope) {
    var phase = $scope.$root.$$phase;
    return !(phase === '$apply' || phase === '$digest');
}

function safeApply($scope, fn) {
    if (!_isSafeToApply($scope)) {
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
        mapDefaults.doubleClickZoom = isDefined(defaults.doubleClickZoom) && defaults.doubleClickZoom ?  true: false;
        mapDefaults.scrollWheelZoom = isDefined(defaults.scrollWheelZoom) && defaults.scrollWheelZoom ?  true: false;
        mapDefaults.attributionControl = isDefined(defaults.attributionControl) && defaults.attributionControl ?  true: false;
        mapDefaults.tileLayer = isDefined(defaults.tileLayer) ? defaults.tileLayer : mapDefaults.tileLayer;
        if (defaults.tileLayerOptions) {
            angular.copy(defaults.tileLayerOptions, mapDefaults.tileLayerOptions);
        }
    }
    return mapDefaults;
}

function _getMapDefaults() {
    return {
        maxZoom: 14,
        minZoom: 1,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
        zoomsliderControl: false,
        controlLayersPosition: 'topright',
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

// Default leaflet icon object used in all markers as a default
function getMarkerIconDefault() {
    var icon = {
        url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
        retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon-2x.png',
        size: [25, 41],
        anchor: [12, 40],
        popup: [0, -40],
        shadow: {
            url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
            size: [41, 41],
            anchor: [12, 40]
        }
    };

    return L.Icon.extend({
        options: {
            iconUrl: icon.url,
            iconRetinaUrl: icon.retinaUrl,
            iconSize: icon.size,
            iconAnchor: icon.anchor,
            popupAnchor: icon.popup,
            shadowUrl: icon.shadow.url,
            shadowRetinaUrl: icon.shadow.retinaUrl,
            shadowSize: icon.shadow.size,
            shadowAnchor: icon.shadow.anchor
        }
    });
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

var str_inspect_hint = 'Add testing="testing" to <leaflet> tag to inspect this object';

angular.module("leaflet-directive", []).directive('leaflet', function ($http, $log, $parse, $rootScope) {
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
            events: '=events',
            layers: '=layers',
            customControls: '=customControls',
            leafletMap: '=leafletmap',
            eventBroadcast: '=eventBroadcast'
        },
        template: '<div class="angular-leaflet-map" ng-transclude></div>',
        controller: function ($scope) {
            this.getMap = function () {
                return $scope.map;
            };
        },

        link: function($scope, element, attrs/*, ctrl */) {
            var defaults = parseMapDefaults($scope.defaults);

            // If we are going to set maxBounds, undefine the minZoom property
            if ($scope.maxBounds) {
                defaults.minZoom = undefined;
            }

            // Set width and height if they are defined
            if (attrs.width) {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }
            if (attrs.height) {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            // REVIEW
            // use of leafletDirectiveSetMap event is not encouraged. only use
            // it when there is no easy way to bind data to the directive
            $scope.$on('leafletDirectiveSetMap', function(event, message) {
                var meth = message.shift();
                map[meth].apply(map, message);
            });

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], {
                maxZoom: defaults.maxZoom,
                minZoom: defaults.minZoom,
                doubleClickZoom: defaults.doubleClickZoom,
                scrollWheelZoom: defaults.scrollWheelZoom,
                attributionControl: defaults.attributionControl
            });

            $scope.map = map;

            if (!isDefined(attrs.center)) {
                 $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                 map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            if (!isDefined(attrs.tiles) && !isDefined(attrs.layers)) {
                 var tileLayerUrl = defaults.tileLayer;
                 var tileLayerOptions = defaults.tileLayerOptions;
                 var tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                 tileLayerObj.addTo(map);
            }

            setupControls(map, defaults);
            function setupControls(map, defaults) {
                //@TODO add document for this option  11.08 2013 (houqp)
                if (map.zoomControl && isDefined(defaults.zoomControlPosition)) {
                    map.zoomControl.setPosition(defaults.zoomControlPosition);
                }

                if(map.zoomControl && isDefined(defaults.zoomControl) && defaults.zoomControl === false) {
                    map.zoomControl.removeFrom(map);
                }

                if(map.zoomsliderControl && isDefined(defaults.zoomsliderControl) && defaults.zoomsliderControl === false) {
                    map.zoomsliderControl.removeFrom(map);
                }
            }
        }
    };
});

angular.module("leaflet-directive").directive('center', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var center = $scope.center;

            setupCenter(map, center, defaults);

            function updateBoundsInScope(map) {
                if (!$scope.bounds) {
                    return;
                }

                var bounds = map.getBounds();
                var sw_latlng = bounds.getSouthWest();
                var ne_latlng = bounds.getNorthEast();
                $scope.bounds = {
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

            function setupCenter(map, center, defaults) {
                if (isDefined(center)) {
                    if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: defaults.maxZoom });
                    }

                    var centerModel = {
                        lat:  $parse("center.lat"),
                        lng:  $parse("center.lng"),
                        zoom: $parse("center.zoom")
                    };
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
            }
        }
    };
});

angular.module("leaflet-directive").directive('tiles', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var tiles = $scope.tiles;

            setupTiles(map, tiles, defaults);

            function setupTiles(map, tiles, defaults) {
                var tileLayerObj;
                var tileLayerUrl = defaults.tileLayer;
                var tileLayerOptions = defaults.tileLayerOptions;

                if (angular.isDefined(tiles.url)) {
                    tileLayerUrl = tiles.url;
                }

                if (angular.isDefined(tiles.options)) {
                    angular.copy(tiles.options, tileLayerOptions);
                }

                $scope.$watch("tiles.url", function(url) {
                    if (!angular.isDefined(url)) {
                        return;
                    }
                    tileLayerObj.setUrl(url);
                });

                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
            }
        }
    };
});

angular.module("leaflet-directive").directive('legend', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var legend = $scope.legend;

            setupLegend(map, legend);

            function setupLegend(map, legend) {
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
            }
        }
    };
});

angular.module("leaflet-directive").directive('geojson', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var leafletGeoJSON;
            setupGeoJSON(map);

            function setupGeoJSON(map, geojson, defaults) {
                $scope.$watch("geojson", function(geojson) {
                    if (!isDefined(geojson)) {
                        return;
                    }

                    if (isDefined(leafletGeoJSON)) {
                        map.removeLayer($scope.leaflet.geojson);
                    }

                    if (isDefined(geojson.data)) {
                        var resetStyleOnMouseout = geojson.resetStyleOnMouseout;

                        leafletGeoJSON = L.geoJson(geojson.data, {
                            style: geojson.style,
                            onEachFeature: function(feature, layer) {
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
                            }
                        }).addTo(map);
                    }
                });
            }
        }
    };
});

angular.module("leaflet-directive").directive('layers', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var layers = $scope.layers;
            setupLayers(map, layers, defaults);

            function setupLayers(map, layers, defaults) {
                if (isDefined(layers)) {
                    // Do we have a baselayers property?
                    if (!isDefined(layers.baselayers) || Object.keys($scope.layers.baselayers).length <= 0) {
                        // No baselayers property
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        return;
                    }
                    // We have baselayers to add to the map
                    var leafletLayers = {};
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
                for (var attrname in layerDefinition.layerParams) { layerDefinition.layerOptions[attrname] = layerDefinition.layerParams[attrname]; }
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
        }
    };
});

angular.module("leaflet-directive").directive('bounds', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
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

            function updateBoundsInScope() {
                if (!$scope.bounds) {
                    return;
                }

                var bounds = map.getBounds();
                var sw_latlng = bounds.getSouthWest();
                var ne_latlng = bounds.getNorthEast();
                $scope.bounds = {
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
        }
    };
});

angular.module("leaflet-directive").directive('events', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var legend = $scope.legend;

            setupMapEventCallbacks();
            setupMapEventBroadcasting();

            /*
            * Set up broadcasting of map events to the rootScope
            *
            * Listeners listen at leafletDirectiveMap.<event name>
            *
            * All events listed at http://leafletjs.com/reference.html#map-events are supported
            */
            function setupMapEventBroadcasting() {

                function genDispatchMapEvent(eventName, logic) {
                    return function(e) {
                        // Put together broadcast name
                        // for use in safeApply
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

              if ($scope.eventBroadcast === undefined || $scope.eventBroadcast === null) {
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
            }

            /*
             * Event setup watches for callbacks set in the parent scope
             *
             *    $scope.events = {
             *      dblclick: function(){
             *         // doThis()
             *      },
             *      click: function(){
             *         // doThat()
             *      }
             * }
             */

            function setupMapEventCallbacks() {
                if (typeof($scope.events) !== 'object') {
                    return false;
                } else {
                    for (var bind_to  in $scope.events) {
                        map.on(bind_to, $scope.events[bind_to]);
                    }
                }
            }
        }
    };
});

angular.module("leaflet-directive").directive('maxbounds', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var maxBounds = $scope.maxBounds;
                            $log.warn("hola", maxBounds);

            setupMaxBounds(map, maxBounds);

            function setupMaxBounds(map, maxBounds) {
                if (isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast)) {
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
                }
            }
        }
    };
});

}());