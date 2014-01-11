app.controller("PathController", [ '$scope', function($scope) {

    angular.extend($scope, {
        center: {
            lat: 48,
            lng: 4,
            zoom: 4
        },
        paths: {
            p1: {
                color: '#008000',
                weight: 8,
                latlngs: [
                    { lat: 51.50, lng: -0.082 },
                    { lat: 48.83, lng: 2.37 },
                    { lat: 41.91, lng: 12.48 }
                ],
            }
        },
        markers: {
            london: {
                lat: 51.50,
                lng: -0.082,
                icon: {
                    iconUrl: 'examples/img/100x100_PNG/bigben100.png',
                    iconSize: [80, 80],
                    iconAnchor: [40, 80],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                }
            },
            paris: {
                lat: 48.83,
                lng: 2.37,
                icon: {
                    iconUrl: 'examples/img/100x100_PNG/eiffel100.png',
                    iconSize: [80, 80],
                    iconAnchor: [40, 60],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                }
            },
            roma: {
                lat: 41.91,
                lng: 12.48,
                icon: {
                    iconUrl: 'examples/img/100x100_PNG/colosseum100.png',
                    iconSize: [60, 60],
                    iconAnchor: [30, 40],
                    popupAnchor: [0, 0],
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0]
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);
