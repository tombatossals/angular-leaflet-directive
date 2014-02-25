angular.module("leaflet-directive").directive('center', function ($log, $parse, $location, leafletMapDefaults, leafletHelpers) {
    var isDefined     = leafletHelpers.isDefined,
        isNumber      = leafletHelpers.isNumber,
        equals        = leafletHelpers.equals,
        safeApply     = leafletHelpers.safeApply,
        isValidCenter = leafletHelpers.isValidCenter;

    var updateCenterUrlParams = function(center) {
        if (isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom)) {
            var centerParams = {
                lat: center.lat,
                lng: center.lng,
                zoom: center.zoom
            };
            $location.path("");
            $location.search(centerParams);
        }
    };

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
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

                if (attrs.centerUrlParams === "yes") {
                    leafletScope.$watch(function() {
                        return $location.search();
                    }, function(search) {
                        console.log("center1", search);
                        if (isDefined(search) && isDefined(search.lat) && isDefined(search.lng) && isDefined(search.zoom)) {
                            var actualCenter = { lat: centerModel.lat(), lng: centerModel.lng(), zoom: centerModel.zoom() };
                            if (!equals(search, actualCenter)) {
                                centerModel.lat.assign(search.lat);
                                centerModel.lng.assign(search.lng);
                                centerModel.zoom.assign(search.zoom);
                            }
                        }
                    });
                }

                leafletScope.$watch("center", function(center) {
                    console.log("watch", center.zoom);
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
                    if (attrs.centerUrlParams) {
                        updateCenterUrlParams(center);
                    }
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
                            if (attrs.centerUrlParams) {
                                updateCenterUrlParams(center);
                            }
                        }
                    });
                });

                if (center.autoDiscover === true) {
                    map.on("locationerror", function() {
                        $log.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.");
                        if (isValidCenter(center)) {
                            map.setView([center.lat, center.lng], center.zoom);
                            if (attrs.centerUrlParams) {
                                updateCenterUrlParams(center);
                            }
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                            if (attrs.centerUrlParams) {
                                updateCenterUrlParams(center);
                            }
                        }
                    });
                }
            });
        }
    };
});
