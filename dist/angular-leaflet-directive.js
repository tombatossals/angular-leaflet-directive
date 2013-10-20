(function() {

"use strict";

// Determine if a reference is defined
function isDefined(value) {
    return angular.isDefined(value);
}

// Determine if a reference is a number
function isNumber(value) {
  return angular.isNumber(value);
}

// Determine if two objects have the same properties
function equals(o1, o2) {
  return angular.equals(o1, o2);
}

// Get the mapDefaults dictionary, and override the properties defined by the user
function parseMapDefaults(defaults) {
    var mapDefaults = _getMapDefaults();

    if (isDefined(defaults)) {
        mapDefaults.maxZoom = isDefined(defaults.maxZoom) ?  parseInt(defaults.maxZoom, 10) : mapDefaults.maxZoom;
        mapDefaults.minZoom = isDefined(defaults.minZoom) ?  parseInt(defaults.minZoom, 10) : mapDefaults.minZoom;
        mapDefaults.doubleClickZoom = isDefined(defaults.doubleClickZoom) && defaults.doubleClickZoom ?  true: false;
        mapDefaults.scrollWheelZoom = isDefined(defaults.scrollWheelZoom) && defaults.scrollWheelZoom ?  true: false;
        mapDefaults.attributionControl = isDefined(defaults.attributionControl) && defaults.attributionControl ?  true: false;
        mapDefaults.tileLayer = isDefined(defaults.tileLayer) ? defaults.tileLayer : mapDefaults.tileLayer;
        if (defaults.tileLayerOptions) {
            angular.copy(defaults.tileLayerOptions, mapDefaults.tileLayerOptions);
        }
    }
    return mapDefaults;
}

function _getMapDefaults() {
    return {
        maxZoom: 14,
        minZoom: 1,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
        zoomsliderControl: false,
        controlLayersPosition: 'topright',
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        icon: {
            url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon-2x.png',
            size: [25, 41],
            anchor: [12, 40],
            popup: [0, -40],
            shadow: {
                url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
                retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        },
        path: {
            weight: 10,
            opacity: 1,
            color: '#0000ff'
        },
        center: {
            lat: 0,
            lng: 0,
            zoom: 1
        }
    };
}

// Default leaflet icon object used in all markers as a default
function getMarkerIconDefault() {
    var defaults = _getMapDefaults();
    return L.Icon.extend({
        options: {
            iconUrl: defaults.icon.url,
            iconRetinaUrl: defaults.icon.retinaUrl,
            iconSize: defaults.icon.size,
            iconAnchor: defaults.icon.anchor,
            popupAnchor: defaults.icon.popup,
            shadowUrl: defaults.icon.shadow.url,
            shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
            shadowSize: defaults.icon.shadow.size,
            shadowAnchor: defaults.icon.shadow.anchor
        }
    });
}

var Helpers = {
    AwesomeMarkersPlugin: {
        isLoaded: function() {
            if (L.AwesomeMarkers !== undefined) {
                return (L.AwesomeMarkers.Icon !== undefined);
            } else {
                return false;
            }
        },
        is: function(icon) {
            if (this.isLoaded()) {
                return icon instanceof L.AwesomeMarkers.Icon;
            } else {
                return false;
            }
        },
        equal: function (iconA, iconB) {
            if (!this.isLoaded) {
                return false;
            }
            if (this.is(iconA) && this.is(iconB)) {
                return (iconA.options.icon === iconB.options.icon &&
                        iconA.options.iconColor === iconB.options.iconColor &&
                        iconA.options.color === iconB.options.color &&
                        iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                        iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                        iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                        iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1] &&
                        iconA.options.popupAnchor[0] === iconB.options.popupAnchor[0] &&
                        iconA.options.popupAnchor[1] === iconB.options.popupAnchor[1] &&
                        iconA.options.shadowAnchor[0] === iconB.options.shadowAnchor[0] &&
                        iconA.options.shadowAnchor[1] === iconB.options.shadowAnchor[1] &&
                        iconA.options.shadowSize[0] === iconB.options.shadowSize[0] &&
                        iconA.options.shadowSize[1] === iconB.options.shadowSize[1]);
            } else {
                return false;
            }
        }
    },
    MarkerClusterPlugin: {
        isLoaded: function() {
            return L.MarkerClusterGroup !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.MarkerClusterGroup;
            } else {
                return false;
            }
        },
    },
    GoogleLayerPlugin: {
        isLoaded: function() {
            return L.Google !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.Google;
            } else {
                return false;
            }
        },
    },
    BingLayerPlugin: {
        isLoaded: function() {
            return L.BingLayer !== undefined;
        },
        is: function(layer) {
            if (this.isLoaded()) {
                return layer instanceof L.BingLayer;
            } else {
                return false;
            }
        },
    },
    Leaflet: {
        DivIcon: {
            is: function(icon) {
                return icon instanceof L.DivIcon;
            },
            equal: function(iconA, iconB) {
                if (this.is(iconA) && this.is(iconB)) {
                    return (iconA.options.html === iconB.options.html &&
                            iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                            iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                            iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                            iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1]);
                } else {
                    return false;
                }
            }
        },
        Icon: {
            is: function(icon) {
                return icon instanceof L.Icon;
            },
            equal: function(iconA, iconB) {
                if (this.is(iconA) && this.is(iconB)) {
                    return (iconA.options.iconUrl === iconB.options.iconUrl &&
                            iconA.options.iconRetinaUrl === iconB.options.iconRetinaUrl &&
                            iconA.options.iconSize[0] === iconB.options.iconSize[0] &&
                            iconA.options.iconSize[1] === iconB.options.iconSize[1] &&
                            iconA.options.iconAnchor[0] === iconB.options.iconAnchor[0] &&
                            iconA.options.iconAnchor[1] === iconB.options.iconAnchor[1] &&
                            iconA.options.shadowUrl === iconB.options.shadowUrl &&
                            iconA.options.shadowRetinaUrl === iconB.options.shadowRetinaUrl &&
                            iconA.options.shadowSize[0] === iconB.options.shadowSize[0] &&
                            iconA.options.shadowSize[1] === iconB.options.shadowSize[1] &&
                            iconA.options.shadowAnchor[0] === iconB.options.shadowAnchor[0] &&
                            iconA.options.shadowAnchor[1] === iconB.options.shadowAnchor[1] &&
                            iconA.options.popupAnchor[0] === iconB.options.popupAnchor[0] &&
                            iconA.options.popupAnchor[1] === iconB.options.popupAnchor[1]);
                } else {
                    return false;
                }
            }
        }
    }
};

