angular.module("leaflet-directive").directive('center', function ($log, $parse, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined     = leafletHelpers.isDefined,
                safeApply     = leafletHelpers.safeApply,
                isValidCenter = leafletHelpers.isValidCenter,
                leafletScope  = controller.getLeafletScope(),
                center        = leafletScope.center;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);
                if (isDefined(center)) {
                    if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: defaults.maxZoom });
                    }

                    var centerModel = {
                        lat:  $parse("center.lat"),
                        lng:  $parse("center.lng"),
                        zoom: $parse("center.zoom")
                    };
                } else {
                    $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                }

                var movingMap = false;

                leafletScope.$watch("center", function(center) {
                    if (!isValidCenter(center)) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        return;
                    }
                    if (movingMap) {
                        // Can't update. The map is moving.
                        return;
                    }
                    map.setView([center.lat, center.lng], center.zoom);
                }, true);

                map.on("movestart", function(/* event */) {
                    movingMap = true;
                });

                map.on("moveend", function(/* event */) {
                    movingMap = false;
                    safeApply(leafletScope, function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                        }
                    });
                });
            });
        }
    };
});
