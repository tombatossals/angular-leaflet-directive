angular.module("leaflet-directive").directive('legend', function ($log, $http, leafletHelpers, leafletLegendHelpers) {
        return {
            restrict: "A",
            scope: false,
            replace: false,
            require: 'leaflet',

            link: function (scope, element, attrs, controller) {

                var isArray = leafletHelpers.isArray,
                    isDefined = leafletHelpers.isDefined,
                    isFunction = leafletHelpers.isFunction,
                    leafletScope = controller.getLeafletScope(),
                    legend = leafletScope.legend;

                var legendClass;
                var position;
                var leafletLegend;

                leafletScope.$watch('legend', function (newLegend) {

                    if (isDefined(newLegend)) {

                        legendClass = newLegend.legendClass ? newLegend.legendClass : "legend";

                        position = newLegend.position || 'bottomright';
                    }

                }, true);

                controller.getMap().then(function (map) {

                    leafletScope.$watch('legend', function (newLegend) {

                        if (!isDefined(newLegend)) {

                            if (isDefined(leafletLegend)) {
                                leafletLegend.removeFrom(map);
                                leafletLegend= null;
                            }

                            return;
                        }

                        if (!isDefined(newLegend.url) && (!isArray(newLegend.colors) || !isArray(newLegend.labels) || newLegend.colors.length !== newLegend.labels.length)) {

                            $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");

                            return;
                        }

                        if (isDefined(newLegend.url)) {

                            $log.info("[AngularJS - Leaflet] loading arcgis legend service.");

                            return;
                        }

                        if (isDefined(leafletLegend)) {
                            leafletLegend.removeFrom(map);
                            leafletLegend= null;
                        }

                        leafletLegend = L.control({
                            position: position
                        });
                        leafletLegend.onAdd = leafletLegendHelpers.getOnAddArrayLegend(newLegend, legendClass);
                        leafletLegend.addTo(map);

                    });

                    leafletScope.$watch('legend.url', function (newURL) {

                        if (!isDefined(newURL)) {
                            return;
                        }

                        $http.get(newURL)
                            .success(function (legendData) {

                                if (isDefined(leafletLegend)) {

                                    leafletLegendHelpers.updateArcGISLegend(leafletLegend.getContainer(), legendData);

                                } else {

                                    leafletLegend = L.control({
                                        position: position
                                    });
                                    leafletLegend.onAdd = leafletLegendHelpers.getOnAddArcGISLegend(legendData, legendClass);
                                    leafletLegend.addTo(map);
                                }

                                if (isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
                                    legend.loadedData();
                                }
                            })
                            .error(function () {
                                $log.warn('[AngularJS - Leaflet] legend.url not loaded.');
                            });
                    });

                });
            }
        };
    });
