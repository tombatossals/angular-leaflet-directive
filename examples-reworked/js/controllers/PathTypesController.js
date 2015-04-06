        app.controller('PathTypesController', [ '$scope', function($scope) {
            var europeCapitals = {
                Madrid: {
                    lat: 40.4,
                    lng: -3.6833333
                },
                Rome: {
                    lat: 41.9,
                    lng: 12.4833333
                },
                London: {
                    lat: 51.5,
                    lng: -0.116667
                },
                Lisbon: {
                    lat: 38.7166667,
                    lng: -9.1333333
                },
                Berlin: {
                    lat: 52.5166667,
                    lng: 13.4
                },
                Paris: {
                    lat: 48.866667,
                    lng: 2.333333
                },
                Brussels: {
                    lat: 50.8333,
                    lng: 4
                }
            };
            var pathsDict = {
                polyline: {
                    type: "polyline",
                    latlngs: [ europeCapitals.London, europeCapitals.Madrid, europeCapitals.Rome ]
                },
                multiPolyline: {
                    type: "multiPolyline",
                    latlngs: [
                        [ europeCapitals.London, europeCapitals.Lisbon ],
                        [ europeCapitals.Paris, europeCapitals.Madrid ],
                        [ europeCapitals.Rome, europeCapitals.Berlin ]
                    ]
                },
                polygon: {
                   type: "polygon",
                   latlngs: [ europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ]
                },
                multiPolygon: {
                    type: "multiPolygon",
                    latlngs: [
                                [ europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ],
                                [ europeCapitals.Berlin, europeCapitals.Rome, europeCapitals.Brussels ]
                            ]
                },
                rectangle: {
                    type: "rectangle",
                    latlngs: [ europeCapitals.Berlin, europeCapitals.Lisbon ]
                },
                circle: {
                    type: "circle",
                    radius: 500 * 1000,
                    latlngs: europeCapitals.Brussels
                },
                circleMarker: {
                    type: "circleMarker",
                    radius: 50,
                    latlngs: europeCapitals.Rome
                }
            };
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 3
                },
                paths: {}
            });
            $scope.addShape = function(shape) {
                $scope.paths = {};
                $scope.paths[shape] = pathsDict[shape];
            };
        } ]);