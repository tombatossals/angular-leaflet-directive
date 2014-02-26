angular.module("leaflet-directive").directive('legend', function ($log, $http, leafletHelpers, leafletLegendHelpers) {
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
            var leafletLegend;
            
            controller.getMap().then(function(map) {
				if (!isDefined(legend.url) && (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length)) {
                    $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                } else if(isDefined(legend.url)){
                    $log.info("[AngularJS - Leaflet] loading arcgis legend service.");
                } else {
					// TODO: Watch array legend.
					leafletLegend = L.control({ position: position });
                    leafletLegend.onAdd = leafletLegendHelpers.getOnAddArrayLegend(legend, legendClass);
                    leafletLegend.addTo(map);
                }
                
                leafletScope.$watch('legend.url', function(newURL) {
					if(!isDefined(newURL)) {
						return;
					}
					$http.get(newURL)
						.success(function(legendData) {
							if(isDefined(leafletLegend)) {
								leafletLegendHelpers.updateArcGISLegend(leafletLegend.getContainer(),legendData);
							} else {
								leafletLegend = L.control({ position: position });
								leafletLegend.onAdd = leafletLegendHelpers.getOnAddArcGISLegend(legendData, legendClass);
								leafletLegend.addTo(map);
							}
							if(isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
								legend.loadedData();
							}
						})
						.error(function() {
							$log.warn('[AngularJS - Leaflet] legend.url not loaded.');
						});
                });
            });
        }
    };
});
