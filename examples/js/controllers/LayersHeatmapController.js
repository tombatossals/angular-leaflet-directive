        app.controller("LayersHeatmapController", ["$scope", "$http", function($scope, $http) {
            var points = [];
            var heatmap = {
                name: 'Heat Map',
                type: 'heat',
                data: points,
                visible: true
            };
            $http.get("json/heat-points.json").success(function(data) {
                $scope.layers.overlays = {
                    heat: {
                        name: 'Heat Map',
                        type: 'heat',
                        data: data,
                        layerOptions: {
                            radius: 20,
                            blur: 10
                        },
                        visible: true
                    }
                };
            });
            angular.extend($scope, {
                center: {
                    lat: 37.774546,
                    lng: -122.433523,
                    zoom: 12
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
                    }
                }
            });
        }]);