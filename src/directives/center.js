angular.module("leaflet-directive").directive('center', function ($log, $parse, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined     = leafletHelpers.isDefined,
                isNumber      = leafletHelpers.isNumber,
                safeApply     = leafletHelpers.safeApply,
                isValidCenter = leafletHelpers.isValidCenter,
                leafletScope  = controller.getLeafletScope(),
                center        = leafletScope.center;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);

                if (!isDefined(center)) {
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                }

                var centerModel = {
                    lat:  $parse("center.lat"),
                    lng:  $parse("center.lng"),
                    zoom: $parse("center.zoom"),
                    autoDiscover: $parse("center.autoDiscover")
                };

                var changingModel = false;

                leafletScope.$watch("center", function(center) {
                    changingModel = true;
                    if (!isValidCenter(center) && center.autoDiscover !== true) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        return;
                    }
                    if (center.autoDiscover === true) {
                        if (!isNumber(center.zoom)) {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        }
                        if (isNumber(center.zoom) && center.zoom > defaults.center.zoom) {
                            map.locate({ setView: true, maxZoom: center.zoom });
                        } else if (isDefined(defaults.maxZoom)) {
                            map.locate({ setView: true, maxZoom: defaults.maxZoom });
                        } else {
                            map.locate({ setView: true });
                        }
                        return;
                    }

                    map.setView([center.lat, center.lng], center.zoom);
                    changingModel = false;
                }, true);

                map.on("moveend", function(/* event */) {
                    if (changingModel) {
                        return;
                    }

                    safeApply(leafletScope, function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                            centerModel.autoDiscover.assign(scope, false);
                        }
                    });
                });

                if (center.autoDiscover === true) {
                    map.on("locationerror", function() {
                        $log.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.");
                        if (isValidCenter(center)) {
                            map.setView([center.lat, center.lng], center.zoom);
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        }
                    });
                }
            });
        }
    };
});
