var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", ["$http", "$log", function ($http, $log) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: "=center",
            tilelayer: "=tilelayer",
            markers: "=markers",
            path: "=path",
            maxZoom: "@maxzoom"
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function (scope, element, attrs, ctrl) {
            var $el = element[0],
                map = new L.Map($el);

            // Expose the map object, for testing purposes
            if (attrs.map) {
                scope.map = map;
            }

            // Set maxZoom from attrs
            if (attrs.maxzoom){
                scope.maxZoom = parseInt(attrs.maxzoom)
            }

            // Set initial view
            map.setView([0, 0], 1);

            // Set tile layer
            var tilelayer = scope.tilelayer || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var maxZoom = scope.maxZoom || 12;
            L.tileLayer(tilelayer, { maxZoom: maxZoom }).addTo(map);

            // Manage map center events
            if (attrs.center && scope.center) {

                if (scope.center.lat && scope.center.lng && scope.center.zoom) {
                    map.setView(new L.LatLng(scope.center.lat, scope.center.lng), scope.center.zoom);
                } else if (scope.center.autoDiscover === true) {
                    map.locate({ setView: true, maxZoom: maxZoom });
                }

                map.on("dragend", function(e) {
                    scope.$apply(function (s) {
                        s.center.lat = map.getCenter().lat;
                        s.center.lng = map.getCenter().lng;
                    });
                });

                map.on("zoomend", function(e) {
                    scope.$apply(function (s) {
                        s.center.zoom = map.getZoom();
                    });
                });

                scope.$watch("center", function (center, oldValue) {
                    map.setView([center.lat, center.lng], center.zoom);
                }, true);
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

                    scope.$watch("markers." + mkey + ".draggable", function (newValue, oldValue) {
                        if (newValue === false) {
                            marker.dragging.disable();
                        } else if (newValue === true) {
                            marker.dragging.enable();
                        }
                    });

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
                    return marker;
                }; // end of create and link marker

                scope.$watch("markers", function(newMarkerList) {
                    // find deleted markers
                    for (var delkey in markers_dict) {
                        if (!scope.markers[delkey]) {
                            map.removeLayer(markers_dict[delkey]);
                            delete markers_dict[delkey];
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
                var polyline = new L.Polyline([], { weight: 10, opacity: 1});
                map.addLayer(polyline);
                scope.$watch("path.latlngs", function(latlngs) {
                    for (var idx=0, length=latlngs.length; idx < length; idx++) {
                        if (latlngs[idx] === undefined || latlngs[idx].lat === undefined || latlngs[idx].lng === undefined) {
                            $log.warn("Bad path point inn the $scope.path array ");
                            latlngs.splice(idx, 1);
                        }
                    }
                    polyline.setLatLngs(latlngs);
                }, true);

                scope.$watch("path.weight", function(weight) {
                    polyline.setStyle({
                        weight: weight
                    });
                }, true);

                scope.$watch("path.color", function(color) {
                    polyline.setStyle({
                        color: color
                    });
                }, true);
            } // end of attrs.path
        } // end of link function
    };
}]);
