    app.controller("GeoJSONNestedController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
        leafletData.getGeoJSON().then(function(lObjs){
            window.leafletDataGeoJSON = lObjs;
        });
        angular.extend($scope, {
            japan: {
                lat: 27.26,
                lng: 78.86,
                zoom: 2
            },
            defaults: {
                scrollWheelZoom: false
            },
            geojson:{}
        });
        // Mouse over function, called from the Leaflet Map Events
        var countryMouseover = function (feature, leafletEvent) {
            var layer = leafletEvent.target;
            layer.setStyle({
                weight: 2,
                color: '#666',
                fillColor: 'white'
            });
            layer.bringToFront();
        };
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, leafletPayload) {
            countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
        });
        $scope.centerJSON = function(name) {
            leafletData.getMap().then(function(map) {
                window.leafletMap = map;
                var latlngs = [];
                for (var i in $scope.geojson[name].data.features[0].geometry.coordinates) {
                    var coord = $scope.geojson[name].data.features[0].geometry.coordinates[i];
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
            angular.extend($scope.geojson, {
                japan: {
                    data: data,
                    resetStyleOnMouseout: true,
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
        $http.get("json/USA.geo.json").success(function(data, status) {
            angular.extend($scope.geojson, {
                usa:{
                    data: data,
                    resetStyleOnMouseout: true,
                    style: {
                        fillColor: "blue",
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