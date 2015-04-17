    app.controller("GeoJSONNonNestedController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        var getColor = function(id){
            return id == 'USA'? 'blue' : 'green';
        };
        var getStyle = function(feature){
            return {
                fillColor: getColor(feature.id),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        };
        var createGeoJsonObject = function (data){
            return {
                data: data,
                style: getStyle
            };
        };
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            },
        });
        $scope.centerJSON = function(index) {
            leafletData.getMap().then(function(map) {
                var latlngs = [];
                for (var i in $scope.geojson.data.features[index].geometry.coordinates) {
                    var coord = $scope.geojson.data.features[index].geometry.coordinates[i];
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
            if(!$scope.geojson){
                $scope.geojson = createGeoJsonObject(data);
            }
        });
        $http.get("json/USA.geo.json").success(function(data, status) {
            var features = $scope.geojson.data.features.concat(data.features);
            var copy = angular.extend({}, $scope.geojson.data);
            copy.features = features;
            $scope.geojson.data = copy;
        });
    } ]);