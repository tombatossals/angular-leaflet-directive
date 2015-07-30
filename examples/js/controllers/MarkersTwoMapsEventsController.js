        app.controller("MarkersTwoMapsEventsController", ['$scope', 'leafletData', function ($scope, $modalInstance, leafletData) {
            var markers = [];
            markers.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false
            });
            markers.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false
            });
            angular.extend($scope, {
                defaults: {
                    maxZoom: 18,
                    minZoom: 0,
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: [],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [ 'click' ],
                        logic: 'emit'
                    }
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '© OpenStreetMap contributors',
                                continuousWorld: true
                            }
                        }
                    }
                },
                center: {
                    zoom: 13,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers: markers
            });
            var markers2 = [];
            markers2.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false
            });
            markers2.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false
            });
            angular.extend($scope, {
                defaults2: {
                    maxZoom: 18,
                    minZoom: 0,
                    scrollWheelZoom: false
                },
                events2: {
                    map: {
                        enable: [],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [ 'click' ],
                        logic: 'emit'
                    }
                },
                layers2: {
                    baselayers: {
                        mapbox: {
                            name: 'Mapbox Terrain',
                            url: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                center2: {
                    zoom: 13,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers2: markers2
            });
            $scope.$on('leafletDirectiveMarker.click', function (e, args) {
                console.log(args);
            });
        }]);