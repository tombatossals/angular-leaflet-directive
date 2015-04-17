        app.controller('MarkersRotationController', [ '$scope', function($scope) {
            var markers = {
                    m1: {
                        lat: 41.95,
                        lng: -87.65,
                        message: "I'm a static marker at 0 degrees",
                        focus: false,
                        iconAngle: 0
                    },
                    m2: {
                        lat: 41.85,
                        lng: -87.95,
                        message: "I'm a static marker at 270 degrees",
                        focus: false,
                        iconAngle: 270
                    },
                    m3: {
                        lat: 41.85,
                        lng: -87.05,
                        message: "I'm a static marker at 90 degrees",
                        focus: false,
                        iconAngle: 90
                    },
                    m4: {
                        lat: 41.35,
                        lng: -87.65,
                        message: "I'm a static marker at 180 degrees",
                        focus: false,
                        iconAngle: 180
                    }
                };
            angular.extend($scope, {
                chicago: {
                    lat: 41.85,
                    lng: -87.65,
                    zoom: 8
                },
                markers: markers
            });
        } ]);