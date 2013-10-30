angular.module("leaflet-directive", []).directive('leaflet', function ($log, $q, leafletData) {
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
            layers: '=layers',
            customControls: '=customControls',
            eventBroadcast: '=eventBroadcast'
        },
        template: '<div class="angular-leaflet-map" ng-transclude></div>',
        controller: function ($scope) {
            $scope.leafletMap = $q.defer();
            this.getMap = function () {
                return $scope.leafletMap.promise;
            };
        },

        link: function($scope, element, attrs, controller) {
            var defaults = parseMapDefaults($scope.defaults);
            leafletData.setDefaults(defaults);

            // If we are going to set maxBounds, undefine the minZoom property
            if (isDefined($scope.maxBounds)) {
                defaults.minZoom = undefined;
            }

            // Set width and height if they are defined
            if (isDefined(attrs.width)) {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }
            if (isDefined(attrs.height)) {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            if (isDefined(attrs.marker)) {
                 $log.warn("[AngularJS - Leaflet] The 'marker' property is currently deprecated, please use the 'markers' property instead.");
            }

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], {
                maxZoom: defaults.maxZoom,
                minZoom: defaults.minZoom,
                keyboard: defaults.keyboard,
                dragging: defaults.dragging,
                zoomControl: defaults.zoomControl,
                doubleClickZoom: defaults.doubleClickZoom,
                scrollWheelZoom: defaults.scrollWheelZoom,
                attributionControl: defaults.attributionControl
            });

            $scope.leafletMap.resolve(map);
            leafletData.setMap(map);

            if (!isDefined(attrs.center)) {
                 $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                 map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            if (!isDefined(attrs.tiles) && !isDefined(attrs.layers)) {
                var tileLayerObj = L.tileLayer(defaults.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj);
            }

            // Set zoom control configuration
            if (isDefined(map.zoomControl) && isDefined(defaults.zoomControlPosition)) {
                map.zoomControl.setPosition(defaults.zoomControlPosition);
            }
        }
    };
});