var str_inspect_hint = 'Add testing="testing" to <leaflet> tag to inspect this object';

angular.module("leaflet-directive", []).directive('leaflet', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            defaults: '=defaults',
            maxBounds: '=maxbounds',
            bounds: '=bounds',
            marker: '=marker',
            markers: '=markers',
            legend: '=legend',
            geojson: '=geojson',
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

            $scope.map = map;

            if (!isDefined(attrs.center)) {
                 $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                 map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            if (!isDefined(attrs.tiles)) {
                 var tileLayerUrl = defaults.tileLayer;
                 var tileLayerOptions = defaults.tileLayerOptions;
                 var tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                 tileLayerObj.addTo(map);
            }
        }
    };
});

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

angular.module("leaflet-directive").directive('tiles', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var tiles = $scope.tiles;

            setupTiles(map, tiles, defaults);

            function setupTiles(map, tiles, defaults) {
                var tileLayerObj;
                var tileLayerUrl = defaults.tileLayer;
                var tileLayerOptions = defaults.tileLayerOptions;

                if (angular.isDefined(tiles.url)) {
                    tileLayerUrl = tiles.url;
                }

                if (angular.isDefined(tiles.options)) {
                    angular.copy(tiles.options, tileLayerOptions);
                }

                $scope.$watch("tiles.url", function(url) {
                    if (!angular.isDefined(url)) {
                        return;
                    }
                    tileLayerObj.setUrl(url);
                });

                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
            }
        }
    };
});

angular.module("leaflet-directive").directive('maxbounds', function ($http, $log, $parse, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            var map = controller.getMap();
            var maxBounds = $scope.maxBounds;

            setupMaxBounds(map, maxBounds);

            function setupMaxBounds(map, maxBounds) {
                if (isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast)) {
                    $scope.$watch("maxBounds", function (maxBounds) {
                        if (isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast) && isNumber(maxBounds.southWest.lat) && isNumber(maxBounds.southWest.lng) && isNumber(maxBounds.northEast.lat) && isNumber(maxBounds.northEast.lng)) {
                            map.setMaxBounds(
                                new L.LatLngBounds(
                                    new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                                    new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                                )
                            );
                        }
                    });
                }
            }
        }
    };
});

}());