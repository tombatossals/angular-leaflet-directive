angular.module('leaflet-directive').directive('maxbounds', function($log, leafletMapDefaults, leafletBoundsHelpers, leafletHelpers) {

  return {
    restrict: 'A',
    scope: false,
    replace: false,
    require: 'leaflet',

    link: function(scope, element, attrs, controller) {
      var leafletScope  = controller.getLeafletScope();
      var isValidBounds = leafletBoundsHelpers.isValidBounds;
      var isNumber = leafletHelpers.isNumber;

      controller.getMap().then(function(map) {
        leafletScope.$watch('maxbounds', function(maxbounds) {
          if (!isValidBounds(maxbounds)) {
            // Unset any previous maxbounds
            map.setMaxBounds();
            return;
          }

          var leafletBounds = leafletBoundsHelpers.createLeafletBounds(maxbounds);
          if (isNumber(maxbounds.pad)) {
            leafletBounds = leafletBounds.pad(maxbounds.pad);
          }

          map.setMaxBounds(leafletBounds);
          if (!attrs.center && !attrs.lfCenter) {
            map.fitBounds(leafletBounds);
          }
        });
      });
    },
  };
});
