angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: [ 'leaflet', 'center' ],

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                createLeafletBounds = leafletBoundsHelpers.createLeafletBounds,
                leafletScope = controller[0].getLeafletScope(),
                mapController = controller[0],
                centerController = controller[1];

            mapController.getMap().then(function(map) {
                centerController.getCenter().then(function() {
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
            });
        }
    };
});
