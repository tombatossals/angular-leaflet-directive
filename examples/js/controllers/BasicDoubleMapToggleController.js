        app.controller("BasicDoubleMapToggleController", [ "$scope", "$log", "leafletData", function($scope, $log, leafletData) {
            angular.extend($scope, {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 5
                },
                paths: {
                    p1: {
                        color: 'blue',
                        weight: 8,
                        latlngs: [{
                            lat: 51.50,
                            lng: -0.082
                        }, {
                            lat: 48.83,
                            lng: 2.37
                        }, {
                            lat: 41.91,
                            lng: 12.48
                        }]
                    }
                },
            });
            angular.extend($scope, {
                center2: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 5
                },
                tiles2: {
                    name: 'Mapbox Outdoors',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia3no0m'
                    }
                },
                paths2: {
                    p1: {
                        color: 'red',
                        weight: 8,
                        latlngs: [{
                            lat: 51.50,
                            lng: -0.082
                        }, {
                            lat: 48.83,
                            lng: 2.37
                        }, {
                            lat: 41.91,
                            lng: 12.48
                        }]
                    }
                },
            });
        }]);