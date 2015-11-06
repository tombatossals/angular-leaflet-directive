        app.controller("LayersOverlayGeoJSONController", [ "$scope", '$http', function($scope, $http) {
            angular.extend($scope, {
                world: {
                    lat: 0,
                    lng: 0,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                        },
                    },
                    overlays:{}
                }
            });
        $http.get("json/countries.geo.json").success(function(data, status) {
            angular.extend($scope.layers.overlays, {
                countries: {
                    name:'World Country Boundaries',
                    type: 'geoJSONShape',
                    data: data,
                    visible: true,
                    layerOptions: {
                        style: {
                                color: '#00D',
                                fillColor: 'red',
                                weight: 2.0,
                                opacity: 0.6,
                                fillOpacity: 0.2
                        }
                    }
                }
            });
        });
        $http.get("json/major_cities.json").success(function(data, status) {
                    angular.extend($scope.layers.overlays, {
                        cities: {
                            name:'Major Cities (Awesome Markers)',
                            type: 'geoJSONAwesomeMarker',
                            data: data,
                            visible: true,
                            icon: {
                                icon: 'heart',
                                markerColor: 'red',
                                prefix: 'fa'
                            }
                        }
                    });
                });
        }]);