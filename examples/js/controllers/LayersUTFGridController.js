        app.controller("LayersUTFGridController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 1
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        demosutfgrid: {
                            name: 'UTFGrid Interactivity',
                            type: 'utfGrid',
                            url: 'http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}',
                            visible: true
                        }
                    }
                }
            });
            $scope.interactivity = "";
            $scope.flag = "";
            $scope.$on('leafletDirectiveMap.utfgridMouseover', function(event, leafletEvent) {
                // the UTFGrid information is on leafletEvent.data
                $scope.interactivity = leafletEvent.data.admin;
                $scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;
            });
            $scope.$on('leafletDirectiveMap.utfgridMouseout', function(event, leafletEvent) {
                $scope.interactivity = "";
                $scope.flag = "";
            });
        }]);