        app.controller("ControlsFullscreenController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 37.8,
                    lng: -96,
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
                    fullscreen: {
                        position: 'topleft'
                    }
                }
           });
       }]);