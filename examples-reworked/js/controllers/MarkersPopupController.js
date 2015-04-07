        app.controller('MarkersPopupController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 51.505,
                        lng: -0.09,
                        focus: true,
                        draggable: false,
                        message: "Hi there!",
                        icon: {}
                    }
                },
                iconA: {},
                iconB: {
                	iconUrl: 'img/leaf-orange.png',
                	shadowUrl: 'img/leaf-shadow.png',
                	iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62]
                },
                iconC: {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    markerColor: 'red'
                },
                iconD: {
                    type: 'makiMarker',
                    icon: 'beer',
                    color: '#f00',
                    size: "l"
                },
                iconE: {
                    type: 'extraMarker',
                    icon: 'fa-star',
                    color: '#f00',
                    prefix: 'fa',
                    shape: 'circle'
                }
            });
            $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Click");
            });
            $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Open");
            });
            $scope.$on('leafletDirectiveMarker.popupclose', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Close");
            });
        } ]);