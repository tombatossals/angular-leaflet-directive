        app.controller("PathSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                europeanPaths: {
                    p1: {
                        color: 'red',
                        weight: 8,
                        latlngs: [
                            { lat: 51.50, lng: -0.082 },
                            { lat: 48.83, lng: 2.37 },
                            { lat: 41.91, lng: 12.48 }
                        ],
                        message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
                    },
                    p2: {
                        color: 'green',
                        weight: 8,
                        latlngs: [
                            { lat: 48.2083537, lng: 16.3725042 },
                            { lat: 48.8534, lng: 2.3485 }
                        ],
                        label: {message: "<h3>Route from Vienna to Paris</h3><p>Distance: 1211km</p>"}
                    }
                }
            });
        }]);