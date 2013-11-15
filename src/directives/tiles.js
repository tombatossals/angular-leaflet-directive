angular.module("leaflet-directive").directive('tiles', function ($log, leafletData, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                tiles = leafletScope.tiles;

            controller.getMap().then(function(map) {
                leafletMapDefaults.getDefaults(attrs.id).then(function(defaults) {

                    var tileLayerObj;
                    var tileLayerUrl = defaults.tileLayer;
                    var tileLayerOptions = defaults.tileLayerOptions;

                    if (angular.isDefined(tiles) && angular.isDefined(tiles.url)) {
                        tileLayerUrl = tiles.url;
                        leafletScope.$watch("tiles.url", function(url) {
                            if (angular.isDefined(url)) {
                                tileLayerObj.setUrl(url);
                            }
                        });
                    } else {
                        $log.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.");
                    }

                    if (angular.isDefined(tiles) && angular.isDefined(tiles.options)) {
                        angular.copy(tiles.options, tileLayerOptions);
                    }

                    tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                    tileLayerObj.addTo(map);
                    leafletData.setTiles(tileLayerObj, attrs.id);
                });
            });
        }
    };
});
