        app.controller("ControlsMinimapController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bogota: {
                    lat: 4.649,
                    lng: -74.086,
                    zoom: 5
                },
                tiles: {
                    name: 'Mapbox Comic',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lpa06kfg'
                    }
                },
                controls: {
                    minimap: {
                        layer: {
                            name: 'Mapbox Comic',
                            key: 'bufanuvols.lpa06kfg',
                            apiKey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                            type: 'mapbox',
                            layerParams: {
                                version: 4
                            }
                        },
                        toggleDisplay: true
                    }
                }
           });
       }]);