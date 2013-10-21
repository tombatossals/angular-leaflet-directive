angular.module("leaflet-directive").directive('geojson', function ($log, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var leafletGeoJSON;
            setupGeoJSON(map);

            function setupGeoJSON(map, geojson, defaults) {
                $scope.$watch("geojson", function(geojson) {
                    if (!isDefined(geojson)) {
                        return;
                    }

                    if (isDefined(leafletGeoJSON)) {
                        map.removeLayer($scope.leaflet.geojson);
                    }

                    if (isDefined(geojson.data)) {
                        var resetStyleOnMouseout = geojson.resetStyleOnMouseout;

                        leafletGeoJSON = L.geoJson(geojson.data, {
                            style: geojson.style,
                            onEachFeature: function(feature, layer) {
                                layer.on({
                                    mouseover: function(e) {
                                        safeApply($scope, function() {
                                            geojson.selected = feature;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                                        });
                                    },
                                    mouseout: function(e) {
                                        if (resetStyleOnMouseout) {
                                            leafletGeoJSON.resetStyle(e.target);
                                        }
                                        safeApply($scope, function() {
                                            geojson.selected = undefined;
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                        });
                                    },
                                    click: function(e) {
                                        safeApply($scope, function() {
                                            $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', geojson.selected, e);
                                        });
                                    }
                                });
                            }
                        }).addTo(map);
                    }
                });
            }
        }
    };
});
