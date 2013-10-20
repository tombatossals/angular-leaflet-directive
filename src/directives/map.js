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
