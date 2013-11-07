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
