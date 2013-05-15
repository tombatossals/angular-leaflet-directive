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
                    if(center.lat && center.lng && center.zoom){
                        map.setView([center.lat, center.lng], center.zoom);
                    }
                }, true);
            }

            if (attrs.markers && scope.markers) {
                var markers = {};

                var createAndLinkMarker = function(key, scope) {
                    var data = scope.markers[key];
                    var marker = new L.marker(
                        scope.markers[key],
                        {
                            draggable: data.draggable ? true:false
                        }
                    );

                    marker.on("dragend", function(e) {
                        scope.$apply(function (s) {
                            data.lat = marker.getLatLng().lat;
                            data.lng = marker.getLatLng().lng;
                            if (data.message) {
                                marker.openPopup();
                            }
                        });
                    });

                    scope.$watch('markers.' + key, function(newval, oldval) {
                        if (!newval) {
                            map.removeLayer(markers[key]);
                            delete markers[key];
                            return;
                        }

                        if (newval.draggable !== undefined && newval.draggable !== oldval.draggable) {
                            newval.draggable ?  marker.dragging.enable() : marker.dragging.disable();
                        }

                        if (newval.focus !== undefined && newval.focus !== oldval.focus) {
                            newval.focus ?  marker.openPopup() : marker.closePopup();
                        }

                        if (newval.message !== undefined && newval.message !== oldval.message) {
                            marker.bindPopup(newval);
                        }

                        if (newval.lat !== oldval.lat || newval.lng !== oldval.lng) {
                            marker.setLatLng(new L.LatLng(newval.lat, newval.lng));
                        }
                    }, true);

                    return marker;
                }; // end of create and link marker

                scope.$watch("markers", function(newMarkerList) {
                    // add new markers
                    for (var key in scope.markers) {
                        if (markers[key] === undefined) {
                            var marker = createAndLinkMarker(key, scope);
                            map.addLayer(marker);
                            markers[key] = marker;
                        }
                    }
                }, true);
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
