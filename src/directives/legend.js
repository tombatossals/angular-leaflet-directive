angular.module("leaflet-directive").directive('legend', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var legend = $scope.legend;

            setupLegend(map, legend, defaults);

            function setupLegend(map, legend, defaults) {
                if (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length) {
                     $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                } else {
                    var legendClass = legend.legendClass ? legend.legendClass : "legend";
                    var position = legend.position || 'bottomright';
                    var leafletLegend = L.control({ position: position });
                    leafletLegend.onAdd = function (map) {
                        var div = L.DomUtil.create('div', legendClass);
                        for (var i = 0; i < legend.colors.length; i++) {
                            div.innerHTML +=
                                '<div><i style="background:' + legend.colors[i] + '"></i>' + legend.labels[i] + '</div>';
                        }
                        return div;
                    };
                    leafletLegend.addTo(map);
                }
            }
        }
    };
});
