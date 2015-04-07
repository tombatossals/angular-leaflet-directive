        app.controller("MarkersClustering10000MarkersController", [ "$scope", function($scope) {
            var addressPointsToMarkers = function(points) {
              return points.map(function(ap) {
                return {
                  layer: 'realworld',
                  lat: ap[0],
                  lng: ap[1]
                };
              });
            };
            angular.extend($scope, {
                center: {
                    lat: -37.9212959167,
                    lng: 175.5604435167,
                    zoom: 11
                },
                events: {
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [],
                        logic: 'emit'
                    }
                },
                markers: addressPointsToMarkers(addressPoints),
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
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true,
                            "layerOptions": {
                                "chunkedLoading": true,
                                "showCoverageOnHover": false,
                                "removeOutsideVisibleBounds": true
                            }
                        },
                    }
                }
            });
        }]);