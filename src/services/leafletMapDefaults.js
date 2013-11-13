angular.module("leaflet-directive").factory('leafletMapDefaults', function (leafletHelpers) {
    var isDefined = leafletHelpers.isDefined;

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

    // Get the mapDefaults dictionary, and override the properties defined by the user
    return function (defaults) {
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
    };
});

