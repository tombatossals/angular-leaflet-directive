        app.controller('MarkersSimpleController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    mainMarker: {
                        lat: 51,
                        lng: 0,
                        focus: true,
                        message: "Hey, drag me if you want",
                        draggable: true
                    }
                }
            });
        } ]);