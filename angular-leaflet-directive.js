var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", function ($http, $log) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: "=center",
            marker: "=marker",
            message: "=message",
            zoom: "=zoom",
            multiMarkers: "=multimarkers",
            mainPath: "=mainpath"
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function (scope, element, attrs, ctrl) {
            var $el = element[0], map = new L.Map($el);
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12 }).addTo(map);

            // Default center of the map
            var point = new L.LatLng(40.094882122321145, -3.8232421874999996);
            map.setView(point, 5);

            scope.$watch("center", function(center) {
                if (center === undefined) return;

                // Center of the map
                center = new L.LatLng(scope.center.lat, scope.center.lng);
                var zoom = scope.zoom || 8;
                map.setView(center, zoom);

                var marker = new L.marker(scope.center, {
                    draggable: attrs.markcenter ? false:true
                });

                if (attrs.markcenter || attrs.marker) {
                    map.addLayer(marker);

                    if (attrs.marker) {
                        scope.marker.lat = marker.getLatLng().lat;
                        scope.marker.lng = marker.getLatLng().lng;
                    }

                    scope.$watch("message", function(newValue) {
                        marker.bindPopup("<strong>" + newValue + "</strong>", { closeButton: false });
                        marker.openPopup();
                    });
                }

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

                // Listen for zoom
                scope.$watch("zoom", function (newValue, oldValue) {
                    map.setZoom(newValue);
                });

                map.on("zoomend", function (e) {
                    scope.$apply(function (s) {
                        s.zoom = map.getZoom();
                    });
                });

                if (attrs.marker) {
                    var dragging_marker = false;

                    // Listen for marker drags
                    (function () {
                        marker.on("dragstart", function(e) {
                            dragging_marker = true;
                        });

                        marker.on("drag", function (e) {
                            scope.$apply(function (s) {
                                s.marker.lat = marker.getLatLng().lat;
                                s.marker.lng = marker.getLatLng().lng;
                            });
                        });

                        marker.on("dragend", function(e) {
                            marker.openPopup();
                            dragging_marker = false;
                        });

                        map.on("click", function(e) {
                            marker.setLatLng(e.latlng);
                            marker.openPopup();
                            scope.$apply(function (s) {
                                s.marker.lat = marker.getLatLng().lat;
                                s.marker.lng = marker.getLatLng().lng;
                            });
                        });

                        scope.$watch("marker.lng", function (newValue, oldValue) {
                            if (dragging_marker) return;
                            marker.setLatLng(new L.LatLng(marker.getLatLng().lat, newValue));
                        });

                        scope.$watch("marker.lat", function (newValue, oldValue) {
                            if (dragging_marker) return;
                            marker.setLatLng(new L.LatLng(newValue, marker.getLatLng().lng));
                        });
                    }());
                }
            });

            if (attrs.multimarkers) {
                var markers_dict = [];
                scope.$watch("multiMarkers", function(newMarkerList) {
                    // find deleted markers
                    for (var mkey in markers_dict) {
                        if (!scope.multiMarkers[mkey]) {
                            map.removeLayer(markers_dict[mkey]);
                        }
                    }
                    // add new markers
                    for (var mkey in scope.multiMarkers) {
                        if (markers_dict[mkey]) {
                            // skip already added marker
                            continue;
                        }
                        (function(mkey) {
                            var mark_dat = scope.multiMarkers[mkey];
                            var marker = new L.marker(
                                scope.multiMarkers[mkey],
                                {
                                    draggable: mark_dat.draggable ? true:false
                                }
                            );

                            marker.on("dragstart", function(e) {
                                dragging_marker = true;
                            });

                            marker.on("drag", function (e) {
                                scope.$apply(function (s) {
                                    mark_dat.lat = marker.getLatLng().lat;
                                    mark_dat.lng = marker.getLatLng().lng;
                                });
                            });

                            marker.on("dragend", function(e) {
                                dragging_marker = false;
                            });

                            scope.$watch('multiMarkers.'+mkey, function() {
                                marker.setLatLng(scope.multiMarkers[mkey]);
                            }, true);

                            map.addLayer(marker);
                            markers_dict[mkey] = marker;
                        })(mkey);
                    } // for mkey in multiMarkers
                }, true); // watch multiMarkers
            } // if attrs.multiMarkers

            if (attrs.mainpath) {
                var mp_polyline = new L.Polyline([], {});
                map.addLayer(mp_polyline);
                scope.$watch("mainPath", function(newMainPath) {
                    mp_polyline.setLatLngs(scope.mainPath.latlngs);
                    mp_polyline.setStyle({
                        smoothFactor: scope.mainPath.smoothFactor,
                        color: scope.mainPath.color
                    });
                }, true);
            } // end of attrs.path
        } // end of link function
    };
});
