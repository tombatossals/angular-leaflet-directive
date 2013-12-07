angular.module("leaflet-directive").directive('bounds', function ($log, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                createLeafletBounds = leafletHelpers.createLeafletBounds,
                leafletScope = controller.getLeafletScope();

            controller.getMap().then(function(map) {

                function updateBoundsInScope() {
                    if(!leafletScope.bounds) { return; }

                    var bounds = map.getBounds();
                    leafletScope.bounds = {
                        northEast: {
                            lat: bounds.getNorthEast().lat,
                            lng: bounds.getNorthEast().lng
                        },
                        southWest: {
                            lat: bounds.getSouthWest().lat,
                            lng: bounds.getSouthWest().lng
                        }
                    };
                }

                function boundsListener(newBounds) {
                    if (!isDefined(newBounds)) {
                        $log.error('[AngularJS - Leaflet] Invalid bounds');
                        return;
                    }

                    var leafletBounds = createLeafletBounds(newBounds);
                    if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                        map.fitBounds(leafletBounds);
                    }
                }

                map.on('moveend', updateBoundsInScope);
                map.on('dragend', updateBoundsInScope);
                map.on('zoomend', updateBoundsInScope);

                map.whenReady(function() {
                    leafletScope.$watch('bounds', boundsListener, true);
                });
            });
        }
    };
});
