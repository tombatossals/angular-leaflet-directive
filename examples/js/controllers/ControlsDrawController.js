        app.controller("ControlsDrawController", [ "$scope", "leafletData", function($scope, leafletData) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                controls: {
                    draw: {}
                }
           });
           leafletData.getMap().then(function(map) {
              var drawnItems = $scope.controls.edit.featureGroup;
              map.on('draw:created', function (e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);
                console.log(JSON.stringify(layer.toGeoJSON()));
              });
           });
       }]);