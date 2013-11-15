angular.module("leaflet-directive").factory('leafletMapDefaults', function ($q, leafletHelpers) {
    var isDefined = leafletHelpers.isDefined,
        _defaults = {
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
        },
        getDefer = leafletHelpers.getDefer,
        defaultsPromise = {
            main: $q.defer()
        };

    // Get the _defaults dictionary, and override the properties defined by the user
    return {
        getDefaults: function () {
            return defaultsPromise;
        },

        setDefaults: function(defaults, scopeId) {
            var leafletDefaults = getDefer(defaultsPromise, scopeId);

            if (isDefined(defaults)) {
                _defaults.maxZoom = isDefined(defaults.maxZoom) ?  parseInt(defaults.maxZoom, 10) : _defaults.maxZoom;
                _defaults.minZoom = isDefined(defaults.minZoom) ?  parseInt(defaults.minZoom, 10) : _defaults.minZoom;
                _defaults.doubleClickZoom = isDefined(defaults.doubleClickZoom) ?  defaults.doubleClickZoom : _defaults.doubleClickZoom;
                _defaults.scrollWheelZoom = isDefined(defaults.scrollWheelZoom) ?  defaults.scrollWheelZoom : _defaults.doubleClickZoom;
                _defaults.zoomControl = isDefined(defaults.zoomControl) ?  defaults.zoomControl : _defaults.zoomControl;
                _defaults.attributionControl = isDefined(defaults.attributionControl) ?  defaults.attributionControl : _defaults.attributionControl;
                _defaults.tileLayer = isDefined(defaults.tileLayer) ? defaults.tileLayer : _defaults.tileLayer;
                _defaults.zoomControlPosition = isDefined(defaults.zoomControlPosition) ? defaults.zoomControlPosition : _defaults.zoomControlPosition;
                _defaults.keyboard = isDefined(defaults.keyboard) ? defaults.keyboard : _defaults.keyboard;
                _defaults.dragging = isDefined(defaults.dragging) ? defaults.dragging : _defaults.dragging;
                _defaults.controlLayersPosition = isDefined(defaults.controlLayersPosition) ? defaults.controlLayersPosition : _defaults.controlLayersPosition;

                if (isDefined(defaults.tileLayerOptions)) {
                    angular.copy(defaults.tileLayerOptions, _defaults.tileLayerOptions);
                }

                leafletDefaults.resolve(_defaults);
            }
        }
    };
});

