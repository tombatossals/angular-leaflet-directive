var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", function ($http, $log) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: "=center",
            tilelayer: "=tilelayer",
            markers: "=markers",
            path: "=path"
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function (scope, element, attrs, ctrl) {
            var $el = element[0],
                map = new L.Map($el);

            // Default center of the map
            var point = new L.LatLng(40.094882122321145, -3.8232421874999996);
            map.setView(point, 1);

            // Set tile layer
            var tilelayer = scope.tilelayer || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            L.tileLayer(tilelayer, { maxZoom: 12 }).addTo(map);

            // Manage map center events
            if (attrs.center) {
                scope.$watch("center", function(center) {
                    if (center === undefined) return;

                    // Center of the map
                    center = new L.LatLng(scope.center.lat, scope.center.lng);
                    var zoom = scope.center.zoom || 8;
                    map.setView(center, zoom);
                });

                // Listen for map drags
                var dragging_map = false;
                map.on("dragstart", function(e) {
                    dragging_map = true;
                });

                map.on("drag", function (e) {
                    scope.$apply(function (s) {
                        s.center.lat = map.getCenter().lat;
                        s.center.lng = map.getCenter().lng;
                    });
                });

                map.on("dragend", function(e) {
                    dragging_map= false;
                });

                scope.$watch("center.lng", function (newValue, oldValue) {
                    if (dragging_map) return;
                    map.setView(new L.LatLng(map.getCenter().lat, newValue), map.getZoom());
                });

                scope.$watch("center.lat", function (newValue, oldValue) {
                    if (dragging_map) return;
                    map.setView(new L.LatLng(newValue, map.getCenter().lng), map.getZoom());
                });

                // Manage zoom events
                var zooming_map = false;
                map.on("zoomstart", function (e) {
                    zooming_map = true;
                });

                // Listen for zoom on DOM
                scope.$watch("center.zoom", function (newValue, oldValue) {
                    if (zooming_map) return;
                    map.setZoom(newValue);
                });

                map.on("zoomend", function (e) {
                    if (scope.center === undefined || scope.center.zoom === undefined) return;
                    scope.$apply(function (s) {
                        s.center.zoom = map.getZoom();
                    });
                    zooming_map = false;
                });
            }

            if (attrs.markers !== undefined) {
                var markers_dict = [];

                var createAndLinkMarker = function(mkey, scope) {
                    var markerData = scope.markers[mkey];
                    var marker = new L.marker(
                        scope.markers[mkey],
                        {
                            draggable: markerData.draggable ? true:false
                        }
                    );

                    if (markerData.message) {
                        scope.$watch("markers." + mkey + ".message", function(newValue) {
                            marker.bindPopup(markerData.message);
                        });

                        scope.$watch("markers." + mkey + ".focus", function(newValue) {
                            if (newValue) {
                                marker.openPopup();
                            }
                        });
                    }

                    if (markerData.draggable) {
                        var dragging_marker = false;
                        marker.on("dragstart", function(e) {
                            dragging_marker = true;
                        });

                        marker.on("drag", function (e) {
                            scope.$apply(function (s) {
                                markerData.lat = marker.getLatLng().lat;
                                markerData.lng = marker.getLatLng().lng;
                            });
                        });

                        marker.on("dragend", function(e) {
                            dragging_marker = false;
                            if (markerData.message) {
                                marker.openPopup();
                            }
                        });

                        scope.$watch('markers.' + mkey, function() {
                            marker.setLatLng(scope.markers[mkey]);
                        }, true);

                        scope.$watch("markers" + mkey + ".lng", function (newValue, oldValue) {
                            if (dragging_marker || !newValue) return;
                            marker.setLatLng(new L.LatLng(marker.getLatLng().lat, newValue));
                        });

                        scope.$watch("markers" + mkey + ".lat", function (newValue, oldValue) {
                            if (dragging_marker || !newValue) return;
                            marker.setLatLng(new L.LatLng(newValue, marker.getLatLng().lng));
                        });
                    }

                    return marker;
                }; // end of create and link marker

                scope.$watch("markers", function(newMarkerList) {
                    // find deleted markers
                    for (var delkey in markers_dict) {
                        if (!scope.markers[delkey]) {
                            map.removeLayer(markers_dict[delkey]);
                        }
                    }
                    // add new markers
                    for (var mkey in scope.markers) {
                        if (markers_dict[mkey] === undefined) {
                            var marker = createAndLinkMarker(mkey, scope);
                            map.addLayer(marker);
                            markers_dict[mkey] = marker;
                        }
                    } // for mkey in markers
                }, true); // watch markers
            } // if attrs.markers

            if (attrs.path) {
                var mp_polyline = new L.Polyline([], {});
                map.addLayer(mp_polyline);
                scope.$watch("path", function(newPath) {
                    mp_polyline.setLatLngs(scope.path.latlngs);
                    mp_polyline.setStyle({
                        smoothFactor: scope.path.smoothFactor,
                        color: scope.path.color
                    });
                }, true);
            } // end of attrs.path
        } // end of link function
    };
});
