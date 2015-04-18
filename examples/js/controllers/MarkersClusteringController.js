        app.controller("MarkersClusteringController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 24.0391667,
                    lng: 121.525,
                    zoom: 6
                },
                markers: {
                    taipei: {
                        layer: "northTaiwan",
                        lat: 25.0391667,
                        lng: 121.525,
                    },
                    yangmei: {
                        layer: "northTaiwan",
                        lat: 24.9166667,
                        lng: 121.1333333
                    },
                    hsinchu: {
                        layer: "northTaiwan",
                        lat: 24.8047222,
                        lng: 120.9713889
                    },
                    miaoli: {
                        layer: "northTaiwan",
                        lat: 24.5588889,
                        lng: 120.8219444
                    },
                    tainan: {
                        layer: "southTaiwan",
                        lat: 22.9933333,
                        lng: 120.2036111
                    },
                    puzi: {
                        layer: "southTaiwan",
                        lat: 23.4611,
                        lng: 120.242
                    },
                    kaohsiung: {
                        layer: "southTaiwan",
                        lat: 22.6252777778,
                        lng: 120.3088888889
                    },
                    taitun: {
                        layer: "southTaiwan",
                        lat: 22.75,
                        lng: 121.15
                    }
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia22g09'
                            }
                        }
                    },
                    overlays: {
                        northTaiwan: {
                            name: "North cities",
                            type: "markercluster",
                            visible: true
                        },
                        southTaiwan: {
                            name: "South cities",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });
        }]);