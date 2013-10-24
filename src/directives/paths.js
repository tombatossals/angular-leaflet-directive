angular.module("leaflet-directive").directive('paths', function ($log, leafletData) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var paths = $scope.paths;

            setupPaths(paths, map, defaults);

            function setupPaths(paths, map, defaults) {
                var leafletPaths = {};
                leafletData.setPaths(leafletPaths);

                if (!isDefined(paths)) {
                    return;
                }

                $scope.$watch("paths", function (newPaths) {
                    for (var new_name in newPaths) {
                        if (!isDefined(leafletPaths[new_name])) {
                            leafletPaths[new_name] = createPath(new_name, newPaths[new_name], map, defaults);
                        }
                    }
                    // Delete paths from the array
                    for (var name in leafletPaths) {
                        if (!isDefined(newPaths[name])) {
                            delete leafletPaths[name];
                        }
                    }
                }, true);
            }

            function createPath(name, scopePath, map, defaults) {
                var path;
                var options = {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                };
                if(isDefined(scopePath.stroke)) {
                    options.stroke = scopePath.stroke;
                }
                if(isDefined(scopePath.fill)) {
                    options.fill = scopePath.fill;
                }
                if(isDefined(scopePath.fillColor)) {
                    options.fillColor = scopePath.fillColor;
                }
                if(isDefined(scopePath.fillOpacity)) {
                    options.fillOpacity = scopePath.fillOpacity;
                }
                if(isDefined(scopePath.smoothFactor)) {
                    options.smoothFactor = scopePath.smoothFactor;
                }
                if(isDefined(scopePath.noClip)) {
                    options.noClip = scopePath.noClip;
                }
                if(!isDefined(scopePath.type)) {
                    scopePath.type = "polyline";
                }

                function setPathOptions(data) {
                    if (isDefined(data.latlngs)) {
                        switch(data.type) {
                            default:
                            case "polyline":
                            case "polygon":
                                path.setLatLngs(convertToLeafletLatLngs(data.latlngs));
                                break;
                            case "multiPolyline":
                            case "multiPolygon":
                                path.setLatLngs(convertToLeafletMultiLatLngs(data.latlngs));
                                break;
                            case "rectangle":
                                path.setBounds(new L.LatLngBounds(convertToLeafletLatLngs(data.latlngs)));
                                break;
                            case "circle":
                            case "circleMarker":
                                path.setLatLng(convertToLeafletLatLng(data.latlngs));
                                if (isDefined(data.radius)) {
                                    path.setRadius(data.radius);
                                }
                                break;
                        }
                    }

                    if (isDefined(data.weight)) {
                        path.setStyle({ weight: data.weight });
                    }

                    if (isDefined(data.color)) {
                        path.setStyle({ color: data.color });
                    }

                    if (isDefined(data.opacity)) {
                        path.setStyle({ opacity: data.opacity });
                    }
                }

                switch(scopePath.type) {
                    default:
                    case "polyline":
                        path = new L.Polyline([], options);
                        break;
                    case "multiPolyline":
                        path = new L.multiPolyline([[[0,0],[1,1]]], options);
                        break;
                    case "polygon":
                        path = new L.Polygon([], options);
                        break;
                    case "multiPolygon":
                        path = new L.MultiPolygon([[[0,0],[1,1],[0,1]]], options);
                        break;
                    case "rectangle":
                        path = new L.Rectangle([[0,0],[1,1]], options);
                        break;
                    case "circle":
                        path = new L.Circle([0,0], 1, options);
                        break;
                    case "circleMarker":
                        path = new L.CircleMarker([0,0], options);
                        break;
                }
                map.addLayer(path);

                var clearWatch = $scope.$watch('paths.' + name, function(data, oldData) {
                    if (!isDefined(data)) {
                        map.removeLayer(path);
                        clearWatch();
                        return;
                    }
                    setPathOptions(data);
                }, true);

                return path;
            }

            function convertToLeafletLatLng(latlng) {
                return new L.LatLng(latlng.lat, latlng.lng);
            }

            function convertToLeafletLatLngs(latlngs) {
                return latlngs.filter(function(latlng) {
                    return !!latlng.lat && !!latlng.lng;
                }).map(function (latlng) {
                    return new L.LatLng(latlng.lat, latlng.lng);
                });
            }

            function convertToLeafletMultiLatLngs(paths) {
                return paths.map(function(latlngs) {
                    return convertToLeafletLatLngs(latlngs);
                });
            }
        }
    };
});
