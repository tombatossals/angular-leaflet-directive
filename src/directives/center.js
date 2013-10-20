angular.module("leaflet-directive").directive('center', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var center = $scope.center;

            setupCenter(map, center, defaults);

            function updateBoundsInScope() {
                return;
            }

            function updateCenter(map, center) {
                map.setView([center.lat, center.lng], center.zoom);
                updateBoundsInScope();
            }

            function isValidCenter(center) {
                return isDefined(center) && isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom);
            }

            function _isSafeToApply() {
                var phase = $scope.$root.$$phase;
                return !(phase === '$apply' || phase === '$digest');
            }

            function safeApply(fn) {
                if (!_isSafeToApply()) {
                    $scope.$eval(fn);
                } else {
                    $scope.$apply(fn);
                }
            }

            function setupCenter(map, center, defaults) {
                if (isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom)) {
                    updateCenter(map, center);
                } else if (center.autoDiscover === true) {
                    map.locate({ setView: true, maxZoom: defaults.maxZoom });
                } else {
                    $log.warn("[AngularJS - Leaflet] 'center' is incorrect");
                    updateCenter(map, defaults.center);
                }

                var centerModel = {
                    lat:  $parse("center.lat"),
                    lng:  $parse("center.lng"),
                    zoom: $parse("center.zoom")
                };

                var movingMap = false;

                $scope.$watch("center", function(center, oldCenter) {
                    if (!isValidCenter(center)) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        updateCenter(map, defaults.center);
                        return;
                    }

                    if (movingMap) {
                        // Can't update. The map is moving.
                        return;
                    }

                    if (!equals(center, oldCenter)) {
                        updateCenter(map, center);
                    }
                }, true);

                map.on("movestart", function(/* event */) {
                    movingMap = true;
                });

                map.on("moveend", function(/* event */) {
                    movingMap = false;
                    safeApply(function(scope) {
                        if (centerModel) {
                            centerModel.lat.assign(scope, map.getCenter().lat);
                            centerModel.lng.assign(scope, map.getCenter().lng);
                            centerModel.zoom.assign(scope, map.getZoom());
                        }
                        updateBoundsInScope();
                    });
                });
            }
        }
    };
});
