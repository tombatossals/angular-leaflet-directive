var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", ["$http", "$log", function ($http, $log) {
    var defaults = {
        maxZoom: 10,
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        icon: {
            url: 'img/leaflet/marker-icon.png',
            retinaUrl: 'img/leaflet/marker-icon-2x.png',
            size: [25, 41],
            anchor: [12, 40],
            popup: [-3, -76],
            shadow: {
                url: 'img/leaflet/marker-shadow.png',
                retinaUrl: 'img/leaflet/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        },
        path: {
            weight: 10,
            opacity: 1
        }
    };
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            markers: '=markers',
            path: '=path'
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function ($scope, element, attrs /*, ctrl */) {
            var map = new L.Map(element[0]);
            map.setView([0, 0], 1);

            $scope.leaflet = {};
            $scope.leaflet.map = !!attrs.testing ? map : 'Add testing="testing" to <leaflet> tag to inspect this object';
            $scope.leaflet.maxZoom = !!attrs.maxzoom ? parseInt(attrs.maxzoom, defaults.maxZoom) : defaults.maxZoom;
            $scope.leaflet.tileLayer = attrs.tileLayer || defaults.tileLayer;

            L.tileLayer($scope.leaflet.tileLayer, { maxZoom: $scope.leaflet.maxZoom }).addTo(map);

            setupCenter();
            setupMarkers();
            setupPath();

            function setupCenter() {
                if (!$scope.center) {
                    return;
                }

                if ($scope.center.lat && $scope.center.lng && $scope.center.zoom) {
                    map.setView([$scope.center.lat, $scope.center.lng], $scope.center.zoom);
                } else if ($scope.center.autoDiscover === true) {
                    map.locate({ setView: true, maxZoom: $scope.maxZoom });
                }

                map.on("dragend", function (/* event */) {
                    $scope.$apply(function (scope) {
                        scope.center.lat = map.getCenter().lat;
                        scope.center.lng = map.getCenter().lng;
                    });
                });

                map.on("zoomend", function (/* event */) {
                    if ($scope.center.zoom !== map.getZoom()) {
                        $scope.$apply(function (s) {
                            s.center.zoom = map.getZoom();
                        });
                    }
                });

                $scope.$watch("center", function (center /*, oldValue */) {
                    if (center.lat && center.lng && center.zoom) {
                        map.setView([center.lat, center.lng], center.zoom);
                    }
                }, true);
            }

            function setupMarkers() {
                var markers = {};
                $scope.leaflet.markers = !!attrs.testing ? markers : 'Add testing="testing" to <leaflet> tag to inspect this object';
                if (!$scope.markers) {
                    return;
                }
                addMarkers($scope.markers, markers);

                $scope.$watch("markers", function (newMarkers) {
                    addMarkers(newMarkers, markers);
                }, true);
            }

            function addMarkers(markers, currentMarkers) {
                for (var name in markers) {
                    if (currentMarkers[name] === undefined) {
                        var marker = buildMarker(name);

                        marker.on("dragend", function (/* event */) {
                            $scope.$apply(function (/* scope */) {
                                data.lat = marker.getLatLng().lat;
                                data.lng = marker.getLatLng().lng;
                            });
                            if (data.message) {
                                marker.openPopup();
                            }
                        });

                        $scope.$watch('markers.' + name, function (data, oldData) {
                            if (!data) {
                                map.removeLayer(currentMarkers[name]);
                                delete currentMarkers[name];
                                return;
                            }

                            if (data.draggable !== undefined && data.draggable !== oldData.draggable) {
                                if (data.draggable === true) {
                                    marker.dragging.enable();
                                } else {
                                    marker.dragging.disable();
                                }
                            }

                            if (data.focus !== undefined && data.focus !== oldData.focus) {
                                if (data.focus === true) {
                                    marker.openPopup();
                                } else {
                                    marker.closePopup();
                                }
                            }

                            if (data.message !== undefined && data.message !== oldData.message) {
                                marker.bindPopup(data);
                            }

                            if (data.lat !== oldData.lat || data.lng !== oldData.lng) {
                                marker.setLatLng(new L.LatLng(data.lat, data.lng));
                            }
                        }, true);
                        map.addLayer(marker);
                        currentMarkers[name] = marker;
                    }
                }
            }

            function buildMarker(name) {
                var data, marker;
                data = $scope.markers[name];
                marker = new L.marker(
                        $scope.markers[name],
                        {
                            icon: buildIcon(),
                            draggable: data.draggable ? true : false
                        }
                );
                if (data.message) {
                    marker.bindPopup(data.message);
                }
                return marker;
            }

            function buildIcon() {
                return L.icon({
                    iconUrl: defaults.icon.url,
                    iconRetinaUrl: defaults.icon.retinaUrl,
                    iconSize: defaults.icon.size,
                    iconAnchor: defaults.icon.anchor,
                    popupAnchor: defaults.icon.popup,
                    shadowUrl: defaults.icon.shadow.url,
                    shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
                    shadowSize: defaults.icon.shadow.size,
                    shadowAnchor: defaults.icon.shadow.anchor
                });
            }

            function setupPath() {
                // TODO Create as many polylines as paths defined in model
                // TODO Manage opacity changes with another $watch block
                if (!$scope.path) {
                    return;
                }

                $log.warn("[AngularJS - Leaflet] Creating polylines and adding them to the map will break the directive's scope's inspection in AngularJS Batarang");

                var polyline = new L.Polyline([], { weight: defaults.path.weight, opacity: defaults.path.opacity});
                $scope.leaflet.path = !!attrs.testing ? polyline : 'Add testing="testing" to <leaflet> tag to inspect this object';

                map.addLayer(polyline);

                $scope.$watch("path.latlngs", function (latlngs) {
                    var leafletLatLngs = latlngs
                            .filter(function (latlng) {
                                return !!latlng.lat && !!latlng.lng;
                            })
                            .map(function (latlng) {
                                return new L.LatLng(latlng.lat, latlng.lng);
                            });
                    polyline.setLatLngs(leafletLatLngs);
                }, true);

                $scope.$watch("path.weight", function (weight) {
                    polyline.setStyle({ weight: weight });
                }, true);

                $scope.$watch("path.color", function (color) {
                    polyline.setStyle({ color: color });
                }, true);
            }
        }
    };
}]);
