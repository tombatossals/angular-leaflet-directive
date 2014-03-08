angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                createLeafletBounds = leafletBoundsHelpers.createLeafletBounds,
                leafletScope = controller.getLeafletScope();

            controller.getMap().then(function(map) {
                map.whenReady(function() {
                    leafletScope.$watch('bounds', function(newBounds) {
                        if (!isDefined(newBounds)) {
                            $log.error('[AngularJS - Leaflet] Invalid bounds');
                            return;
                        }

                        var leafletBounds = createLeafletBounds(newBounds);
                        if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                            map.fitBounds(leafletBounds);
                        }
                    }, true);
                });
            });
        }
    };
});
