        app.controller('PathsDecorationsSimpleController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                decorations: {
                    markers: {
                        coordinates: [[51.9, -0.4], [51.505, -0.09], [51.0, -0.4]],
                        patterns: [
                            { offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}}) },
                            { offset: 0, repeat: 25, symbol: L.Symbol.dash({pixelSize: 0}) }
                        ]
                    }
                }
            });
            $scope.changePattern = function(type) {
                if (type === 'dot') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 0,
                            repeat: 10,
                            symbol: L.Symbol.dash({pixelSize: 0})
                        }
                    ];
                } else if (type === 'slash') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})
                        }
                    ];
                } else if (type === 'slashdot') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})
                        },
                        {
                            offset: 0,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 0})
                        }
                    ];
                } else if (type === 'arrow') {
                    $scope.decorations.markers.patterns = [
                        {
                            offset: 12,
                            repeat: 25,
                            symbol: L.Symbol.dash({pixelSize: 18, pathOptions: {color: '#f00', weight: 4}})
                        },
                        {
                            offset: '10%',
                            repeat: 25,
                            symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}})
                        }
                    ];
                }
            };
        } ]);