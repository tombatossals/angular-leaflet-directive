        app.controller('MarkersIconsController', [ '$scope', function($scope) {
            angular.extend($scope, {
                chicago: {
                    lat: 41.85,
                    lng: -87.65,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 41.85,
                        lng: -87.65,
                        message: "I'm a static marker with defaultIcon",
                        focus: false,
                        icon: {},
                    },
                },
                defaultIcon: {},
                leafIcon: {
                    iconUrl: 'img/leaf-green.png',
                    shadowUrl: 'img/leaf-shadow.png',
                    iconSize:     [38, 95], // size of the icon
                    shadowSize:   [50, 64], // size of the shadow
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                },
                orangeLeafIcon: {
                    iconUrl: 'img/leaf-orange.png',
                    shadowUrl: 'img/leaf-shadow.png',
                    iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                },
                divIcon: {
                    type: 'div',
                    iconSize: [200, 0],
                    popupAnchor:  [0, 0],
                    html: 'Using <strong>Bold text as an icon</strong>:'
                },
                awesomeMarkerIcon: {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                vectorMarkerIcon: {
                    type: 'vectorMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                makiMarkerIcon: {
                    type: 'makiMarker',
                    icon: 'beer',
                    color: '#f00',
                    size: "l"
                },
                extraMarkerIcon: {
                    type: 'extraMarker',
                    icon: 'fa-star',
                    markerColor: '#f00',
                    prefix: 'fa',
                    shape: 'circle'
                }
            });
        } ]);