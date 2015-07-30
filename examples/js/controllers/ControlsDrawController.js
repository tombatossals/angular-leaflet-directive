        app.controller("ControlsDrawController", [ "$scope", "leafletData", function($scope, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                controls: {
                    draw: {}
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
                            },
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        draw: {
                            name: 'draw',
                            type: 'group',
                            visible: true,
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    }
                }
           });
           leafletData.getMap().then(function(map) {
               leafletData.getLayers().then(function(baselayers) {
                  var drawnItems = baselayers.overlays.draw;
                  map.on('draw:created', function (e) {
                    var layer = e.layer;
                    drawnItems.addLayer(layer);
                    console.log(JSON.stringify(layer.toGeoJSON()));
                  });
               });
           });
       }]);