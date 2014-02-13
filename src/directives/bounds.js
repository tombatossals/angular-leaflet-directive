angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                createLeafletBounds = leafletBoundsHelpers.createLeafletBounds,
                updateBoundsInScope = leafletBoundsHelpers.updateBoundsInScope,
                leafletScope = controller.getLeafletScope();

            controller.getMap().then(function(map) {
                var initializing = true;

                map.whenReady(function() {
                    leafletScope.$watch('bounds', function(newBounds) {
                        if (!isDefined(newBounds)) {
                            $log.error('[AngularJS - Leaflet] Invalid bounds');
                            return;
                        }

                        initializing = false;
                        var leafletBounds = createLeafletBounds(newBounds);
                        if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                            map.fitBounds(leafletBounds);
                        }
                    }, true);

                    map.on('moveend dragend zoomend', function() {
                        if (!initializing) {
                            updateBoundsInScope(leafletScope, map);
                        }
                    });
                });

            });
        }
    };
});
