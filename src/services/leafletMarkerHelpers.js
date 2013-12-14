angular.module("leaflet-directive").factory('leafletMarkerHelpers', function () {

    var LeafletDefaultIcon = L.Icon.extend({
        options: {
            iconUrl: 'http://cdn.leafletjs.com/leaflet-0.7/images/marker-icon.png',
            iconRetinaUrl: 'http://cdn.leafletjs.com/leaflet-0.7/images/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 40],
            labelAnchor: [10, -20],
            popupAnchor: [0, -40],
            shadow: {
                url: 'http://cdn.leafletjs.com/leaflet-0.7/images/marker-shadow.png',
                retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.7/images/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        }
    });

    return {
        getLeafletIcon: function(data) {
            return new LeafletDefaultIcon(data);
        }
    };

});
