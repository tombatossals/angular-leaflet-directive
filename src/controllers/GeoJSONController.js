app.controller("GeoJSONController", [ '$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
        japan: {
            lat: 37.26,
            lng: 138.86,
            zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    // Get the countries geojson data from a JSON
    $http.get("examples/json/JPN.geo.json").success(function(data, status) {
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
}]);
