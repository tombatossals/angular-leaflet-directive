var centerDirectiveTypes = ['center', 'lfCenter'];
var centerDirectives = {};

centerDirectiveTypes.forEach(function(directiveName) {
  centerDirectives[directiveName] = ['$log', '$q', '$location', '$timeout', 'leafletMapDefaults', 'leafletHelpers',
      'leafletBoundsHelpers', 'leafletMapEvents',
        function($log, $q, $location, $timeout, leafletMapDefaults, leafletHelpers,
      leafletBoundsHelpers, leafletMapEvents) {

      var isDefined = leafletHelpers.isDefined;
      var isNumber = leafletHelpers.isNumber;
      var isSameCenterOnMap = leafletHelpers.isSameCenterOnMap;
      var safeApply = leafletHelpers.safeApply;
      var isValidCenter = leafletHelpers.isValidCenter;
      var isValidBounds = leafletBoundsHelpers.isValidBounds;
      var isUndefinedOrEmpty = leafletHelpers.isUndefinedOrEmpty;
      var errorHeader = leafletHelpers.errorHeader;

      var shouldInitializeMapWithBounds = function(bounds, center) {
        return isDefined(bounds) && isValidBounds(bounds) && isUndefinedOrEmpty(center);
      };

      var _leafletCenter;
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function() {
          _leafletCenter = $q.defer();
          this.getCenter = function() {
            return _leafletCenter.promise;
          };
        },

        link: function(scope, element, attrs, controller) {
          var leafletScope = controller.getLeafletScope();
          var centerModel = leafletScope[directiveName];

          controller.getMap().then(function(map) {
            var defaults = leafletMapDefaults.getDefaults(attrs.id);

            if (attrs[directiveName].search('-') !== -1) {
              $log.error(errorHeader + ' The "center" variable can\'t use a "-" on its key name: "' + attrs[directiveName] + '".');
              map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
              return;
            } else if (shouldInitializeMapWithBounds(leafletScope.bounds, centerModel)) {
              map.fitBounds(leafletBoundsHelpers.createLeafletBounds(leafletScope.bounds), leafletScope.bounds.options);
              centerModel = map.getCenter();
              safeApply(leafletScope, function(scope) {
                angular.extend(scope[directiveName], {
                  lat: map.getCenter().lat,
                  lng: map.getCenter().lng,
                  zoom: map.getZoom(),
                  autoDiscover: false,
                });
              });

              safeApply(leafletScope, function(scope) {
                var mapBounds = map.getBounds();
                scope.bounds = {
                  northEast: {
                    lat: mapBounds._northEast.lat,
                    lng: mapBounds._northEast.lng,
                  },
                  southWest: {
                    lat: mapBounds._southWest.lat,
                    lng: mapBounds._southWest.lng,
                  },
                };
              });
            } else if (!isDefined(centerModel)) {
              $log.error(errorHeader + ' The "center" property is not defined in the main scope');
              map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
              return;
            } else if (!(isDefined(centerModel.lat) && isDefined(centerModel.lng)) && !isDefined(centerModel.autoDiscover)) {
              angular.copy(defaults.center, centerModel);
            }

            var urlCenterHash;
            var mapReady;
            if (attrs.urlHashCenter === 'yes') {
              var extractCenterFromUrl = function() {
                var search = $location.search();
                var centerParam;
                if (isDefined(search.c)) {
                  var cParam = search.c.split(':');
                  if (cParam.length === 3) {
                    centerParam = {
                      lat: parseFloat(cParam[0]),
                      lng: parseFloat(cParam[1]),
                      zoom: parseInt(cParam[2], 10),
                    };
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
                  angular.extend(scope[directiveName], {
                    lat: urlCenter.lat,
                    lng: urlCenter.lng,
                    zoom: urlCenter.zoom,
                  });
                }
              });
            }

            leafletScope.$watch(directiveName, function(center) {
              if (leafletScope.settingCenterFromLeaflet)
                  return;

              //$log.debug("updated center model...");
              // The center from the URL has priority
              if (isDefined(urlCenterHash)) {
                angular.copy(urlCenterHash, center);
                urlCenterHash = undefined;
              }

              if (!isValidCenter(center) && center.autoDiscover !== true) {
                $log.warn(errorHeader + ' invalid \'center\'');

                //map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                return;
              }

              if (center.autoDiscover === true) {
                if (!isNumber(center.zoom)) {
                  map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                }

                if (isNumber(center.zoom) && center.zoom > defaults.center.zoom) {
                  map.locate({
                    setView: true,
                    maxZoom: center.zoom,
                  });
                } else if (isDefined(defaults.maxZoom)) {
                  map.locate({
                    setView: true,
                    maxZoom: defaults.maxZoom,
                  });
                } else {
                  map.locate({
                    setView: true,
                  });
                }

                return;
              }

              if (mapReady && isSameCenterOnMap(center, map)) {
                //$log.debug("no need to update map again.");
                return;
              }

              //$log.debug("updating map center...", center);
              leafletScope.settingCenterFromScope = true;
              map.setView([center.lat, center.lng], center.zoom);
              leafletMapEvents.notifyCenterChangedToBounds(leafletScope, map);
              $timeout(function() {
                leafletScope.settingCenterFromScope = false;

                //$log.debug("allow center scope updates");
              });
            }, true);

            map.whenReady(function() {
              mapReady = true;
            });

            map.on('moveend', function(/* event */) {
              // Resolve the center after the first map position
              _leafletCenter.resolve();
              leafletMapEvents.notifyCenterUrlHashChanged(leafletScope, map, attrs, $location.search());

              //$log.debug("updated center on map...");
              if (isSameCenterOnMap(centerModel, map) || leafletScope.settingCenterFromScope) {
                //$log.debug("same center in model, no need to update again.");
                return;
              }

              leafletScope.settingCenterFromLeaflet = true;
              safeApply(leafletScope, function(scope) {
                if (!leafletScope.settingCenterFromScope) {
                  //$log.debug("updating center model...", map.getCenter(), map.getZoom());
                  angular.extend(scope[directiveName], {
                    lat: map.getCenter().lat,
                    lng: map.getCenter().lng,
                    zoom: map.getZoom(),
                    autoDiscover: false,
                  });
                }

                leafletMapEvents.notifyCenterChangedToBounds(leafletScope, map);
                $timeout(function() {
                  leafletScope.settingCenterFromLeaflet = false;
                });
              });
            });

            if (centerModel.autoDiscover === true) {
              map.on('locationerror', function() {
                $log.warn(errorHeader + ' The Geolocation API is unauthorized on this page.');
                if (isValidCenter(centerModel)) {
                  map.setView([centerModel.lat, centerModel.lng], centerModel.zoom);
                  leafletMapEvents.notifyCenterChangedToBounds(leafletScope, map);
                } else {
                  map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                  leafletMapEvents.notifyCenterChangedToBounds(leafletScope, map);
                }
              });
            }
          });
        },
      };
    },
    ];
});

centerDirectiveTypes.forEach(function(dirType) {
  angular.module('leaflet-directive').directive(dirType, centerDirectives[dirType]);
});
