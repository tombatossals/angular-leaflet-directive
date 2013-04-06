/**!
 * The MIT License
 * 
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * angular-leaflet-directive
 * https://github.com/tombatossals/angular-leaflet-directive
 * 
 * @author David Rubert https://plus.google.com/100184619238119414805
 */

(function () {
	
	var leafletModule = angular.module("leaflet", []);

	leafletModule.directive("leaflet", function ($http, $log) {
		return {
			restrict: "EC",
			replace: true,
			transclude: true,
			scope: {
				center: "=center",
				marker: "=marker",
				message: "=message",
				zoom: "=zoom"
			},
			templateUrl: "/pln/templates/joinmap.html",
			link: function (scope, element, attrs, ctrl) {

                if (!attrs.marker) {
                    element.find(".locate").remove();
                }

                if (attrs.nodes) {
                    element.find(".map").addClass("large");
                }

                var $el = element.find(".map")[0],
				    map = new L.Map($el);

			    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12 }).addTo(map);

                scope.$watch("center", function(center) {
                    if (center === undefined) return;

                    // Center of the map
                    center = new L.LatLng(scope.center.lat, scope.center.lng);
                    var zoom = scope.zoom || 8;
                    map.setView(center, zoom);

                    var marker = new L.marker(scope.center, { draggable: attrs.markcenter ? false:true });
			        if (attrs.markcenter || attrs.marker) {
                        map.addLayer(marker);

                        if (scope.message) {
                            marker.bindPopup("<strong>" + scope.message + "</strong>", { closeButton: false });
                            marker.openPopup();
                        }
                        if (attrs.marker) {
                            scope.marker.lat = marker.getLatLng().lat;
                            scope.marker.lng = marker.getLatLng().lng;
                        }
		            }

                    if (attrs.marker) {   

                        var dragging = false;

		                // Listen for drags
			            (function () {						

                            marker.on("dragstart", function(e) {
                                dragging = true;
                            });

				            marker.on("drag", function (e) {
					            scope.$apply(function (s) {
						            s.marker.lat = marker.getLatLng().lat;
						            s.marker.lng = marker.getLatLng().lng;
					            });
				            });

                            marker.on("dragend", function(e) {
                                marker.openPopup();
                                dragging = false;
                            });

                            map.on("click", function(e) {
                                marker.setLatLng(e.latlng);
                                marker.openPopup();
					            scope.$apply(function (s) {
						            s.marker.lat = marker.getLatLng().lat;
						            s.marker.lng = marker.getLatLng().lng;
					            });
                            });

                            scope.$watch("zoom", function (newValue, oldValue) {
                                map.setZoom(newValue);
                            });

                            scope.$watch("marker.lng", function (newValue, oldValue) {
                                if (dragging) return;
                                marker.setLatLng(new L.LatLng(marker.getLatLng().lat, newValue));
                            });

                            scope.$watch("marker.lat", function (newValue, oldValue) {
                                if (dragging) return;
                                marker.setLatLng(new L.LatLng(newValue, marker.getLatLng().lng));
                            });

			            }());

                        // Listen for drag
		                map.on("zoomend", function (e) {
			                scope.zoom = map.getZoom();
			                scope.$apply();
		                });
		            }				

                    scope.locate = function() {
                        map.locate({ setView: true });
                        map.on("locationfound", function(data) {
                            marker.setLatLng(data.latlng);
					        scope.$apply(function (s) {
                                s.marker.lat = data.latlng.lat;
                                s.marker.lng = data.latlng.lng;
                            });
                        });
                    };

                });

                if (attrs.nodes) {
                    var markers = new L.MarkerClusterGroup();
                    $http.get(attrs.nodes).success(function(data) {
                        for (var index in data) {
                            var node  = data[index];
                            var title = '<p><strong>' + node.name + '</strong></p><p><a href="/pln/link">Link to this node</a></p>';
                            var marker = new L.Marker(new L.LatLng(node.lat, node.lng), {
                                title: title
                            });
                            marker.bindPopup(title);
                            markers.addLayer(marker);
                        }
                        map.addLayer(markers);
                    });
                }
            }
		};
	});
	
}());
