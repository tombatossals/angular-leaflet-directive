angular.module("leaflet-directive").factory('leafletLegendHelpers', function () {
	var _updateLegend = function(div, legendData, type, url) {
		div.innerHTML = '';
		if(legendData.error) {
			div.innerHTML += '<div class="info-title alert alert-danger">' + legendData.error.message + '</div>';
		} else {
			if (type === 'arcgis') {
				for (var i = 0; i < legendData.layers.length; i++) {
					var layer = legendData.layers[i];
					div.innerHTML += '<div class="info-title" data-layerid="' + layer.layerId + '">' + layer.layerName + '</div>';
					for(var j = 0; j < layer.legend.length; j++) {
						var leg = layer.legend[j];
						div.innerHTML +=
							'<div class="inline" data-layerid="' + layer.layerId + '"><img src="data:' + leg.contentType + ';base64,' + leg.imageData + '" /></div>' +
							'<div class="info-label" data-layerid="' + layer.layerId + '">' + leg.label + '</div>';
					}
				}
			}
			else if (type === 'image') {
				div.innerHTML = '<img src="' + url + '"/>';
			}
		}
	};

	var _getOnAddLegend = function(legendData, legendClass, type, url) {
		return function(/*map*/) {
			var div = L.DomUtil.create('div', legendClass);

			if (!L.Browser.touch) {
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
			} else {
				L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
			}
			_updateLegend(div, legendData, type, url);
			return div;
		};
	};

	var _getOnAddArrayLegend = function(legend, legendClass) {
		return function(/*map*/) {
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
	};

	return {
		getOnAddLegend: _getOnAddLegend,
		getOnAddArrayLegend: _getOnAddArrayLegend,
		updateLegend: _updateLegend
	};
});
