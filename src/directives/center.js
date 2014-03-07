angular.module("leaflet-directive").directive('center', function ($log, $parse, $location, leafletMapDefaults, leafletHelpers) {
    var isDefined     = leafletHelpers.isDefined,
        isNumber      = leafletHelpers.isNumber,
        equals        = leafletHelpers.equals,
        safeApply     = leafletHelpers.safeApply,
        isValidCenter = leafletHelpers.isValidCenter;

    var updateCenterUrlParams = function(center) {
        if (isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom)) {
            var centerParams = {
                c: center.lat + ":" + center.lng + ":" + center.zoom
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

                var changingCenterFromModel = false;
                var changingCenterFromUrl = false;
                var initialCenterParamsFromURL;

                if (attrs.urlHashCenter === "yes") {
                    var extractCenter = function(params) {
                        var centerParam;
                        if (isDefined(params.c)) {
                            var cParam = params.c.split(":");
                            if (cParam.length === 3) {
                                centerParam = { lat: parseFloat(cParam[0]), lng: parseFloat(cParam[1]), zoom: parseInt(cParam[2], 10) };
                            }
                        }
                        return centerParam;
                    };

                    var search = $location.search();
                    initialCenterParamsFromURL = extractCenter(search);
                    leafletScope.$on('$locationChangeSuccess', function() {
                        var search = $location.search();
                        changingCenterFromUrl = true;
                        if (isDefined(search.c)) {
                            var urlParams = search.c.split(":");
                            if (urlParams.length === 3) {
                                var urlCenter = { lat: parseFloat(urlParams[0]), lng: parseFloat(urlParams[1]), zoom: parseInt(urlParams[2], 10) };
                                var actualCenter = { lat: leafletScope.center.lat, lng: leafletScope.center.lng, zoom: leafletScope.center.zoom };
                                if (urlCenter && !equals(urlCenter, actualCenter)) {
                                    leafletScope.center = { lat: urlCenter.lat, lng: urlCenter.lng, zoom: urlCenter.zoom };
                                }
                            }
                        }
                        changingCenterFromUrl = false;
                    });
                }

                leafletScope.$watch("center", function(center) {
                    if (changingCenterFromUrl) {
                        return;
                    }

                    // The center from the URL has priority
                    if (attrs.urlHashCenter === "yes" && isDefined(initialCenterParamsFromURL)) {
                        angular.copy(initialCenterParamsFromURL, center);
                        initialCenterParamsFromURL = undefined;
                    }

                    if (!isValidCenter(center) && center.autoDiscover !== true) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        return;
                    }

                    changingCenterFromModel = true;
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
                    if (attrs.urlHashCenter) {
                        updateCenterUrlParams(center);
                    }
                    changingCenterFromModel = false;
                }, true);

                map.on("moveend", function(/* event */) {
                    if (changingCenterFromModel || changingCenterFromUrl) {
                        return;
                    }

                    safeApply(leafletScope, function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                            centerModel.autoDiscover.assign(scope, false);
                            if (attrs.urlHashCenter) {
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
                            if (attrs.urlHashCenter) {
                                updateCenterUrlParams(center);
                            }
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                            if (attrs.urlHashCenter) {
                                updateCenterUrlParams(center);
                            }
                        }
                    });
                }
            });
        }
    };
});
