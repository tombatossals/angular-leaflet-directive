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
                    if (angular.isDefined(tiles) && angular.isDefined(tiles.url)) {
                        var tileLayerObj;
                        leafletScope.$watch("tiles", function(tiles, oldTiles) {
                            var tileLayerOptions = defaults.tileLayerOptions;
                            var tileLayerUrl = defaults.tileLayer;
                            if (!isDefined(oldTiles) || !isDefined(tileLayerObj)) {
                                if (angular.isDefined(tiles) && angular.isDefined(tiles.options)) {
                                    angular.copy(tiles.options, tileLayerOptions);
                                }

                                if (angular.isDefined(tiles) && angular.isDefined(tiles.url)) {
                                    tileLayerUrl = tiles.url;
                                }

                                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                                tileLayerObj.addTo(map);
                                leafletData.setTiles(tileLayerObj, attrs.id);
                            } else {
                                if (isDefined(tiles.options) && !angular.equals(tiles.options, tileLayerOptions)) {
                                    map.removeLayer(tileLayerObj);
                                    tileLayerOptions = defaults.tileLayerOptions;
                                    angular.copy(tiles.options, tileLayerOptions);
                                    if (isDefined(tiles.url)) {
                                        tileLayerUrl = tiles.url;
                                    }
                                    tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                                    tileLayerObj.addTo(map);
                                    leafletData.setTiles(tileLayerObj, attrs.id);

                                } else if (angular.isDefined(tiles) && angular.isDefined(tiles.url)) {
                                    tileLayerObj.setUrl(tiles.url);
                                }
                            }
                        }, true);
                    } else {
                        $log.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.");
                    }

                });
            });
        }
    };
});
