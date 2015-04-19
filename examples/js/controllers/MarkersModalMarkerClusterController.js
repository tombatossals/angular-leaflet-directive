        app.controller("MarkersModalMarkerClusterController", ['$scope', 'leafletData', function($scope, leafletData) {
            var markers = [];
            markers.push({
                lat: 52.229676,
                lng: 21.012229,
                draggable: false,
                group: 'markers'
            });
            markers.push({
                lat: 52.219081,
                lng: 21.025386,
                draggable: false,
                group: 'markers'
            });
            angular.extend($scope, {
                defaults: {
                    maxZoom: 18,
                    minZoom: 0
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
                    zoom: 10,
                    lat: 52.229676,
                    lng: 21.012229
                },
                markers: {
                    m1: {
                        lat: 52.229676,
                        lng: 21.012229,
                        draggable: false,
                        group: 'markers'
                    },
                    m2: {
                        lat: 52.219081,
                        lng: 21.025386,
                        draggable: false,
                        group: 'markers'
                    }
                }
            });
            var map;
            leafletData.getMap().then(function(lfMap) {
                map = lfMap;
            });
            $scope.showModal = function() {
                $('.ui.modal').modal('show');
                map.invalidateSize();
            };
        }]);