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

                    var mapBounds = map.getBounds();
                    var newScopeBounds = {
                        northEast: {
                            lat: mapBounds.getNorthEast().lat,
                            lng: mapBounds.getNorthEast().lng
                        },
                        southWest: {
                            lat: mapBounds.getSouthWest().lat,
                            lng: mapBounds.getSouthWest().lng
                        }
                    };

                    if(!angular.equals(leafletScope.bounds, newScopeBounds)) {
                        leafletScope.bounds = newScopeBounds;
                    }
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
