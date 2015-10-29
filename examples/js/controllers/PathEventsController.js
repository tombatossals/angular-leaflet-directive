        app.controller("PathEventsController", function($scope, leafletLogger) {
            // leafletLogger.currentLevel = leafletLogger.LEVELS.debug;
            var paths = {};
            $scope.clicked = 0;
            var marylandIslands = {
                'Fort Carroll': {
                    lat: 39.214766,
                    lng: -76.519003
                },
                    'Gibson Island': {
                    lat: 39.077642,
                    lng: -76.433344
                },
                    'Solomons Island': {
                    lat: 38.320145,
                    lng: -76.457334
                }
            };
            angular.forEach(marylandIslands, function (v, k) {
                paths[k] = {
                    type: "circleMarker",
                    latlngs: v,
                    stroke: false,
                    fillColor: "#00FFFF",
                    fillOpacity: 0.7,
                    radius: 10,
                    clickable: true
                };
            });
            angular.extend($scope, {
                center: {
                    lat:38.976492,
                    lng:-76.49231,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                events: {
                    path: {
                        enable: [ 'click', 'mouseover' ]
                    }
                },
                paths: paths
            });
            $scope.$on('leafletDirectivePath.myMap.click', function (event) {
                $scope.clicked++;
            });
            $scope.$on('leafletDirectivePath.myMap.mouseover', function (event, path) {
                $scope.mouseover = path.modelName;
            });
        });