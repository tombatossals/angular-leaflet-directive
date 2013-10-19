var module = angular.module("leaflet-directive", []);
module.directive('leaflet', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            maxBounds: '=maxbounds',
            bounds: '=bounds',
            marker: '=marker',
            markers: '=markers',
            legend: '=legend',
            geojson: '=geojson',
            defaults: '=defaults',
            paths: '=paths',
            tiles: '=tiles',
            events: '=events',
            layers: '=layers',
            customControls: '=customControls',
            leafletMap: '=leafletmap',
            eventBroadcast: '=eventBroadcast'
        },
        template: '<div class="angular-leaflet-map"></div>',
        controller: function ($scope) {
            this.getMap = function () {
                return $scope.map;
            };
        },

        link: function($scope, element, attrs/*, ctrl */) {
            var defaults = parseMapDefaults($scope.defaults);

            // If we are going to set maxBounds, undefine the minZoom property
            if ($scope.maxBounds) {
                defaults.minZoom = undefined;
            }

            // Set width and height if they are defined
            if (attrs.width) {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }
            if (attrs.height) {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], {
                maxZoom: defaults.maxZoom,
                minZoom: defaults.minZoom,
                doubleClickZoom: defaults.doubleClickZoom,
                scrollWheelZoom: defaults.scrollWheelZoom,
                attributionControl: defaults.attributionControl
            });

            setupTiles(map, $scope.tiles, defaults);
            setupCenter(map, $scope.center, defaults);

            function setupTiles(map, tiles, defaults) {
                var tileLayerObj;
                var tileLayerUrl = defaults.tileLayer;
                var tileLayerOptions = defaults.tileLayerOptions;

                if (angular.isDefined(tiles)) {
                    if (angular.isDefined(tiles.url)) {
                        tileLayerUrl = tiles.url;
                    }

                    if (angular.isDefined(tiles.options)) {
                        angular.copy(tiles.options, tileLayerOptions);
                    }

                    $scope.watch("tiles.url", function(url) {
                        if (!angular.isDefined(url)) {
                            return;
                        }
                        tileLayerObj.setUrl(url);
                    });
                }

                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
            }

            function updateBoundsInScope() {
                return;
            }

            function updateCenter(map, center) {
                map.setView([center.lat, center.lng], center.zoom);
                updateBoundsInScope();
            }

            function isSameCenter(center, oldCenter) {
                return JSON.stringify(center) === JSON.stringify(oldCenter);
            }

            function isValidCenter(center) {
                return angular.isDefined(center) && angular.isDefined(center.lat) && angular.isDefined(center.lng) && angular.isDefined(center.zoom) && isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom);
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
                if (!angular.isDefined(center)) {
                    $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                    updateCenter(map, defaults.center);
                    return;
                } else {
                    if (isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom)) {
                        updateCenter(map, center);
                    } else if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: defaults.maxZoom });
                    } else {
                        $log.warn("[AngularJS - Leaflet] 'center' is incorrect");
                        updateCenter(map, defaults.center);
                    }
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

                    if (!isSameCenter(center, oldCenter)) {
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
