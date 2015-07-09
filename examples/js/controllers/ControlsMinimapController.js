        app.controller("ControlsMinimapController", [ "$scope", "leafletData", function($scope, leafletData) {
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
                controls: {}
           });
           // Wait for center to be stablished
           leafletData.getMap().then(function() {
               angular.extend($scope.controls, {
                   minimap: {
                       type: 'minimap',
                       layer: {
                           name: 'OpenStreetMap',
                           url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                           type: 'xyz'
                       },
                       toggleDisplay: true
                   }
               });
           });
       }]);