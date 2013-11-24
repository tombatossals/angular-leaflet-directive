angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                isNumber  = leafletHelpers.isNumber,
                createLeafletBounds = leafletHelpers.createLeafletBounds,
                leafletScope = controller.getLeafletScope(),
                safeApply = leafletHelpers.safeApply,
                bounds = leafletScope.bounds;


            controller.getMap().then(function(map) {
                map.whenReady(function() {
                    leafletScope.$watch('bounds', function(bounds) {
                        if (!isDefined(bounds)) {
                            $log.error('[AngularJS - Leaflet] Invalid bounds');
                            return;
                        }

                        var leafletBounds = createLeafletBounds(bounds);
                        if (!map.getBounds().equals(leafletBounds)) {
                            map.fitBounds(leafletBounds);
                        }
                    }, true);
                });
            });
        }
    };
});
