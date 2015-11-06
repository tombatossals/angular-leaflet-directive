angular.module('leaflet-directive').directive('legend', function($log, $http, leafletHelpers, leafletLegendHelpers) {

  return {
    restrict: 'A',
    scope: false,
    replace: false,
    require: 'leaflet',

    link: function(scope, element, attrs, controller) {

      var isArray = leafletHelpers.isArray;
      var isDefined = leafletHelpers.isDefined;
      var isFunction = leafletHelpers.isFunction;
      var leafletScope = controller.getLeafletScope();
      var legend = leafletScope.legend;

      var legendClass;
      var position;
      var leafletLegend;
      var type;

      leafletScope.$watch('legend', function(newLegend) {

        if (isDefined(newLegend)) {

          legendClass = newLegend.legendClass ? newLegend.legendClass : 'legend';

          position = newLegend.position || 'bottomright';

          // default to arcgis
          type = newLegend.type || 'arcgis';
        }

      }, true);

      controller.getMap().then(function(map) {

        leafletScope.$watch('legend', function(newLegend) {

          if (!isDefined(newLegend)) {

            if (isDefined(leafletLegend)) {
              leafletLegend.removeFrom(map);
              leafletLegend = null;
            }

            return;
          }

          if (!isDefined(newLegend.url) && (type === 'arcgis') && (!isArray(newLegend.colors) || !isArray(newLegend.labels) || newLegend.colors.length !== newLegend.labels.length)) {

            $log.warn('[AngularJS - Leaflet] legend.colors and legend.labels must be set.');

            return;
          }

          if (isDefined(newLegend.url)) {

            $log.info('[AngularJS - Leaflet] loading legend service.');

            return;
          }

          if (isDefined(leafletLegend)) {
            leafletLegend.removeFrom(map);
            leafletLegend = null;
          }

          leafletLegend = L.control({
            position: position,
          });
          if (type === 'arcgis') {
            leafletLegend.onAdd = leafletLegendHelpers.getOnAddArrayLegend(newLegend, legendClass);
          }

          leafletLegend.addTo(map);

        });

        leafletScope.$watch('legend.url', function(newURL) {

          if (!isDefined(newURL)) {
            return;
          }

          $http.get(newURL)
                            .success(function(legendData) {

                              if (isDefined(leafletLegend)) {

                                leafletLegendHelpers.updateLegend(leafletLegend.getContainer(), legendData, type, newURL);

                              } else {

                                leafletLegend = L.control({
                                  position: position,
                                });
                                leafletLegend.onAdd = leafletLegendHelpers.getOnAddLegend(legendData, legendClass, type, newURL);
                                leafletLegend.addTo(map);
                              }

                              if (isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
                                legend.loadedData();
                              }
                            })
                            .error(function() {
                              $log.warn('[AngularJS - Leaflet] legend.url not loaded.');
                            });
        });

      });
    },
  };
});
