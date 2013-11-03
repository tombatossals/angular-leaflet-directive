app.controller("CustomizedMarkersController", [ '$scope', function($scope) {

    var local_icons = {
        leaf_icon: L.icon({
            iconUrl: 'examples/img/leaf-green.png',
            shadowUrl: 'examples/img/leaf-shadow.png',
             iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        }),
        default_icon: L.icon({
            iconUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
            shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 40],
            popupAnchor: [0, -40],
            shadowSize: [41, 41],
            shadowAnchor: [12, 40]
        }),
        div_icon: L.divIcon({
            iconSize: [230, 0],
            html: 'Using <strong>Bold text as an icon</strong>: Lisbon',
            popupAnchor:  [0, 0]
        }),
        object_icon: {
            iconUrl: 'http://leafletjs.com/docs/images/leaf-orange.png',
            shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62]
        }
    };

    angular.extend($scope, {
        icons: local_icons
    });

    angular.extend($scope, {
        lisbon: {
            lat: 38.716,
            lng: -9.13,
            zoom: 8
        },
        markers: {
            m1: {
                lat: 38.716,
                lng: -9.13,
                message: "I'm a static marker",
                icon: local_icons.default_icon,
            },
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);
