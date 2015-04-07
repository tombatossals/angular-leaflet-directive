        app.controller('MarkersGroupController', [ '$scope', function($scope) {
            var icons = {
                blue: {
                    type: 'div',
                    iconSize: [10, 10],
                    className: 'blue',
                    iconAnchor:  [5, 5]
                },
                red: {
                    type: 'div',
                    iconSize: [10, 10],
                    className: 'red',
                    iconAnchor:  [5, 5]
                }
            }
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 11
                },
                layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        red: {
                            type: 'group',
                            name: 'red',
                            visible: false
                        },
                        blue: {
                            type: 'group',
                            name: 'blue',
                            visible: false
                        }
                    }
                },
                markers: {
                    stoke: {
                        layer: 'blue',
                        lat: 51.5615,
                        lng: -0.0731,
                        icon: icons.blue
                    },
                    dalston: {
                        layer: 'blue',
                        lat: 51.545,
                        lng: -0.070,
                        icon: icons.blue
                    },
                    wandsworth: {
                      layer: 'red',
                        lat: 51.4644,
                        lng:-0.1924,
                        icon: icons.red
                    },
                    battersea: {
                        layer: 'red',
                        lat: 51.4638,
                        lng: -0.1677,
                        icon: icons.red
                    }
                },
                toggleLayer: function(type)
                {
                    $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
                }
            });
        } ]);