angular.module('leaflet-directive').directive('decorations', function($log, leafletHelpers) {

  return {
    restrict: 'A',
    scope: false,
    replace: false,
    require: 'leaflet',

    link: function(scope, element, attrs, controller) {
      var leafletScope = controller.getLeafletScope();
      var PolylineDecoratorPlugin = leafletHelpers.PolylineDecoratorPlugin;
      var isDefined = leafletHelpers.isDefined;
      var leafletDecorations = {};

      /* Creates an "empty" decoration with a set of coordinates, but no pattern. */
      function createDecoration(options) {
        if (isDefined(options) && isDefined(options.coordinates)) {
          if (!PolylineDecoratorPlugin.isLoaded()) {
            $log.error('[AngularJS - Leaflet] The PolylineDecorator Plugin is not loaded.');
          }
        }

        return L.polylineDecorator(options.coordinates);
      }

      /* Updates the path and the patterns for the provided decoration, and returns the decoration. */
      function setDecorationOptions(decoration, options) {
        if (isDefined(decoration) && isDefined(options)) {
          if (isDefined(options.coordinates) && isDefined(options.patterns)) {
            decoration.setPaths(options.coordinates);
            decoration.setPatterns(options.patterns);
            return decoration;
          }
        }
      }

      controller.getMap().then(function(map) {
        leafletScope.$watch('decorations', function(newDecorations) {
          for (var name in leafletDecorations) {
            if (!isDefined(newDecorations[name]) || !angular.equals(newDecorations[name], leafletDecorations)) {
              map.removeLayer(leafletDecorations[name]);
              delete leafletDecorations[name];
            }
          }

          for (var newName in newDecorations) {
            var decorationData = newDecorations[newName];
            var newDecoration = createDecoration(decorationData);

            if (isDefined(newDecoration)) {
              leafletDecorations[newName] = newDecoration;
              map.addLayer(newDecoration);
              setDecorationOptions(newDecoration, decorationData);
            }
          }
        }, true);
      });
    },
  };
});
