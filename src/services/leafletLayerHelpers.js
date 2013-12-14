angular.module("leaflet-directive").factory('leafletLayerHelpers', function ($rootScope, $q, $log, leafletHelpers) {
    var Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isObject = leafletHelpers.isObject,
        isDefined = leafletHelpers.isDefined;

    var types = {
        xyz: {
            mustHaveUrl: true
        },
        wms: {
            mustHaveUrl: true
        },
        wfs: {
            mustHaveUrl: true,
            mustHaveLayer : true
        },
        group: {
            mustHaveUrl: false
        },
        google: {
            mustHaveUrl: false
        },
        ags: {
            mustHaveUrl: true
        },
        dynamic: {
            mustHaveUrl: true
        },
        markercluster: {
            mustHaveUrl: false
        },
        bing: {
            mustHaveUrl: true
        },
        imageOverlay: {
            mustHaveUrl: true,
            mustHaveBounds : true
        }
    };

    function createXyzLayer(url, options) {
        return L.tileLayer(url, options);
    }

    function createWmsLayer(url, options) {
        return L.tileLayer.wms(url, options);
    }

    function createWfsLayer(url, layerName, options) {
        if (Helpers.WFSLayerPlugin.isLoaded()) {
            if(options.crs && 'string' === typeof options.crs) {
                /*jshint -W061 */
                options.crs = eval(options.crs);
            }
            var layer = new L.GeoJSON.WFS(url, layerName, options);
            return layer;
        } else {
            return null;
        }
    }

    function createGroupLayer() {
        return L.layerGroup();
    }

    function createMarkerClusterLayer(options) {
        if (Helpers.MarkerClusterPlugin.isLoaded()) {
            return new L.MarkerClusterGroup(options);
        } else {
            return null;
        }
    }

    function createGoogleLayer(type, options) {
        type = type || 'SATELLITE';
        if (Helpers.GoogleLayerPlugin.isLoaded()) {
            return new L.Google(type, options);
        } else {
            return null;
        }
    }

    function createBingLayer(key, options) {
        if (Helpers.BingLayerPlugin.isLoaded()) {
            return new L.BingLayer(key, options);
        } else {
            return null;
        }
    }

    function createAGSLayer(url, options) {
        if (Helpers.AGSLayerPlugin.isLoaded()) {
            angular.extend(options, {
                url: url
            });
            var layer = new lvector.AGS(options);
            layer.onAdd = function(map) {
                this.setMap(map);
            };
            layer.onRemove = function() {
                this.setMap(null);
            };
            return layer;
        } else {
            return null;
        }
    }

    function createDynamicMapLayer(url, options) {
        if (Helpers.DynamicMapLayerPlugin.isLoaded()) {
            var layer = L.esri.dynamicMapLayer(url, options);
            return layer;
        } else {
            return null;
        }
    }

    function createImageOverlay(url, bounds, options) {
        return L.imageOverlay(url, bounds, options);
    }

    function isValidLayerType(layerDefinition) {
        // Check if the baselayer has a valid type
        if (!isString(layerDefinition.type)) {
            return false;
        }

        if (Object.keys(types).indexOf(layerDefinition.type) === -1) {
            $log.error('[AngularJS - Leaflet] A layer must have a valid type: ' + Object.keys(types));
            return false;
        }

        // Check if the layer must have an URL
        if (types[layerDefinition.type].mustHaveUrl && !isString(layerDefinition.url)) {
            $log.error('[AngularJS - Leaflet] A base layer must have an url');
            return false;
        }

        if(types[layerDefinition.type].mustHaveLayer && !isDefined(layerDefinition.layer)) {
            $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have an layer defined');
            return false;
        }

        if (types[layerDefinition.type].mustHaveBounds && !isDefined(layerDefinition.bounds)) {
            $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have bounds defined');
            return false ;
        }
        return true;
    }

    return {
        createLayer: function(layerDefinition) {
            if (!isValidLayerType(layerDefinition)) {
                return;
            }

            if (!isString(layerDefinition.name)) {
                $log.error('[AngularJS - Leaflet] A base layer must have a name');
                return;
            }
            if (!isObject(layerDefinition.layerParams)) {
                layerDefinition.layerParams = {};
            }
            if (!isObject(layerDefinition.layerOptions)) {
                layerDefinition.layerOptions = {};
            }

            // Mix the layer specific parameters with the general Leaflet options. Although this is an overhead
            // the definition of a base layers is more 'clean' if the two types of parameters are differentiated
            var layer;
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
                case 'wfs':
                    layer = createWfsLayer(layerDefinition.url, layerDefinition.layer, layerDefinition.layerOptions);
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
                case 'ags':
                    layer = createAGSLayer(layerDefinition.url, layerDefinition.layerOptions);
                    break;
                case 'dynamic':
                    layer = createDynamicMapLayer(layerDefinition.url, layerDefinition.layerOptions);
                    break;
                case 'imageOverlay':
                    layer = createImageOverlay(layerDefinition.url, layerDefinition.bounds, layerDefinition.layerOptions);
                    break;
            }

            //TODO Add $watch to the layer properties
            return layer;
        }
    };
});
