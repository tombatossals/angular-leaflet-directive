      app.controller("GeoJSONController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        angular.extend($scope, {
            japan: {
                lat: 38.51,
                lng: 139,
                zoom: 4
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
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