        app.controller('PathsChangeInGroupLayerController', function($scope, leafletData) {
            $scope.changePaths = function() {
                $scope.paths = {
                    p2: {
                        color: '#FC0',
                        weight: 8,
                        latlngs: [ { lat: 52.50, lng: -0.082 }, { lat: 42.91, lng: 12.48 } ],
                        layer: 'test'
                    }
                };
            };
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                paths : {
                    p1: {
                        color: '#000',
                        weight: 8,
                        latlngs: [{ lat: 51.50, lng: -0.082 }, { lat: 41.91, lng: 12.48 }],
                        layer: 'test'
                    }
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
                            layerOptions: {
                                subdomains: '1234',
                                attribution: 'test'
                            }
                        }
                    },
                    overlays: {
                        test: {
                            name: 'Test',
                            visible: true,
                            type: 'group'
                        }
                    }
                }
            });
        });