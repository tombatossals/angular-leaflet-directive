angular.module("leaflet-directive").directive('center',
    function ($log, $q, $location, leafletMapDefaults, leafletHelpers) {

    var isDefined     = leafletHelpers.isDefined,
        isNumber      = leafletHelpers.isNumber,
        isSameCenterOnMap = leafletHelpers.isSameCenterOnMap,
        safeApply     = leafletHelpers.safeApply,
        isValidCenter = leafletHelpers.isValidCenter;

    var notifyCenterChangedToBounds = function(scope) {
        scope.$broadcast("boundsChanged");
    };

    var notifyCenterUrlHashChanged = function(scope, map, attrs) {
        if (!isDefined(attrs.urlHashCenter)) {
            return;
        }
        var center = map.getCenter();
        var centerUrlHash = (center.lat).toFixed(4) + ":" + (center.lng).toFixed(4) + ":" + map.getZoom();
        var search = $location.search();
        if (!isDefined(search.c) || search.c !== centerUrlHash) {
            //$log.debug("notified new center...");
            scope.$emit("centerUrlHash", centerUrlHash);
        }
    };

    var _leafletCenter;
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function () {
            _leafletCenter = $q.defer();
            this.getCenter = function() {
                return _leafletCenter.promise;
            };
        },
        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
                centerModel   = leafletScope.center;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);

                if (attrs.center.search("-") !== -1) {
                    $log.error('The "center" variable can\'t use a "-" on his key name: "' + attrs.center + '".');
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                } else if (!isDefined(centerModel)) {
                    $log.error('The "center" property is not defined in the main scope');
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                } else if (!(isDefined(centerModel.lat) && isDefined(centerModel.lng)) && !isDefined(centerModel.autoDiscover)) {
                    angular.copy(defaults.center, centerModel);
                }

                var urlCenterHash, mapReady;
                if (attrs.urlHashCenter === "yes") {
                    var extractCenterFromUrl = function() {
                        var search = $location.search();
                        var centerParam;
                        if (isDefined(search.c)) {
                            var cParam = search.c.split(":");
                            if (cParam.length === 3) {
                                centerParam = { lat: parseFloat(cParam[0]), lng: parseFloat(cParam[1]), zoom: parseInt(cParam[2], 10) };
                            }
                        }
                        return centerParam;
                    };
                    urlCenterHash = extractCenterFromUrl();

                    leafletScope.$on('$locationChangeSuccess', function(event) {
                        var scope = event.currentScope;
                        //$log.debug("updated location...");
                        var urlCenter = extractCenterFromUrl();
                        if (isDefined(urlCenter) && !isSameCenterOnMap(urlCenter, map)) {
                            //$log.debug("updating center model...", urlCenter);
                            scope.center = {
                                lat: urlCenter.lat,
                                lng: urlCenter.lng,
                                zoom: urlCenter.zoom
                            };
                        }
                    });
                }

                leafletScope.$watch("center", function(center) {
                    //$log.debug("updated center model...");
                    // The center from the URL has priority
                    if (isDefined(urlCenterHash)) {
                        angular.copy(urlCenterHash, center);
                        urlCenterHash = undefined;
                    }

                    if (!isValidCenter(center) && center.autoDiscover !== true) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        //map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
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

                    if (mapReady && isSameCenterOnMap(center, map)) {
                        //$log.debug("no need to update map again.");
                        return;
                    }

                    //$log.debug("updating map center...", center);
                    map.setView([center.lat, center.lng], center.zoom);
                    notifyCenterChangedToBounds(leafletScope, map);
                }, true);

                map.whenReady(function() {
                    mapReady = true;
                });

                map.on("moveend", function(/* event */) {
                    // Resolve the center after the first map position
                    _leafletCenter.resolve();
                    notifyCenterUrlHashChanged(leafletScope, map, attrs);
                    //$log.debug("updated center on map...");
                    if (isSameCenterOnMap(centerModel, map)) {
                        //$log.debug("same center in model, no need to update again.");
                        return;
                    }
                    safeApply(leafletScope, function(scope) {
                        //$log.debug("updating center model...", map.getCenter(), map.getZoom());
                        scope.center = {
                            lat: map.getCenter().lat,
                            lng: map.getCenter().lng,
                            zoom: map.getZoom(),
                            autoDiscover: false
                        };
                        notifyCenterChangedToBounds(leafletScope, map);
                    });
                });

                if (centerModel.autoDiscover === true) {
                    map.on("locationerror", function() {
                        $log.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.");
                        if (isValidCenter(centerModel)) {
                            map.setView([centerModel.lat, centerModel.lng], centerModel.zoom);
                            notifyCenterChangedToBounds(leafletScope, map);
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                            notifyCenterChangedToBounds(leafletScope, map);
                        }
                    });
                }
            });
        }
    };
});
