angular.module("leaflet-directive").directive('tiles', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var tiles = $scope.tiles;

            setupTiles(map, tiles, defaults);

            function setupTiles(map, tiles, defaults) {
                var tileLayerObj;
                var tileLayerUrl = defaults.tileLayer;
                var tileLayerOptions = defaults.tileLayerOptions;

                if (angular.isDefined(tiles.url)) {
                    tileLayerUrl = tiles.url;
                }

                if (angular.isDefined(tiles.options)) {
                    angular.copy(tiles.options, tileLayerOptions);
                }

                $scope.$watch("tiles.url", function(url) {
                    if (!angular.isDefined(url)) {
                        return;
                    }
                    tileLayerObj.setUrl(url);
                });

                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
            }
        }
    };
});
