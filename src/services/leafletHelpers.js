angular.module("leaflet-directive").factory('leafletHelpers', function ($log, $q) {
    return {
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
});
