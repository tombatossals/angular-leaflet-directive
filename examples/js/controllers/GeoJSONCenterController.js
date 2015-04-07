      app.controller("GeoJSONCenterController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
        $scope.centerJSON = function() {
            leafletData.getMap().then(function(map) {
                var latlngs = [];
                for (var i in $scope.geojson.data.features[0].geometry.coordinates) {
                    var coord = $scope.geojson.data.features[0].geometry.coordinates[i];
                    for (var j in coord) {
                        var points = coord[j];
                        for (var k in points) {
                            latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                        }
                    }
                }
                map.fitBounds(latlngs);
            });
        };
        // Get the countries geojson data from a JSON
        $http.get("json/JPN.geo.json").success(function(data, status) {
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }
            });
        });
      } ]);