        app.controller("BasicMaxBoundsPadController", ["$scope", "leafletBoundsHelpers", function($scope, leafletBoundsHelpers) {
            var maxbounds = leafletBoundsHelpers.createBoundsFromArray([
                [37.8866, -79.4877],
                [39.7230, -74.9863]
            ]);
            maxbounds.pad = 1.0;
            angular.extend($scope, {
                bounds: maxbounds,
                center: {
                    lat: 37.8866,
                    lng: -79-4877,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {}
                },
                markers: {
                    northeast: {
                        lat: 39.7230,
                        lng: -74.9863,
                        focus: true,
                        title: "Northeast",
                    },
                    southwest: {
                        lat: 37.8866,
                        lng: -79.4877,
                        title: "Southwest",
                    }
                },
                maxbounds: maxbounds
            });
        }]);