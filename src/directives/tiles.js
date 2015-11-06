angular.module('leaflet-directive').directive('tiles', function($log, leafletData, leafletMapDefaults, leafletHelpers) {

  return {
    restrict: 'A',
    scope: false,
    replace: false,
    require: 'leaflet',

    link: function(scope, element, attrs, controller) {
      var isDefined = leafletHelpers.isDefined;
      var leafletScope  = controller.getLeafletScope();
      var tiles = leafletScope.tiles;

      if (!isDefined(tiles) ||  !isDefined(tiles.url)) {
        $log.warn('[AngularJS - Leaflet] The \'tiles\' definition doesn\'t have the \'url\' property.');
        return;
      }

      controller.getMap().then(function(map) {
        var defaults = leafletMapDefaults.getDefaults(attrs.id);
        var tileLayerObj;
        leafletScope.$watch('tiles', function(tiles, oldtiles) {
          var tileLayerOptions = defaults.tileLayerOptions;
          var tileLayerUrl = defaults.tileLayer;

          // If no valid tiles are in the scope, remove the last layer
          if (!isDefined(tiles.url) && isDefined(tileLayerObj)) {
            map.removeLayer(tileLayerObj);
            return;
          }

          // No leafletTiles object defined yet
          if (!isDefined(tileLayerObj)) {
            if (isDefined(tiles.options)) {
              angular.copy(tiles.options, tileLayerOptions);
            }

            if (isDefined(tiles.url)) {
              tileLayerUrl = tiles.url;
            }

            if (tiles.type === 'wms') {
              tileLayerObj = L.tileLayer.wms(tileLayerUrl, tileLayerOptions);
            } else {
              tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
            }

            tileLayerObj.addTo(map);
            leafletData.setTiles(tileLayerObj, attrs.id);
            return;
          }

          // If the options of the tilelayer is changed, we need to redraw the layer
          if (isDefined(tiles.url) && isDefined(tiles.options) &&
              (tiles.type !== oldtiles.type || !angular.equals(tiles.options, tileLayerOptions))) {
            map.removeLayer(tileLayerObj);
            tileLayerOptions = defaults.tileLayerOptions;
            angular.copy(tiles.options, tileLayerOptions);
            tileLayerUrl = tiles.url;

            if (tiles.type === 'wms') {
              tileLayerObj = L.tileLayer.wms(tileLayerUrl, tileLayerOptions);
            } else {
              tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
            }

            tileLayerObj.addTo(map);
            leafletData.setTiles(tileLayerObj, attrs.id);
            return;
          }

          // Only the URL of the layer is changed, update the tiles object
          if (isDefined(tiles.url)) {
            tileLayerObj.setUrl(tiles.url);
          }
        }, true);
      });
    },
  };
});
