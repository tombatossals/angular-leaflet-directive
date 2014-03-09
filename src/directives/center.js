angular.module("leaflet-directive").directive('center',
    function ($log, $q, $location, leafletMapDefaults, leafletHelpers) {

    var isDefined     = leafletHelpers.isDefined,
        isNumber      = leafletHelpers.isNumber,
        isSameCenterOnMap = leafletHelpers.isSameCenterOnMap,
        safeApply     = leafletHelpers.safeApply,
        isValidCenter = leafletHelpers.isValidCenter;

    var notifyNewCenter = function(scope, attrs, moveend) {
        // Notify the bounds if the center has finished moving
        if (isDefined(moveend)) {
            scope.$broadcast("centerChanged", scope.center);
        }

        if (!isDefined(attrs.urlHashCenter)) {
            return;
        }
        var center = scope.center;
        var centerUrlHash = center.lat + ":" + center.lng + ":" + center.zoom;
        var search = $location.search();
        if (!isDefined(search.c) || search.c !== centerUrlHash) {
            console.log("update hash", centerUrlHash);
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

                if (!isDefined(centerModel)) {
                    $log.error('The "center" property is not defined in the main scope');
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                } else if (!(isDefined(centerModel.lat) && isDefined(centerModel.lng))) {
                    angular.copy(defaults.center, centerModel);
                }

                var semaphore = {
                    model: false,
                    leaflet: false,
                    url: undefined
                };

                var mapReady;

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
                    semaphore.url = extractCenterFromUrl();
                }

                leafletScope.$watch("center", function(center) {

                    console.log("intro model...");
                    // The center from the URL has priority
                    if (isDefined(semaphore.url)) {
                        angular.copy(semaphore.url, center);
                        delete semaphore.url;
                    }

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

                    if (mapReady && isSameCenterOnMap(centerModel, map)) {
                        return;
                    }
                    console.log("changed from model", center);
                    map.setView([center.lat, center.lng], center.zoom);
                    notifyNewCenter(leafletScope, attrs);
                }, true);

                map.whenReady(function() {
                    mapReady = true;
                });

                map.on("moveend", function(/* event */) {
                    if (isSameCenterOnMap(centerModel, map)) {
                        return;
                    }
                    safeApply(leafletScope, function() {
                        centerModel.lat = map.getCenter().lat;
                        centerModel.lng = map.getCenter().lng;
                        centerModel.zoom = map.getZoom();
                        centerModel.autoDiscover = false;
                        notifyNewCenter(leafletScope, attrs, true);
                        console.log("changed from moveend", centerModel);
                    });
                });

                if (centerModel.autoDiscover === true) {
                    map.on("locationerror", function() {
                        $log.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.");
                        if (isValidCenter(centerModel)) {
                            map.setView([centerModel.lat, centerModel.lng], centerModel.zoom);
                            notifyNewCenter(leafletScope, attrs);
                            leafletScope.$broadcast('centerChanged', centerModel);
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                            notifyNewCenter(leafletScope, attrs);
                            leafletScope.$broadcast('centerChanged', centerModel);
                        }
                    });
                }
                _leafletCenter.resolve(centerModel);
            });
        }
    };
});
