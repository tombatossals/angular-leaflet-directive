var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive('leaflet', [
    '$http', '$log', '$parse', '$rootScope', function ($http, $log, $parse, $rootScope) {

    var defaults = {
        maxZoom: 14,
        minZoom: 1,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        icon: {
            url: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png',
            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon@2x.png',
            size: [25, 41],
            anchor: [12, 40],
            popup: [0, -40],
            shadow: {
                url: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
                retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        },
        path: {
            weight: 10,
            opacity: 1,
            color: '#0000ff'
        }
    };

    // Default leaflet icon object used in all markers as a default
    var DefaultLeafletIcon = L.Icon.extend({
        options: {
            iconUrl: defaults.icon.url,
            iconRetinaUrl: defaults.icon.retinaUrl,
            iconSize: defaults.icon.size,
            iconAnchor: defaults.icon.anchor,
            popupAnchor: defaults.icon.popup,
            shadowUrl: defaults.icon.shadow.url,
            shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
            shadowSize: defaults.icon.shadow.size,
            shadowAnchor: defaults.icon.shadow.anchor
        }
    });


    var str_inspect_hint = 'Add testing="testing" to <leaflet> tag to inspect this object';

    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            maxBounds: '=maxbounds',
            bounds: '=bounds',
            marker: '=marker',
            markers: '=markers',
            legend: '=legend',
            geojson: '=geojson',
            defaults: '=defaults',
            paths: '=paths',
            tiles: '=tiles',
            events: '=events',
            layers: '=layers',
            customControls: '=customControls'
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function ($scope, element, attrs /*, ctrl */) {
            if (attrs.width) {
                element.css('width', attrs.width);
            }
            if (attrs.height) {
                element.css('height', attrs.height);
            }

            $scope.leaflet = {};

            $scope.leaflet.maxZoom = !!(attrs.defaults && $scope.defaults && $scope.defaults.maxZoom) ?
                parseInt($scope.defaults.maxZoom, 10) : defaults.maxZoom;
            $scope.leaflet.minZoom = !!(attrs.defaults && $scope.defaults && $scope.defaults.minZoom) ?
                parseInt($scope.defaults.minZoom, 10) : defaults.minZoom;
            $scope.leaflet.doubleClickZoom = !!(attrs.defaults && $scope.defaults && (typeof($scope.defaults.doubleClickZoom) === "boolean") ) ? $scope.defaults.doubleClickZoom  : defaults.doubleClickZoom;
            $scope.leaflet.scrollWheelZoom = !!(attrs.defaults && $scope.defaults && (typeof($scope.defaults.scrollWheelZoom) === "boolean") ) ? $scope.defaults.scrollWheelZoom  : defaults.scrollWheelZoom;

            var map = new L.Map(element[0], {
                maxZoom: $scope.leaflet.maxZoom,
                minZoom: $scope.leaflet.minZoom,
                doubleClickZoom: $scope.leaflet.doubleClickZoom,
                scrollWheelZoom: $scope.leaflet.scrollWheelZoom
            });
            var layers = null;

            map.setView([0, 0], 10);
            $scope.leaflet.map = !!attrs.testing ? map : str_inspect_hint;

            setupControls();
            setupCustomControls();
            setupLayers();
            setupCenter();
            setupMaxBounds();
            setupBounds();
            setupMainMarker();
            setupMarkers();
            setupPaths();
            setupLegend();
            setupMapEventBroadcasting();
            setupMapEventCallbacks();
            setupGeojson();

            // use of leafletDirectiveSetMap event is not encouraged. only use
            // it when there is no easy way to bind data to the directive
            $scope.$on('leafletDirectiveSetMap', function(event, message) {
                var meth = message.shift();
                map[meth].apply(map, message);
            });

            function _isSafeToApply() {
                var phase = $scope.$root.$$phase;
                return !(phase === '$apply' || phase === '$digest');
            }

            function safeApply(fn) {
                if (!_isSafeToApply()) {
                    $scope.$eval(fn);
                } else {
                    $scope.$apply(fn);
                }
            }

            /*
            * Set up broadcasting of map events to the rootScope
            *
            * Listeners listen at leafletDirectiveMap.<event name>
            *
            * All events listed at http://leafletjs.com/reference.html#map-events are supported
            */
            function setupMapEventBroadcasting() {

              function genDispatchMapEvent(eventName) {
                return function(e) {
                  // Put together broadcast name for use in safeApply
                  var broadcastName = 'leafletDirectiveMap.' + eventName;

                  // Safely broadcast the event
                  safeApply(function(scope) {
                    $rootScope.$broadcast(broadcastName, {
                      leafletEvent: e
                    });
                  });
                };
              }

              var mapEvents = [
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

              for (var i = 0; i < mapEvents.length; i++) {
                var eventName = mapEvents[i];

                map.on(eventName, genDispatchMapEvent(eventName), {
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

            function setupLayers() {
                //TODO: support multiple types of layers (or plugins) Canvas, ImageOverlay, clustermarker, google, etc
                //TODO: add support for controls
                if ($scope.layers === undefined || $scope.layers === null) {
                    // There is no layers definition so we will use the old way of definig tiles for compatibility
                    setupTiles();
                } else {
                    // Do we have a baselayers property?
                    if ($scope.layers.baselayers === undefined || $scope.layers.baselayers === null || typeof $scope.layers.baselayers !== 'object') {
                        // No baselayers property
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        $scope.leaflet.layers = !!attrs.testing ? layers : str_inspect_hint;
                        return;
                    } else if (Object.keys($scope.layers.baselayers).length <= 0) {
                        // We have a baselayers property but no element on it
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        $scope.leaflet.layers = !!attrs.testing ? layers : str_inspect_hint;
                        return;
                    }
                    // We have baselayers to add to the map
                    layers = {};
                    layers.baselayers = {};
                    layers.controls = {};
                    layers.controls.layers = new L.control.layers().addTo(map);
                    // Setup all baselayers definitions
                    var top = false;
                    for (var layerName in $scope.layers.baselayers) {
                        var newBaseLayer = createLayer($scope.layers.baselayers[layerName]);
                        if (newBaseLayer !== null) {
                            layers.baselayers[layerName] = newBaseLayer;
                            // Only add the visible layer to the map, layer control manages the addition to the map
                            // of layers in its control
                            if ($scope.layers.baselayers[layerName].top === true) {
                                map.addLayer(layers.baselayers[layerName]);
                                top = true;
                            }
                            layers.controls.layers.addBaseLayer(layers.baselayers[layerName], $scope.layers.baselayers[layerName].name);
                        }
                    }
                    // If there is no visible layer add first to the map
                    if (!top && Object.keys(layers.baselayers).length > 0) {
                        map.addLayer(layers.baselayers[Object.keys($scope.layers.baselayers)[0]]);
                    }
                    // Setup the Overlays
                    layers.overlays = {};
                    for (layerName in $scope.layers.overlays) {
                        var newOverlayLayer = createLayer($scope.layers.overlays[layerName]);
                        if (newOverlayLayer !== null) {
                            layers.overlays[layerName] = newOverlayLayer;
                            // Only add the visible layer to the map, layer control manages the addition to the map
                            // of layers in its control
                            if ($scope.layers.overlays[layerName].visible === true) {
                                map.addLayer(layers.overlays[layerName]);
                            }
                            layers.controls.layers.addOverlay(layers.overlays[layerName], $scope.layers.overlays[layerName].name);
                        }
                    }

                    // Watch for the base layers
                    $scope.$watch('layers.baselayers', function(newBaseLayers) {
                        // Delete layers from the array
                        var deleted = false;
                        for (var name in layers.baselayers) {
                            if (newBaseLayers[name] === undefined) {
                                // Remove the layer from the control
                                layers.controls.layers.removeLayer(layers.baselayers[name]);
                                // Remove from the map if it's on it
                                if (map.hasLayer(layers.baselayers[name])) {
                                    map.removeLayer(layers.baselayers[name]);
                                }
                                delete layers.baselayers[name];
                                deleted = true;
                            }
                        }
                        // add new layers
                        for (var new_name in newBaseLayers) {
                            if (layers.baselayers[new_name] === undefined) {
                                var testBaseLayer = createLayer(newBaseLayers[new_name]);
                                if (testBaseLayer !== null) {
                                    layers.baselayers[new_name] = testBaseLayer;
                                    // Only add the visible layer to the map, layer control manages the addition to the map
                                    // of layers in its control
                                    if (newBaseLayers[new_name].top === true) {
                                        map.addLayer(layers.baselayers[new_name]);
                                    }
                                    layers.controls.layers.addBaseLayer(layers.baselayers[new_name], newBaseLayers[new_name].name);
                                }
                            }
                        }
                        if (Object.keys(layers.baselayers).length <= 0) {
                            // No baselayers property
                            $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        } else {
                            //we have layers, so we need to make, at least, one active
                            var found = false;
                            // serach for an active layer
                            for (var key in layers.baselayers) {
                                if (map.hasLayer(layers.baselayers[key])) {
                                    found = true;
                                    break;
                                }
                            }
                            // If there is no active layer make one active
                            if (!found) {
                                map.addLayer(layers.baselayers[Object.keys($scope.layers.baselayers)[0]]);
                            }
                        }
                    }, true);

                    // Watch for the overlay layers
                    $scope.$watch('layers.overlays', function(newOverlayLayers) {
                        // Delete layers from the array
                        for (var name in layers.overlays) {
                            if (newOverlayLayers[name] === undefined) {
                                // Remove the layer from the control
                                layers.controls.layers.removeLayer(layers.overlays[name]);
                                // Remove from the map if it's on it
                                if (map.hasLayer(layers.overlays[name])) {
                                    map.removeLayer(layers.overlays[name]);
                                }
                                // TODO: Depending on the layer type we will have to delete what's included on it
                                delete layers.overlays[name];
                            }
                        }
                        // add new layers
                        for (var new_name in newOverlayLayers) {
                            if (layers.overlays[new_name] === undefined) {
                                var testOverlayLayer = createLayer(newOverlayLayers[new_name]);
                                if (testOverlayLayer !== null) {
                                    layers.overlays[new_name] = testOverlayLayer;
                                    layers.controls.layers.addOverlay(layers.overlays[new_name], newOverlayLayers[new_name].name);
                                    if (newOverlayLayers[new_name].visible === true) {
                                        map.addLayer(layers.overlays[new_name]);
                                    }
                                }
                            }
                        }
                    }, true);
                }

                $scope.leaflet.layers = !!attrs.testing ? layers : str_inspect_hint;
            }

            function createLayer(layerDefinition) {
                // Check if the baselayer has a valid type
                if (layerDefinition.type === undefined || layerDefinition.type === null || typeof layerDefinition.type !== 'string') {
                    $log.error('[AngularJS - Leaflet] A base layer must have a type');
                    return null;
                } else if (layerDefinition.type !== 'xyz' && layerDefinition.type !== 'wms') {
                    $log.error('[AngularJS - Leaflet] A base layer must have a valid type: "tiles-xyz, "');
                    return null;
                }
                if (layerDefinition.type === 'xyz' || layerDefinition.type === 'wms') {
                    // XYZ, WMS must have an url
                    if (layerDefinition.url === undefined || layerDefinition.url === null || typeof layerDefinition.url !== 'string') {
                        $log.error('[AngularJS - Leaflet] A base layer must have an url');
                        return null;
                    }
                }
                if (layerDefinition.name === undefined || layerDefinition.name === null || typeof layerDefinition.name !== 'string') {
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
                default:
                    layer = null;
                }
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

            function createGroupLayer(url, options) {
                var layer = L.layerGroup();
                return layer;
            }

            function createOverlayLayer() {

            }

            function setupTiles() {
                var tileLayerObj, key;
                $scope.leaflet.tileLayer = !!(attrs.defaults && $scope.defaults && $scope.defaults.tileLayer) ?
                                            $scope.defaults.tileLayer : defaults.tileLayer;

                if ($scope.defaults && $scope.defaults.tileLayerOptions) {
                    for (key in $scope.defaults.tileLayerOptions) {
                        defaults.tileLayerOptions[key] = $scope.defaults.tileLayerOptions[key];
                    }
                }

                if (attrs.tiles) {
                    if ($scope.tiles && $scope.tiles.url) {
                        $scope.leaflet.tileLayer = $scope.tiles.url;
                    }
                    if ($scope.tiles && $scope.tiles.options) {
                        for (key in $scope.tiles.options) {
                            defaults.tileLayerOptions[key] = $scope.tiles.options[key];
                        }
                    }

                    $scope.$watch("tiles.url", function (url) {
                        if (!url) {
                            return;
                        }
                        tileLayerObj.setUrl(url);
                    });
                }
                tileLayerObj = L.tileLayer($scope.leaflet.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);

                $scope.leaflet.tileLayerObj = !!attrs.testing ? tileLayerObj : str_inspect_hint;
            }

            function setupLegend() {
                if ($scope.legend) {
                    if (!$scope.legend.colors || !$scope.legend.labels || $scope.legend.colors.length !== $scope.legend.labels.length) {
                         $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                    } else {
                        var position = $scope.legend.position || 'bottomright';
                        var legend = L.control({position: position });
                        legend.onAdd = function (map) {
                            var div = L.DomUtil.create('div', 'info legend');
                            for (var i = 0; i < $scope.legend.colors.length; i++) {
                                div.innerHTML +=
                                    '<i style="background:' + $scope.legend.colors[i] + '"></i> ' + $scope.legend.labels[i] + '<br />';
                            }
                            return div;
                        };
                        legend.addTo(map);
                    }
                }
            }

            function setupMaxBounds() {
                if (!$scope.maxBounds) {
                    return;
                }
                if ($scope.maxBounds.southWest && $scope.maxBounds.southWest.lat && $scope.maxBounds.southWest.lng && $scope.maxBounds.northEast && $scope.maxBounds.northEast.lat && $scope.maxBounds.northEast.lng) {
                    map.setMaxBounds(
                        new L.LatLngBounds(
                            new L.LatLng($scope.maxBounds.southWest.lat, $scope.maxBounds.southWest.lng),
                            new L.LatLng($scope.maxBounds.northEast.lat, $scope.maxBounds.northEast.lng)
                        )
                    );

                    $scope.$watch("maxBounds", function (maxBounds) {
                        if (maxBounds.southWest && maxBounds.northEast && maxBounds.southWest.lat && maxBounds.southWest.lng && maxBounds.northEast.lat && maxBounds.northEast.lng) {
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

            function tryFitBounds(bounds) {
                if (!bounds) {
                    return;
                }

                var southWest = bounds.southWest;
                var northEast = bounds.northEast;
                if (southWest && northEast && southWest.lat && southWest.lng && northEast.lat && northEast.lng) {
                    var sw_latlng = new L.LatLng(southWest.lat, southWest.lng);
                    var ne_latlng = new L.LatLng(northEast.lat, northEast.lng);
                    map.fitBounds(new L.LatLngBounds(sw_latlng, ne_latlng));
                }
            }

            function setupBounds() {
                if (!$scope.bounds) {
                    return;
                }
                $scope.$watch('bounds', function(new_bounds) {
                    tryFitBounds(new_bounds);
                });
            }

            function setupCenter() {
                if (!attrs.center) {
                    $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                    map.setView( [ 0, 0 ], 1);
                    return;
                }

                var centerModel = {
                    lat:  $parse("center.lat"),
                    lng:  $parse("center.lng"),
                    zoom: $parse("center.zoom")
                };

                $scope.$watch("center", function(center /*, oldValue */) {
                    if (center) {
                        if (center.lat !== undefined && center.lng !== undefined && center.zoom !== undefined) {
                            map.setView( [center.lat, center.lng], center.zoom );
                        } else if (center.autoDiscover === true) {
                            map.locate({ setView: true, maxZoom: $scope.leaflet.maxZoom });
                        }
                    }
                }, true);

                map.on("moveend", function(/* event */) {
                    safeApply(function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                        }
                    });
                });
            }

            function setupGeojson() {
                $scope.$watch("geojson", function(geojson) {
                    if (!geojson) {
                        return;
                    }

                    if ($scope.leaflet.geojson) {
                        map.removeLayer($scope.leaflet.geojson);
                    }

                    if (geojson.hasOwnProperty("data")) {
                        var resetStyleOnMouseout = $scope.geojson.resetStyleOnMouseout;

                        $scope.leaflet.geojson = L.geoJson($scope.geojson.data, {
                            style: $scope.geojson.style,
                            onEachFeature: function(feature, layer) {
                                layer.on({
                                    mouseover: function(e) {
                                        safeApply(function() {
                                            geojson.selected = feature;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                                        });
                                    },
                                    mouseout: function(e) {
                                        if (resetStyleOnMouseout) {
                                            $scope.leaflet.geojson.resetStyle(e.target);
                                        }
                                        safeApply(function() {
                                            geojson.selected = undefined;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                        });
                                    },
                                    click: function(e) {
                                        safeApply(function() {
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', geojson.selected, e);
                                        });
                                    }
                                });
                            }
                        }).addTo(map);
                    }
                });
            }

            function setupMainMarker() {
                var main_marker;
                if (!$scope.marker) {
                    return;
                }
                main_marker = createMarker('marker', $scope.marker, map);
                $scope.leaflet.marker = !!attrs.testing ? main_marker : str_inspect_hint;
                main_marker.on('click', function(e) {
                    safeApply(function() {
                        $rootScope.$broadcast('leafletDirectiveMainMarkerClick');
                    });
                });
            }

            function setupMarkers() {
                var markers = {};
                $scope.leaflet.markers = !!attrs.testing ? markers : str_inspect_hint;
                if (!$scope.markers) {
                    return;
                }

                for (var name in $scope.markers) {
                    markers[name] = createMarker(
                            'markers.'+name, $scope.markers[name], map);
                }

                $scope.$watch('markers', function(newMarkers) {
                    // Delete markers from the array
                    for (var name in markers) {
                        if (newMarkers[name] === undefined) {
                            delete markers[name];
                        }
                    }
                    // add new markers
                    for (var new_name in newMarkers) {
                        if (markers[new_name] === undefined) {
                            markers[new_name] = createMarker(
                                'markers.'+new_name, newMarkers[new_name], map);
                        }
                    }
                }, true);
            }

            function createMarker(scope_watch_name, marker_data, map) {
                var marker = buildMarker(marker_data);
                map.addLayer(marker);

                if (marker_data.focus === true) {
                    marker.openPopup();
                }

                function genDispatchEventCB(eventName) {
                    return function(e) {
                        var broadcastName = 'leafletDirectiveMarker.' + eventName;
                        var markerName = scope_watch_name.replace('markers.', '');

                        // Broadcast old marker click name for backwards compatibility
                        if (eventName === "click") {
                            safeApply(function() {
                                $rootScope.$broadcast('leafletDirectiveMarkersClick', markerName);
                            });
                        } else if (eventName === 'dragend') {
                            safeApply(function() {
                                marker_data.lat = marker.getLatLng().lat;
                                marker_data.lng = marker.getLatLng().lng;
                            });
                            if (marker_data.message) {
                                if (marker_data.focus === true) {
                                    marker.openPopup();
                                }
                            }
                        }

                        safeApply(function(){
                            $rootScope.$broadcast(broadcastName, {
                                markerName: markerName,
                                leafletEvent: e
                            });
                        });
                    };
                }

                // Set up marker event broadcasting
                var markerEvents = [
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

                for (var i = 0; i < markerEvents.length; i++) {
                    var eventName = markerEvents[i];
                    marker.on(eventName, genDispatchEventCB(eventName), {
                        eventName: eventName,
                        scope_watch_name: scope_watch_name
                    });
                }

                var clearWatch = $scope.$watch(scope_watch_name, function(data, old_data) {
                    if (!data) {
                        map.removeLayer(marker);
                        clearWatch();
                        return;
                    }

                    if (old_data) {

                        // Update the draggable property
                        if (data.draggable === undefined || data.draggable === null || data.draggable !== true) {
                            // If there isn't or wasn't the draggable property or is false and previously true update the dragging
                            // the !== true prevents for not boolean values in the draggable property
                            if (old_data.draggable !== undefined && old_data.draggable !== null && old_data.draggable === true) {
                                marker.dragging.disable();
                            }
                        } else if (old_data.draggable === undefined || old_data.draggable === null || old_data.draggable !== true) {
                            // The data.draggable property must be true so we update if there wasn't a previous value or it wasn't true
                            marker.dragging.enable();
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
                        }

                        // Update the lat-lng property (always present in marker properties)
                        if (data.lat === undefined || data.lat === null || isNaN(data.lat) || typeof data.lat !== 'number' || data.lng === undefined || data.lng === null || isNaN(data.lng) || typeof data.lng !== 'number') {
                            $log.warn('There are problems with lat-lng data, please verify your marker model');
                        } else {
                            var cur_latlng = marker.getLatLng();
                            // On dragend event, scope will be updated, which
                            // tirggers this watch expression. Then we call
                            // setLatLng and triggers move event on marker and
                            // causes digest already in progress error.
                            //
                            // This check is to make sure we don't trigger move
                            // event manually after dragend, which is redundant
                            // anyway. Because before dragend event fired, marker
                            // sate is already updated by leaflet.
                            if (cur_latlng.lat !== data.lat || cur_latlng.lng !== data.lng) {
                                marker.setLatLng([data.lat, data.lng]);
                            }
                        }

                        // Update the icon property
                        if (data.icon === undefined || data.icon === null || typeof data.icon !== 'object') {
                            // If there is no icon property or it's not an object
                            if (old_data.icon !== undefined && old_data.icon !== null && typeof old_data.icon === 'object') {
                                // If there was an icon before restore to the default
                                marker.setIcon(new DefaultLeafletIcon());
                            }
                        } else if (old_data.icon === undefined || old_data.icon === null || typeof old_data.icon !== 'object') {
                            // The data.icon exists so we create a new icon if there wasn't an icon before
                            marker.setIcon(new DefaultLeafletIcon(data.icon));
                        } else {
                            // There is an icon and there was an icon so if they are different we create a new icon
                            if (JSON.stringify(data.icon) !== JSON.stringify(old_data.icon)) {
                                marker.setIcon(new DefaultLeafletIcon(data.icon));
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
                    micon = new DefaultLeafletIcon();
                }
                var marker = new L.marker(data,
                    {
                        icon: micon,
                        draggable: data.draggable ? true : false
                    }
                );
                if (data.message) {
                    marker.bindPopup(data.message);
                }
                return marker;
            }

            function setupPaths() {
                var paths = {};
                $scope.leaflet.paths = !!attrs.testing ? paths : str_inspect_hint;

                if (!$scope.paths) {
                    return;
                }

                $log.warn("[AngularJS - Leaflet] Creating polylines and adding them to the map will break the directive's scope's inspection in AngularJS Batarang");

                for (var name in $scope.paths) {
                    paths[name] = createPath(name, $scope.paths[name], map);
                }

                $scope.$watch("paths", function (newPaths) {
                    for (var new_name in newPaths) {
                        if (paths[new_name] === undefined) {
                            paths[new_name] = createPath(new_name, newPaths[new_name], map);
                        }
                    }
                    // Delete paths from the array
                    for (var name in paths) {
                        if (newPaths[name] === undefined) {
                            delete paths[name];
                        }
                    }

                }, true);
            }

            function createPath(name, scopePath, map) {
                var polyline = new L.Polyline([], {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                });

                if (scopePath.latlngs !== undefined) {
                    var latlngs = convertToLeafletLatLngs(scopePath.latlngs);
                    polyline.setLatLngs(latlngs);
                }

                if (scopePath.weight !== undefined) {
                    polyline.setStyle({ weight: scopePath.weight });
                }

                if (scopePath.color !== undefined) {
                    polyline.setStyle({ color: scopePath.color });
                }

                if (scopePath.opacity !== undefined) {
                    polyline.setStyle({ opacity: scopePath.opacity });
                }

                map.addLayer(polyline);

                var clearWatch = $scope.$watch('paths.' + name, function(data, oldData) {
                    if (!data) {
                        map.removeLayer(polyline);
                        clearWatch();
                        return;
                    }

                    if (oldData) {
                        if (data.latlngs !== undefined && data.latlngs !== oldData.latlngs) {
                            var latlngs = convertToLeafletLatLngs(data.latlngs);
                            polyline.setLatLngs(latlngs);
                        }

                        if (data.weight !== undefined && data.weight !== oldData.weight) {
                            polyline.setStyle({ weight: data.weight });
                        }

                        if (data.color !== undefined && data.color !== oldData.color) {
                            polyline.setStyle({ color: data.color });
                        }

                        if (data.opacity !== undefined && data.opacity !== oldData.opacity) {
                            polyline.setStyle({ opacity: data.opacity });
                        }
                    }
                }, true);
                return polyline;
            }

            function convertToLeafletLatLngs(latlngs) {
                var leafletLatLngs = latlngs.filter(function(latlng) {
                    return !!latlng.lat && !!latlng.lng;
                }).map(function (latlng) {
                    return new L.LatLng(latlng.lat, latlng.lng);
                });

                return leafletLatLngs;
            }

            function setupControls() {
                //@TODO add document for this option  11.08 2013 (houqp)
                if ($scope.defaults && $scope.defaults.zoomControlPosition) {
                    map.zoomControl.setPosition($scope.defaults.zoomControlPosition);
                }
            }

            function setupCustomControls() {
                if (!$scope.customControls) {
                    return;
                }

                for(var i = 0, count = $scope.customControls.length; i < count; i++) {
                    map.addControl(new $scope.customControls[i]());
                }
            }
        }
    };
}]);
