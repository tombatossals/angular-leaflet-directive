app.controller("CustomizedMarkersController", [ '$scope', function($scope) {

    var local_icons = {
        default_icon: {},
        leaf_icon: {
            iconUrl: 'examples/img/leaf-green.png',
            shadowUrl: 'examples/img/leaf-shadow.png',
             iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        },
        div_icon: {
            type: 'div',
            iconSize: [230, 0],
            html: 'Using <strong>Bold text as an icon</strong>: Lisbon',
            popupAnchor:  [0, 0]
        },
        orange_leaf_icon: {
            iconUrl: 'examples/img/leaf-orange.png',
            shadowUrl: 'examples/img/leaf-shadow.png',
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
