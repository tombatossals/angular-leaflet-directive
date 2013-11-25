angular.module("leaflet-directive").factory('leafletLayerHelpers', function ($rootScope, $q, $log, leafletHelpers) {
    var Helpers = leafletHelpers,
        isString = leafletHelpers.isString;


    function createXyzLayer(url, options) {
        return L.tileLayer(url, options);
    }

    function createWmsLayer(url, options) {
        return L.tileLayer.wms(url, options);
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

    function createImageOverlay(url, bounds, options) {
        return L.imageOverlay(url, bounds, options);
    }

    return {
        createLayer: function(layerDefinition) {
            // Check if the baselayer has a valid type
            if (!isString(layerDefinition.type)) {
                $log.error('[AngularJS - Leaflet] A base layer must have a type');
                return null;
            } else if (layerDefinition.type !== 'xyz' && layerDefinition.type !== 'wms' && layerDefinition.type !== 'group' && layerDefinition.type !== 'markercluster' && layerDefinition.type !== 'google' && layerDefinition.type !== 'bing' && layerDefinition.type !== 'imageOverlay') {
                $log.error('[AngularJS - Leaflet] A layer must have a valid type: "xyz, wms, group, google"');
                return null;
            }
            if (layerDefinition.type === 'xyz' || layerDefinition.type === 'wms' || layerDefinition.type === 'imageOverlay') {
                // XYZ, WMS must have an url
                if (!isString(layerDefinition.url)) {
                    $log.error('[AngularJS - Leaflet] A base layer must have an url');
                    return null;
                }
            }
            if (layerDefinition.type === 'imageOverlay' && layerDefinition.bounds === undefined) {
                if (!isString(layerDefinition)) {
                    $log.error('[AngularJS - Leaflet] An imageOverlay layer must have bounds');
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
                case 'imageOverlay':
                    layer = createImageOverlay(layerDefinition.url, layerDefinition.bounds, layerDefinition.layerOptions);
                    break;
                default:
                    layer = null;
            }

            //TODO Add $watch to the layer properties
            return layer;
        }
    };
});
