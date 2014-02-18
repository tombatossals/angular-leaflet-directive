angular.module("leaflet-directive").directive('legend', function ($log, $http, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isArray      = leafletHelpers.isArray,
				isDefined = leafletHelpers.isDefined,
				isFunction = leafletHelpers.isFunction,
                leafletScope = controller.getLeafletScope(),
                legend       = leafletScope.legend;

            var legendClass = legend.legendClass ? legend.legendClass : "legend";
            var position = legend.position || 'bottomright';
            var leafletLegend = L.control({ position: position });
            
            controller.getMap().then(function(map) {
				if(isDefined(legend.url)) {
					$http.get(legend.url)
						.success(function(legendData) {
							leafletLegend.onAdd = function (/*map*/) {
								var div = L.DomUtil.create('div', legendClass);
								if (!L.Browser.touch) {
									L.DomEvent.disableClickPropagation(div);
									L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
								} else {
									L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
								}
								if(legendData.error) {
									div.innerHTML += '<div class="info-title alert alert-danger">' + legendData.error.message + '</div>';
								} else {
									for (var i = 0; i < legendData.layers.length; i++) {
										var layer = legendData.layers[i];
										div.innerHTML += '<div class="info-title">' + layer.layerName + '</div>';
										for(var j = 0; j < layer.legend.length; j++) {
											var leg = layer.legend[j];
											div.innerHTML +=
												'<div class="inline"><img src="data:' + leg.contentType + ';base64,' + leg.imageData + '" /></div>' +
												'<div class="info-label">' + leg.label + '</div>';
										}
									}
								}
								return div;
							};
		                    leafletLegend.addTo(map);
							if(isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
								legend.loadedData();
							}
						})
						.error(function() {
							$log.warn('[AngularJS - Leaflet] legend.url not loaded.');
						});
				} else if (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length) {
                    $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                } else {
                    leafletLegend.onAdd = function (/*map*/) {
                        var div = L.DomUtil.create('div', legendClass);
                        for (var i = 0; i < legend.colors.length; i++) {
                            div.innerHTML +=
                                '<div class="outline"><i style="background:' + legend.colors[i] + '"></i></div>' +
                                '<div class="info-label">' + legend.labels[i] + '</div>';
                        }
                        if (!L.Browser.touch) {
							L.DomEvent.disableClickPropagation(div);
							L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
						} else {
							L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
						}
                        return div;
                    };
                    leafletLegend.addTo(map);
                }
            });
        }
    };
});
