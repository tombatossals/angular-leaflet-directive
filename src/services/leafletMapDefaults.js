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
        defaults = {
            main: $q.defer()
        };

    // Get the _defaults dictionary, and override the properties defined by the user
    return {
        getDefaults: function (scopeId) {
            var d = getDefer(defaults, scopeId);
            return d.promise;
        },

        setDefaults: function(userDefaults, scopeId) {
            var leafletDefaults = getDefer(defaults, scopeId);

            if (isDefined(userDefaults)) {
                _defaults.maxZoom = isDefined(userDefaults.maxZoom) ?  parseInt(userDefaults.maxZoom, 10) : _defaults.maxZoom;
                _defaults.minZoom = isDefined(userDefaults.minZoom) ?  parseInt(userDefaults.minZoom, 10) : _defaults.minZoom;
                _defaults.doubleClickZoom = isDefined(userDefaults.doubleClickZoom) ?  userDefaults.doubleClickZoom : _defaults.doubleClickZoom;
                _defaults.scrollWheelZoom = isDefined(userDefaults.scrollWheelZoom) ?  userDefaults.scrollWheelZoom : _defaults.doubleClickZoom;
                _defaults.zoomControl = isDefined(userDefaults.zoomControl) ?  userDefaults.zoomControl : _defaults.zoomControl;
                _defaults.attributionControl = isDefined(userDefaults.attributionControl) ?  userDefaults.attributionControl : _defaults.attributionControl;
                _defaults.tileLayer = isDefined(userDefaults.tileLayer) ? userDefaults.tileLayer : _defaults.tileLayer;
                _defaults.zoomControlPosition = isDefined(userDefaults.zoomControlPosition) ? userDefaults.zoomControlPosition : _defaults.zoomControlPosition;
                _defaults.keyboard = isDefined(userDefaults.keyboard) ? userDefaults.keyboard : _defaults.keyboard;
                _defaults.dragging = isDefined(userDefaults.dragging) ? userDefaults.dragging : _defaults.dragging;
                _defaults.controlLayersPosition = isDefined(userDefaults.controlLayersPosition) ? userDefaults.controlLayersPosition : _defaults.controlLayersPosition;

                if (isDefined(userDefaults.tileLayerOptions)) {
                    angular.copy(userDefaults.tileLayerOptions, _defaults.tileLayerOptions);
                }
            }
            leafletDefaults.resolve(_defaults);
        }
    };
});

