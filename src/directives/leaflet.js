angular.module("leaflet-directive", ['nemLogging']).directive('leaflet',
    function ($q, leafletData, leafletMapDefaults, leafletHelpers, leafletMapEvents) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            center         : '=',
            lfCenter       : '=',
            defaults       : '=',
            maxbounds      : '=',
            bounds         : '=',
            markers        : '=',
            legend         : '=',
            geojson        : '=',
            paths          : '=',
            tiles          : '=',
            layers         : '=',
            controls       : '=',
            decorations    : '=',
            eventBroadcast : '=',
            markersWatchOptions : '=',
            geojsonWatchOptions : '='
        },
        transclude: true,
        template: '<div class="angular-leaflet-map"><div ng-transclude></div></div>',
        controller: function ($scope) {
            this._leafletMap = $q.defer();
            this.getMap = function () {
                return this._leafletMap.promise;
            };

            this.getLeafletScope = function() {
                return $scope;
            };
        },

        link: function(scope, element, attrs, ctrl) {
            var isDefined = leafletHelpers.isDefined,
                defaults  = leafletMapDefaults.setDefaults(scope.defaults, attrs.id),
                mapEvents = leafletMapEvents.getAvailableMapEvents(),
                addEvents = leafletMapEvents.addEvents;

            scope.mapId =  attrs.id;
            leafletData.setDirectiveControls({}, attrs.id);

            // Set width and height utility functions
            function updateWidth() {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }

            function updateHeight() {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            // If the width attribute defined update css
            // Then watch if bound property changes and update css
            if (isDefined(attrs.width)) {
                updateWidth();

                scope.$watch(
                    function () {
                        return element[0].getAttribute('width');
                    },
                    function () {
                        updateWidth();
                        map.invalidateSize();
                    });
            }

            // If the height attribute defined update css
            // Then watch if bound property changes and update css
            if (isDefined(attrs.height)) {
                updateHeight();

                scope.$watch(
                    function () {
                        return element[0].getAttribute('height');
                    },
                    function () {
                        updateHeight();
                        map.invalidateSize();
                    });
            }

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], leafletMapDefaults.getMapCreationDefaults(attrs.id));
            ctrl._leafletMap.resolve(map);

            if (!isDefined(attrs.center) && !isDefined(attrs.lfCenter)) {
                map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            // If no layers nor tiles defined, set the default tileLayer
            if (!isDefined(attrs.tiles) && (!isDefined(attrs.layers))) {
                var tileLayerObj = L.tileLayer(defaults.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj, attrs.id);
            }

            // Set zoom control configuration
            if (isDefined(map.zoomControl) &&
                isDefined(defaults.zoomControlPosition)) {
                map.zoomControl.setPosition(defaults.zoomControlPosition);
            }

            if (isDefined(map.zoomControl) &&
                defaults.zoomControl===false) {
                map.zoomControl.removeFrom(map);
            }

            if (isDefined(map.zoomsliderControl) &&
                isDefined(defaults.zoomsliderControl) &&
                defaults.zoomsliderControl===false) {
                map.zoomsliderControl.removeFrom(map);
            }


            // if no event-broadcast attribute, all events are broadcasted
            if (!isDefined(attrs.eventBroadcast)) {
                var logic = "broadcast";
                addEvents(map, mapEvents, "eventName", scope, logic);
            }

            // Resolve the map object to the promises
            map.whenReady(function() {
                leafletData.setMap(map, attrs.id);
            });

            scope.$on('$destroy', function () {
                leafletMapDefaults.reset();
                map.remove();
                leafletData.unresolveMap(attrs.id);
            });

            //Handle request to invalidate the map size
            //Up scope using $scope.$emit('invalidateSize')
            //Down scope using $scope.$broadcast('invalidateSize')
            scope.$on('invalidateSize', function() {
                map.invalidateSize();
            });
        }
    };
});
