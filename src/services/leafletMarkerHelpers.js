angular.module("leaflet-directive").factory('leafletMarkerHelpers', function (leafletHelpers) {

    var isDefined = leafletHelpers.isDefined;

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

    var getLeafletIcon = function(data) {
        return new LeafletDefaultIcon(data);
    };

    return {
        getLeafletIcon: getLeafletIcon,

        buildMarker: function(data) {
            var micon = null;
            if (data.icon) {
                micon = data.icon;
            } else {
                micon = getLeafletIcon();
            }
            var moptions = {
                icon: micon,
                draggable: data.draggable ? true : false,
                clickable: isDefined(data.clickable) ? data.clickable : true,
                riseOnHover: isDefined(data.riseOnHover) ? data.riseOnHover : false
            };
            if (data.title) {
                moptions.title = data.title;
            }
            var marker = new L.marker(data, moptions);

            if (data.message) {
                marker.bindPopup(data.message);
            }
            if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(data.label) && isDefined(data.label.message)) {
                marker.bindLabel(data.label.message, data.label.options);
            }

            return marker;
        }
    };

});
