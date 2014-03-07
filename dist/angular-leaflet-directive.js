(function () {
  'use strict';
  angular.module('leaflet-directive', []).directive('leaflet', [
    '$q',
    'leafletData',
    'leafletMapDefaults',
    'leafletHelpers',
    'leafletEvents',
    function ($q, leafletData, leafletMapDefaults, leafletHelpers, leafletEvents) {
      var _leafletMap;
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          center: '=center',
          defaults: '=defaults',
          maxbounds: '=maxbounds',
          bounds: '=bounds',
          markers: '=markers',
          legend: '=legend',
          geojson: '=geojson',
          paths: '=paths',
          tiles: '=tiles',
          layers: '=layers',
          controls: '=controls',
          eventBroadcast: '=eventBroadcast'
        },
        template: '<div class="angular-leaflet-map"></div>',
        controller: [
          '$scope',
          function ($scope) {
            _leafletMap = $q.defer();
            this.getMap = function () {
              return _leafletMap.promise;
            };
            this.getLeafletScope = function () {
              return $scope;
            };
          }
        ],
        link: function (scope, element, attrs) {
          var isDefined = leafletHelpers.isDefined, defaults = leafletMapDefaults.setDefaults(scope.defaults, attrs.id), genDispatchMapEvent = leafletEvents.genDispatchMapEvent, mapEvents = leafletEvents.getAvailableMapEvents();
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
          var map = new L.Map(element[0], leafletMapDefaults.getMapCreationDefaults(attrs.id));
          _leafletMap.resolve(map);
          if (!isDefined(attrs.center)) {
            map.setView([
              defaults.center.lat,
              defaults.center.lng
            ], defaults.center.zoom);
          }
          if (!isDefined(attrs.tiles) && !isDefined(attrs.layers)) {
            var tileLayerObj = L.tileLayer(defaults.tileLayer, defaults.tileLayerOptions);
            tileLayerObj.addTo(map);
            leafletData.setTiles(tileLayerObj, attrs.id);
          }
          if (isDefined(map.zoomControl) && isDefined(defaults.zoomControlPosition)) {
            map.zoomControl.setPosition(defaults.zoomControlPosition);
          }
          if (isDefined(map.zoomControl) && defaults.zoomControl === false) {
            map.zoomControl.removeFrom(map);
          }
          if (isDefined(map.zoomsliderControl) && isDefined(defaults.zoomsliderControl) && defaults.zoomsliderControl === false) {
            map.zoomsliderControl.removeFrom(map);
          }
          if (!isDefined(attrs.eventBroadcast)) {
            var logic = 'broadcast';
            for (var i = 0; i < mapEvents.length; i++) {
              var eventName = mapEvents[i];
              map.on(eventName, genDispatchMapEvent(scope, eventName, logic), { eventName: eventName });
            }
          }
          map.whenReady(function () {
            leafletData.setMap(map, attrs.id);
          });
          scope.$on('$destroy', function () {
            leafletData.unresolveMap(attrs.id);
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('center', [
    '$log',
    '$parse',
    '$location',
    'leafletMapDefaults',
    'leafletHelpers',
    'leafletBoundsHelpers',
    function ($log, $parse, $location, leafletMapDefaults, leafletHelpers, leafletBoundsHelpers) {
      var isDefined = leafletHelpers.isDefined, isNumber = leafletHelpers.isNumber, equals = leafletHelpers.equals, safeApply = leafletHelpers.safeApply, updateBoundsInScope = leafletBoundsHelpers.updateBoundsInScope, isValidCenter = leafletHelpers.isValidCenter;
      var updateCenterUrlParams = function (center) {
        if (isNumber(center.lat) && isNumber(center.lng) && isNumber(center.zoom)) {
          var centerParams = { c: center.lat + ':' + center.lng + ':' + center.zoom };
          $location.path('');
          $location.search(centerParams);
        }
      };
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var leafletScope = controller.getLeafletScope(), center = leafletScope.center;
          controller.getMap().then(function (map) {
            var defaults = leafletMapDefaults.getDefaults(attrs.id);
            if (!isDefined(center) || !(center.lat && center.lng)) {
              map.setView([
                defaults.center.lat,
                defaults.center.lng
              ], defaults.center.zoom);
              return;
            }
            var centerModel = {
                lat: $parse('center.lat'),
                lng: $parse('center.lng'),
                zoom: $parse('center.zoom'),
                autoDiscover: $parse('center.autoDiscover')
              };
            var changingCenterFromModel = false;
            var changingCenterFromUrl = false;
            var initialCenterParamsFromURL;
            if (attrs.urlHashCenter === 'yes') {
              var extractCenter = function (params) {
                var centerParam;
                if (isDefined(params.c)) {
                  var cParam = params.c.split(':');
                  if (cParam.length === 3) {
                    centerParam = {
                      lat: parseFloat(cParam[0]),
                      lng: parseFloat(cParam[1]),
                      zoom: parseInt(cParam[2], 10)
                    };
                  }
                }
                return centerParam;
              };
              var search = $location.search();
              initialCenterParamsFromURL = extractCenter(search);
              leafletScope.$on('$locationChangeSuccess', function () {
                var search = $location.search();
                changingCenterFromUrl = true;
                if (isDefined(search.c)) {
                  var urlParams = search.c.split(':');
                  if (urlParams.length === 3) {
                    var urlCenter = {
                        lat: parseFloat(urlParams[0]),
                        lng: parseFloat(urlParams[1]),
                        zoom: parseInt(urlParams[2], 10)
                      };
                    var actualCenter = {
                        lat: leafletScope.center.lat,
                        lng: leafletScope.center.lng,
                        zoom: leafletScope.center.zoom
                      };
                    if (urlCenter && !equals(urlCenter, actualCenter)) {
                      leafletScope.center = {
                        lat: urlCenter.lat,
                        lng: urlCenter.lng,
                        zoom: urlCenter.zoom
                      };
                    }
                  }
                }
                changingCenterFromUrl = false;
              });
            }
            leafletScope.$watch('center', function (center) {
              if (changingCenterFromUrl) {
                return;
              }
              if (attrs.urlHashCenter === 'yes' && isDefined(initialCenterParamsFromURL)) {
                angular.copy(initialCenterParamsFromURL, center);
                initialCenterParamsFromURL = undefined;
              }
              if (!isValidCenter(center) && center.autoDiscover !== true) {
                $log.warn('[AngularJS - Leaflet] invalid \'center\'');
                map.setView([
                  defaults.center.lat,
                  defaults.center.lng
                ], defaults.center.zoom);
                return;
              }
              changingCenterFromModel = true;
              if (center.autoDiscover === true) {
                if (!isNumber(center.zoom)) {
                  map.setView([
                    defaults.center.lat,
                    defaults.center.lng
                  ], defaults.center.zoom);
                }
                if (isNumber(center.zoom) && center.zoom > defaults.center.zoom) {
                  map.locate({
                    setView: true,
                    maxZoom: center.zoom
                  });
                } else if (isDefined(defaults.maxZoom)) {
                  map.locate({
                    setView: true,
                    maxZoom: defaults.maxZoom
                  });
                } else {
                  map.locate({ setView: true });
                }
                return;
              }
              map.setView([
                center.lat,
                center.lng
              ], center.zoom);
              if (attrs.urlHashCenter) {
                updateCenterUrlParams(center);
              }
              changingCenterFromModel = false;
            }, true);
            map.on('moveend', function () {
              if (changingCenterFromModel || changingCenterFromUrl) {
                return;
              }
              safeApply(leafletScope, function (scope) {
                updateBoundsInScope(scope, map);
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
              map.on('locationerror', function () {
                $log.warn('[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.');
                if (isValidCenter(center)) {
                  map.setView([
                    center.lat,
                    center.lng
                  ], center.zoom);
                  if (attrs.urlHashCenter) {
                    updateCenterUrlParams(center);
                  }
                } else {
                  map.setView([
                    defaults.center.lat,
                    defaults.center.lng
                  ], defaults.center.zoom);
                  if (attrs.urlHashCenter) {
                    updateCenterUrlParams(center);
                  }
                }
              });
            }
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('tiles', [
    '$log',
    'leafletData',
    'leafletMapDefaults',
    'leafletHelpers',
    function ($log, leafletData, leafletMapDefaults, leafletHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var isDefined = leafletHelpers.isDefined, leafletScope = controller.getLeafletScope(), tiles = leafletScope.tiles;
          if (!isDefined(tiles) && !isDefined(tiles.url)) {
            $log.warn('[AngularJS - Leaflet] The \'tiles\' definition doesn\'t have the \'url\' property.');
            return;
          }
          controller.getMap().then(function (map) {
            var defaults = leafletMapDefaults.getDefaults(attrs.id);
            var tileLayerObj;
            leafletScope.$watch('tiles', function (tiles) {
              var tileLayerOptions = defaults.tileLayerOptions;
              var tileLayerUrl = defaults.tileLayer;
              if (!isDefined(tiles.url) && isDefined(tileLayerObj)) {
                map.removeLayer(tileLayerObj);
                return;
              }
              if (!isDefined(tileLayerObj)) {
                if (isDefined(tiles.options)) {
                  angular.copy(tiles.options, tileLayerOptions);
                }
                if (isDefined(tiles.url)) {
                  tileLayerUrl = tiles.url;
                }
                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj, attrs.id);
                return;
              }
              if (isDefined(tiles.url) && isDefined(tiles.options) && !angular.equals(tiles.options, tileLayerOptions)) {
                map.removeLayer(tileLayerObj);
                tileLayerOptions = defaults.tileLayerOptions;
                angular.copy(tiles.options, tileLayerOptions);
                tileLayerUrl = tiles.url;
                tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj, attrs.id);
                return;
              }
              if (isDefined(tiles.url)) {
                tileLayerObj.setUrl(tiles.url);
              }
            }, true);
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('legend', [
    '$log',
    '$http',
    'leafletHelpers',
    'leafletLegendHelpers',
    function ($log, $http, leafletHelpers, leafletLegendHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var isArray = leafletHelpers.isArray, isDefined = leafletHelpers.isDefined, isFunction = leafletHelpers.isFunction, leafletScope = controller.getLeafletScope(), legend = leafletScope.legend;
          var legendClass = legend.legendClass ? legend.legendClass : 'legend';
          var position = legend.position || 'bottomright';
          var leafletLegend;
          controller.getMap().then(function (map) {
            if (!isDefined(legend.url) && (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length)) {
              $log.warn('[AngularJS - Leaflet] legend.colors and legend.labels must be set.');
            } else if (isDefined(legend.url)) {
              $log.info('[AngularJS - Leaflet] loading arcgis legend service.');
            } else {
              leafletLegend = L.control({ position: position });
              leafletLegend.onAdd = leafletLegendHelpers.getOnAddArrayLegend(legend, legendClass);
              leafletLegend.addTo(map);
            }
            leafletScope.$watch('legend.url', function (newURL) {
              if (!isDefined(newURL)) {
                return;
              }
              $http.get(newURL).success(function (legendData) {
                if (isDefined(leafletLegend)) {
                  leafletLegendHelpers.updateArcGISLegend(leafletLegend.getContainer(), legendData);
                } else {
                  leafletLegend = L.control({ position: position });
                  leafletLegend.onAdd = leafletLegendHelpers.getOnAddArcGISLegend(legendData, legendClass);
                  leafletLegend.addTo(map);
                }
                if (isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
                  legend.loadedData();
                }
              }).error(function () {
                $log.warn('[AngularJS - Leaflet] legend.url not loaded.');
              });
            });
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('geojson', [
    '$log',
    '$rootScope',
    'leafletData',
    'leafletHelpers',
    function ($log, $rootScope, leafletData, leafletHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var safeApply = leafletHelpers.safeApply, isDefined = leafletHelpers.isDefined, leafletScope = controller.getLeafletScope(), leafletGeoJSON = {};
          controller.getMap().then(function (map) {
            leafletScope.$watch('geojson', function (geojson) {
              if (isDefined(leafletGeoJSON) && map.hasLayer(leafletGeoJSON)) {
                map.removeLayer(leafletGeoJSON);
              }
              if (!(isDefined(geojson) && isDefined(geojson.data))) {
                return;
              }
              var resetStyleOnMouseout = geojson.resetStyleOnMouseout, onEachFeature = geojson.onEachFeature;
              if (!onEachFeature) {
                onEachFeature = function (feature, layer) {
                  if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(geojson.label)) {
                    layer.bindLabel(feature.properties.description);
                  }
                  layer.on({
                    mouseover: function (e) {
                      safeApply(leafletScope, function () {
                        geojson.selected = feature;
                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                      });
                    },
                    mouseout: function (e) {
                      if (resetStyleOnMouseout) {
                        leafletGeoJSON.resetStyle(e.target);
                      }
                      safeApply(leafletScope, function () {
                        geojson.selected = undefined;
                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                      });
                    },
                    click: function (e) {
                      safeApply(leafletScope, function () {
                        geojson.selected = feature;
                        $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', geojson.selected, e);
                      });
                    }
                  });
                };
              }
              geojson.options = {
                style: geojson.style,
                onEachFeature: onEachFeature
              };
              leafletGeoJSON = L.geoJson(geojson.data, geojson.options);
              leafletData.setGeoJSON(leafletGeoJSON);
              leafletGeoJSON.addTo(map);
            });
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('layers', [
    '$log',
    '$q',
    'leafletData',
    'leafletHelpers',
    'leafletLayerHelpers',
    'leafletControlHelpers',
    function ($log, $q, leafletData, leafletHelpers, leafletLayerHelpers, leafletControlHelpers) {
      var _leafletLayers;
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function () {
          _leafletLayers = $q.defer();
          this.getLayers = function () {
            return _leafletLayers.promise;
          };
        },
        link: function (scope, element, attrs, controller) {
          var isDefined = leafletHelpers.isDefined, leafletLayers = {}, leafletScope = controller.getLeafletScope(), layers = leafletScope.layers, createLayer = leafletLayerHelpers.createLayer, updateLayersControl = leafletControlHelpers.updateLayersControl, isLayersControlVisible = false;
          controller.getMap().then(function (map) {
            if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
              $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
              return;
            }
            _leafletLayers.resolve(leafletLayers);
            leafletData.setLayers(leafletLayers, attrs.id);
            leafletLayers.baselayers = {};
            leafletLayers.overlays = {};
            var mapId = attrs.id;
            var oneVisibleLayer = false;
            for (var layerName in layers.baselayers) {
              var newBaseLayer = createLayer(layers.baselayers[layerName]);
              if (!isDefined(newBaseLayer)) {
                delete layers.baselayers[layerName];
                continue;
              }
              leafletLayers.baselayers[layerName] = newBaseLayer;
              if (layers.baselayers[layerName].top === true) {
                map.addLayer(leafletLayers.baselayers[layerName]);
                oneVisibleLayer = true;
              }
            }
            if (!oneVisibleLayer && Object.keys(leafletLayers.baselayers).length > 0) {
              map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
            }
            for (layerName in layers.overlays) {
              var newOverlayLayer = createLayer(layers.overlays[layerName]);
              if (!isDefined(newOverlayLayer)) {
                delete layers.overlays[layerName];
                continue;
              }
              leafletLayers.overlays[layerName] = newOverlayLayer;
              if (layers.overlays[layerName].visible === true) {
                map.addLayer(leafletLayers.overlays[layerName]);
              }
            }
            leafletScope.$watch('layers.baselayers', function (newBaseLayers) {
              for (var name in leafletLayers.baselayers) {
                if (!isDefined(newBaseLayers[name])) {
                  if (map.hasLayer(leafletLayers.baselayers[name])) {
                    map.removeLayer(leafletLayers.baselayers[name]);
                  }
                  delete leafletLayers.baselayers[name];
                }
              }
              for (var newName in newBaseLayers) {
                if (!isDefined(leafletLayers.baselayers[newName])) {
                  var testBaseLayer = createLayer(newBaseLayers[newName]);
                  if (isDefined(testBaseLayer)) {
                    leafletLayers.baselayers[newName] = testBaseLayer;
                    if (newBaseLayers[newName].top === true) {
                      map.addLayer(leafletLayers.baselayers[newName]);
                    }
                  }
                }
              }
              if (Object.keys(leafletLayers.baselayers).length === 0) {
                $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                return;
              }
              var found = false;
              for (var key in leafletLayers.baselayers) {
                if (map.hasLayer(leafletLayers.baselayers[key])) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
              }
              isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, newBaseLayers, layers.overlays, leafletLayers);
            }, true);
            leafletScope.$watch('layers.overlays', function (newOverlayLayers) {
              for (var name in leafletLayers.overlays) {
                if (!isDefined(newOverlayLayers[name])) {
                  if (map.hasLayer(leafletLayers.overlays[name])) {
                    map.removeLayer(leafletLayers.overlays[name]);
                  }
                  delete leafletLayers.overlays[name];
                }
              }
              for (var newName in newOverlayLayers) {
                if (!isDefined(leafletLayers.overlays[newName])) {
                  var testOverlayLayer = createLayer(newOverlayLayers[newName]);
                  if (isDefined(testOverlayLayer)) {
                    leafletLayers.overlays[newName] = testOverlayLayer;
                    if (newOverlayLayers[newName].visible === true) {
                      map.addLayer(leafletLayers.overlays[newName]);
                    }
                  }
                }
                if (newOverlayLayers[newName].visible && !map.hasLayer(leafletLayers.overlays[newName])) {
                  map.addLayer(leafletLayers.overlays[newName]);
                } else if (newOverlayLayers[newName].visible === false && map.hasLayer(leafletLayers.overlays[newName])) {
                  map.removeLayer(leafletLayers.overlays[newName]);
                }
              }
              isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, layers.baselayers, newOverlayLayers, leafletLayers);
            }, true);
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('bounds', [
    '$log',
    'leafletHelpers',
    'leafletBoundsHelpers',
    function ($log, leafletHelpers, leafletBoundsHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var isDefined = leafletHelpers.isDefined, createLeafletBounds = leafletBoundsHelpers.createLeafletBounds, leafletScope = controller.getLeafletScope();
          controller.getMap().then(function (map) {
            map.whenReady(function () {
              leafletScope.$watch('bounds', function (newBounds) {
                if (!isDefined(newBounds)) {
                  $log.error('[AngularJS - Leaflet] Invalid bounds');
                  return;
                }
                var leafletBounds = createLeafletBounds(newBounds);
                if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                  map.fitBounds(leafletBounds);
                }
              }, true);
            });
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('markers', [
    '$log',
    '$rootScope',
    '$q',
    'leafletData',
    'leafletHelpers',
    'leafletMapDefaults',
    'leafletMarkersHelpers',
    'leafletEvents',
    function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkersHelpers, leafletEvents) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: [
          'leaflet',
          '?layers'
        ],
        link: function (scope, element, attrs, controller) {
          var mapController = controller[0], Helpers = leafletHelpers, isDefined = leafletHelpers.isDefined, isString = leafletHelpers.isString, leafletScope = mapController.getLeafletScope(), markers = leafletScope.markers, deleteMarker = leafletMarkersHelpers.deleteMarker, addMarkerWatcher = leafletMarkersHelpers.addMarkerWatcher, listenMarkerEvents = leafletMarkersHelpers.listenMarkerEvents, addMarkerToGroup = leafletMarkersHelpers.addMarkerToGroup, bindMarkerEvents = leafletEvents.bindMarkerEvents, createMarker = leafletMarkersHelpers.createMarker;
          mapController.getMap().then(function (map) {
            var leafletMarkers = {}, getLayers;
            if (isDefined(controller[1])) {
              getLayers = controller[1].getLayers;
            } else {
              getLayers = function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
              };
            }
            if (!isDefined(markers)) {
              return;
            }
            getLayers().then(function (layers) {
              leafletData.setMarkers(leafletMarkers, attrs.id);
              leafletScope.$watch('markers', function (newMarkers) {
                for (var name in leafletMarkers) {
                  if (!isDefined(newMarkers) || !isDefined(newMarkers[name])) {
                    deleteMarker(leafletMarkers[name], map, layers);
                    delete leafletMarkers[name];
                  }
                }
                for (var newName in newMarkers) {
                  if (!isDefined(leafletMarkers[newName])) {
                    var markerData = newMarkers[newName];
                    var marker = createMarker(markerData);
                    if (!isDefined(marker)) {
                      $log.error('[AngularJS - Leaflet] Received invalid data on the marker ' + newName + '.');
                      continue;
                    }
                    leafletMarkers[newName] = marker;
                    if (isDefined(markerData.message)) {
                      marker.bindPopup(markerData.message, markerData.popupOptions);
                    }
                    if (isDefined(markerData.group)) {
                      addMarkerToGroup(marker, markerData.group, map);
                    }
                    if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message)) {
                      marker.bindLabel(markerData.label.message, markerData.label.options);
                    }
                    if (isDefined(markerData) && isDefined(markerData.layer)) {
                      if (!isString(markerData.layer)) {
                        $log.error('[AngularJS - Leaflet] A layername must be a string');
                        continue;
                      }
                      if (!isDefined(layers)) {
                        $log.error('[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.');
                        continue;
                      }
                      if (!isDefined(layers.overlays) || !isDefined(layers.overlays[markerData.layer])) {
                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                        continue;
                      }
                      var layerGroup = layers.overlays[markerData.layer];
                      if (!(layerGroup instanceof L.LayerGroup)) {
                        $log.error('[AngularJS - Leaflet] Adding a marker to an overlay needs a overlay of the type "group"');
                        continue;
                      }
                      layerGroup.addLayer(marker);
                      if (map.hasLayer(marker) && markerData.focus === true) {
                        marker.openPopup();
                      }
                    } else if (!isDefined(markerData.group)) {
                      map.addLayer(marker);
                      if (markerData.focus === true) {
                        marker.openPopup();
                      }
                      if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.options) && markerData.label.options.noHide === true) {
                        marker.showLabel();
                      }
                    }
                    var shouldWatch = !isDefined(attrs.watchMarkers) || attrs.watchMarkers === 'true';
                    if (shouldWatch) {
                      addMarkerWatcher(marker, newName, leafletScope, layers, map);
                      listenMarkerEvents(marker, markerData, leafletScope);
                    }
                    bindMarkerEvents(marker, newName, markerData, leafletScope);
                  }
                }
              }, true);
            });
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('paths', [
    '$log',
    'leafletData',
    'leafletMapDefaults',
    'leafletHelpers',
    'leafletPathsHelpers',
    'leafletEvents',
    function ($log, leafletData, leafletMapDefaults, leafletHelpers, leafletPathsHelpers, leafletEvents) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var isDefined = leafletHelpers.isDefined, leafletScope = controller.getLeafletScope(), paths = leafletScope.paths, createPath = leafletPathsHelpers.createPath, bindPathEvents = leafletEvents.bindPathEvents, setPathOptions = leafletPathsHelpers.setPathOptions;
          controller.getMap().then(function (map) {
            var defaults = leafletMapDefaults.getDefaults(attrs.id);
            if (!isDefined(paths)) {
              return;
            }
            var leafletPaths = {};
            leafletData.setPaths(leafletPaths, attrs.id);
            var watchPathFn = function (leafletPath, name) {
              var clearWatch = leafletScope.$watch('paths.' + name, function (pathData) {
                  if (!isDefined(pathData)) {
                    map.removeLayer(leafletPath);
                    clearWatch();
                    return;
                  }
                  setPathOptions(leafletPath, pathData.type, pathData);
                }, true);
            };
            leafletScope.$watch('paths', function (newPaths) {
              for (var newName in newPaths) {
                if (!isDefined(leafletPaths[newName])) {
                  var pathData = newPaths[newName];
                  var newPath = createPath(newName, newPaths[newName], defaults);
                  if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(pathData.label) && isDefined(pathData.label.message)) {
                    newPath.bindLabel(pathData.label.message, pathData.label.options);
                  }
                  if (isDefined(newPath)) {
                    leafletPaths[newName] = newPath;
                    map.addLayer(newPath);
                    watchPathFn(newPath, newName);
                  }
                  bindPathEvents(newPath, newName, pathData, leafletScope);
                }
              }
              for (var name in leafletPaths) {
                if (!isDefined(newPaths[name])) {
                  delete leafletPaths[name];
                }
              }
            }, true);
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('controls', [
    '$log',
    'leafletHelpers',
    function ($log, leafletHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: '?^leaflet',
        link: function (scope, element, attrs, controller) {
          if (!controller) {
            return;
          }
          var isDefined = leafletHelpers.isDefined, leafletScope = controller.getLeafletScope(), controls = leafletScope.controls;
          controller.getMap().then(function (map) {
            if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {
              var drawnItems = new L.FeatureGroup();
              map.addLayer(drawnItems);
              var options = { edit: { featureGroup: drawnItems } };
              angular.extend(options, controls.draw.options);
              var drawControl = new L.Control.Draw(options);
              map.addControl(drawControl);
            }
            if (isDefined(controls.custom)) {
              for (var i in controls.custom) {
                map.addControl(controls.custom[i]);
              }
            }
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('eventBroadcast', [
    '$log',
    '$rootScope',
    'leafletHelpers',
    'leafletEvents',
    function ($log, $rootScope, leafletHelpers, leafletEvents) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var isObject = leafletHelpers.isObject, leafletScope = controller.getLeafletScope(), eventBroadcast = leafletScope.eventBroadcast, availableMapEvents = leafletEvents.getAvailableMapEvents(), genDispatchMapEvent = leafletEvents.genDispatchMapEvent;
          controller.getMap().then(function (map) {
            var mapEvents = [];
            var i;
            var eventName;
            var logic = 'broadcast';
            if (isObject(eventBroadcast)) {
              if (eventBroadcast.map === undefined || eventBroadcast.map === null) {
                mapEvents = availableMapEvents;
              } else if (typeof eventBroadcast.map !== 'object') {
                $log.warn('[AngularJS - Leaflet] event-broadcast.map must be an object check your model.');
              } else {
                if (eventBroadcast.map.logic !== undefined && eventBroadcast.map.logic !== null) {
                  if (eventBroadcast.map.logic !== 'emit' && eventBroadcast.map.logic !== 'broadcast') {
                    $log.warn('[AngularJS - Leaflet] Available event propagation logic are: \'emit\' or \'broadcast\'.');
                  } else if (eventBroadcast.map.logic === 'emit') {
                    logic = 'emit';
                  }
                }
                var mapEventsEnable = false, mapEventsDisable = false;
                if (eventBroadcast.map.enable !== undefined && eventBroadcast.map.enable !== null) {
                  if (typeof eventBroadcast.map.enable === 'object') {
                    mapEventsEnable = true;
                  }
                }
                if (eventBroadcast.map.disable !== undefined && eventBroadcast.map.disable !== null) {
                  if (typeof eventBroadcast.map.disable === 'object') {
                    mapEventsDisable = true;
                  }
                }
                if (mapEventsEnable && mapEventsDisable) {
                  $log.warn('[AngularJS - Leaflet] can not enable and disable events at the time');
                } else if (!mapEventsEnable && !mapEventsDisable) {
                  $log.warn('[AngularJS - Leaflet] must enable or disable events');
                } else {
                  if (mapEventsEnable) {
                    for (i = 0; i < eventBroadcast.map.enable.length; i++) {
                      eventName = eventBroadcast.map.enable[i];
                      if (mapEvents.indexOf(eventName) !== -1) {
                        $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' is already enabled');
                      } else {
                        if (availableMapEvents.indexOf(eventName) === -1) {
                          $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist');
                        } else {
                          mapEvents.push(eventName);
                        }
                      }
                    }
                  } else {
                    mapEvents = availableMapEvents;
                    for (i = 0; i < eventBroadcast.map.disable.length; i++) {
                      eventName = eventBroadcast.map.disable[i];
                      var index = mapEvents.indexOf(eventName);
                      if (index === -1) {
                        $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist or has been already disabled');
                      } else {
                        mapEvents.splice(index, 1);
                      }
                    }
                  }
                }
              }
              for (i = 0; i < mapEvents.length; i++) {
                eventName = mapEvents[i];
                map.on(eventName, genDispatchMapEvent(leafletScope, eventName, logic), { eventName: eventName });
              }
            } else {
              $log.warn('[AngularJS - Leaflet] event-broadcast must be an object, check your model.');
            }
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').directive('maxbounds', [
    '$log',
    'leafletMapDefaults',
    'leafletBoundsHelpers',
    function ($log, leafletMapDefaults, leafletBoundsHelpers) {
      return {
        restrict: 'A',
        scope: false,
        replace: false,
        require: 'leaflet',
        link: function (scope, element, attrs, controller) {
          var leafletScope = controller.getLeafletScope(), isValidBounds = leafletBoundsHelpers.isValidBounds;
          controller.getMap().then(function (map) {
            leafletScope.$watch('maxbounds', function (maxbounds) {
              if (!isValidBounds(maxbounds)) {
                map.setMaxBounds();
                return;
              }
              var bounds = [
                  [
                    maxbounds.southWest.lat,
                    maxbounds.southWest.lng
                  ],
                  [
                    maxbounds.northEast.lat,
                    maxbounds.northEast.lng
                  ]
                ];
              map.setMaxBounds(bounds);
              map.fitBounds(bounds);
            });
          });
        }
      };
    }
  ]);
  angular.module('leaflet-directive').service('leafletData', [
    '$log',
    '$q',
    'leafletHelpers',
    function ($log, $q, leafletHelpers) {
      var getDefer = leafletHelpers.getDefer, getUnresolvedDefer = leafletHelpers.getUnresolvedDefer, setResolvedDefer = leafletHelpers.setResolvedDefer;
      var maps = {};
      var tiles = {};
      var layers = {};
      var paths = {};
      var markers = {};
      var geoJSON = {};
      this.setMap = function (leafletMap, scopeId) {
        var defer = getUnresolvedDefer(maps, scopeId);
        defer.resolve(leafletMap);
        setResolvedDefer(maps, scopeId);
      };
      this.getMap = function (scopeId) {
        var defer = getDefer(maps, scopeId);
        return defer.promise;
      };
      this.unresolveMap = function (scopeId) {
        var id = leafletHelpers.obtainEffectiveMapId(maps, scopeId);
        maps[id] = undefined;
      };
      this.getPaths = function (scopeId) {
        var defer = getDefer(paths, scopeId);
        return defer.promise;
      };
      this.setPaths = function (leafletPaths, scopeId) {
        var defer = getUnresolvedDefer(paths, scopeId);
        defer.resolve(leafletPaths);
        setResolvedDefer(paths, scopeId);
      };
      this.getMarkers = function (scopeId) {
        var defer = getDefer(markers, scopeId);
        return defer.promise;
      };
      this.setMarkers = function (leafletMarkers, scopeId) {
        var defer = getUnresolvedDefer(markers, scopeId);
        defer.resolve(leafletMarkers);
        setResolvedDefer(markers, scopeId);
      };
      this.getLayers = function (scopeId) {
        var defer = getDefer(layers, scopeId);
        return defer.promise;
      };
      this.setLayers = function (leafletLayers, scopeId) {
        var defer = getUnresolvedDefer(layers, scopeId);
        defer.resolve(leafletLayers);
        setResolvedDefer(layers, scopeId);
      };
      this.setTiles = function (leafletTiles, scopeId) {
        var defer = getUnresolvedDefer(tiles, scopeId);
        defer.resolve(leafletTiles);
        setResolvedDefer(tiles, scopeId);
      };
      this.getTiles = function (scopeId) {
        var defer = getDefer(tiles, scopeId);
        return defer.promise;
      };
      this.setGeoJSON = function (leafletGeoJSON, scopeId) {
        var defer = getUnresolvedDefer(geoJSON, scopeId);
        defer.resolve(leafletGeoJSON);
        setResolvedDefer(geoJSON, scopeId);
      };
      this.getGeoJSON = function (scopeId) {
        var defer = getDefer(geoJSON, scopeId);
        return defer.promise;
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletMapDefaults', [
    '$q',
    'leafletHelpers',
    function ($q, leafletHelpers) {
      function _getDefaults() {
        return {
          keyboard: true,
          dragging: true,
          worldCopyJump: false,
          doubleClickZoom: true,
          scrollWheelZoom: true,
          zoomControl: true,
          zoomsliderControl: false,
          zoomControlPosition: 'topleft',
          attributionControl: true,
          controls: {
            layers: {
              visible: true,
              position: 'topright',
              collapsed: true
            }
          },
          crs: L.CRS.EPSG3857,
          tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          tileLayerOptions: { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
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
      var isDefined = leafletHelpers.isDefined, obtainEffectiveMapId = leafletHelpers.obtainEffectiveMapId, defaults = {};
      return {
        getDefaults: function (scopeId) {
          var mapId = obtainEffectiveMapId(defaults, scopeId);
          return defaults[mapId];
        },
        getMapCreationDefaults: function (scopeId) {
          var mapId = obtainEffectiveMapId(defaults, scopeId);
          var d = defaults[mapId];
          var mapDefaults = {
              maxZoom: d.maxZoom,
              keyboard: d.keyboard,
              dragging: d.dragging,
              zoomControl: d.zoomControl,
              doubleClickZoom: d.doubleClickZoom,
              scrollWheelZoom: d.scrollWheelZoom,
              attributionControl: d.attributionControl,
              worldCopyJump: d.worldCopyJump,
              crs: d.crs
            };
          if (isDefined(d.minZoom)) {
            mapDefaults.minZoom = d.minZoom;
          }
          if (isDefined(d.zoomAnimation)) {
            mapDefaults.zoomAnimation = d.zoomAnimation;
          }
          if (isDefined(d.fadeAnimation)) {
            mapDefaults.fadeAnimation = d.fadeAnimation;
          }
          if (isDefined(d.markerZoomAnimation)) {
            mapDefaults.markerZoomAnimation = d.markerZoomAnimation;
          }
          return mapDefaults;
        },
        setDefaults: function (userDefaults, scopeId) {
          var newDefaults = _getDefaults();
          if (isDefined(userDefaults)) {
            newDefaults.doubleClickZoom = isDefined(userDefaults.doubleClickZoom) ? userDefaults.doubleClickZoom : newDefaults.doubleClickZoom;
            newDefaults.scrollWheelZoom = isDefined(userDefaults.scrollWheelZoom) ? userDefaults.scrollWheelZoom : newDefaults.doubleClickZoom;
            newDefaults.zoomControl = isDefined(userDefaults.zoomControl) ? userDefaults.zoomControl : newDefaults.zoomControl;
            newDefaults.zoomsliderControl = isDefined(userDefaults.zoomsliderControl) ? userDefaults.zoomsliderControl : newDefaults.zoomsliderControl;
            newDefaults.attributionControl = isDefined(userDefaults.attributionControl) ? userDefaults.attributionControl : newDefaults.attributionControl;
            newDefaults.tileLayer = isDefined(userDefaults.tileLayer) ? userDefaults.tileLayer : newDefaults.tileLayer;
            newDefaults.zoomControlPosition = isDefined(userDefaults.zoomControlPosition) ? userDefaults.zoomControlPosition : newDefaults.zoomControlPosition;
            newDefaults.keyboard = isDefined(userDefaults.keyboard) ? userDefaults.keyboard : newDefaults.keyboard;
            newDefaults.dragging = isDefined(userDefaults.dragging) ? userDefaults.dragging : newDefaults.dragging;
            if (isDefined(userDefaults.controls)) {
              angular.extend(newDefaults.controls, userDefaults.controls);
            }
            if (isDefined(userDefaults.crs) && isDefined(L.CRS[userDefaults.crs])) {
              newDefaults.crs = L.CRS[userDefaults.crs];
            }
            if (isDefined(userDefaults.tileLayerOptions)) {
              angular.copy(userDefaults.tileLayerOptions, newDefaults.tileLayerOptions);
            }
            if (isDefined(userDefaults.maxZoom)) {
              newDefaults.maxZoom = userDefaults.maxZoom;
            }
            if (isDefined(userDefaults.minZoom)) {
              newDefaults.minZoom = userDefaults.minZoom;
            }
            if (isDefined(userDefaults.zoomAnimation)) {
              newDefaults.zoomAnimation = userDefaults.zoomAnimation;
            }
            if (isDefined(userDefaults.fadeAnimation)) {
              newDefaults.fadeAnimation = userDefaults.fadeAnimation;
            }
            if (isDefined(userDefaults.markerZoomAnimation)) {
              newDefaults.markerZoomAnimation = userDefaults.markerZoomAnimation;
            }
            if (isDefined(userDefaults.worldCopyJump)) {
              newDefaults.worldCopyJump = userDefaults.worldCopyJump;
            }
          }
          var mapId = obtainEffectiveMapId(defaults, scopeId);
          defaults[mapId] = newDefaults;
          return newDefaults;
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletEvents', [
    '$rootScope',
    '$q',
    '$log',
    'leafletHelpers',
    function ($rootScope, $q, $log, leafletHelpers) {
      var safeApply = leafletHelpers.safeApply, isDefined = leafletHelpers.isDefined, isObject = leafletHelpers.isObject, Helpers = leafletHelpers;
      var _getAvailableLabelEvents = function () {
        return [
          'click',
          'dblclick',
          'mousedown',
          'mouseover',
          'mouseout',
          'contextmenu'
        ];
      };
      var genLabelEvents = function (leafletScope, logic, marker, name) {
        var labelEvents = _getAvailableLabelEvents();
        var scopeWatchName = 'markers.' + name;
        for (var i = 0; i < labelEvents.length; i++) {
          var eventName = labelEvents[i];
          marker.label.on(eventName, genDispatchLabelEvent(leafletScope, eventName, logic, marker.label, scopeWatchName));
        }
      };
      var genDispatchMarkerEvent = function (eventName, logic, leafletScope, marker, name, markerData) {
        return function (e) {
          var broadcastName = 'leafletDirectiveMarker.' + eventName;
          if (eventName === 'click') {
            safeApply(leafletScope, function () {
              $rootScope.$broadcast('leafletDirectiveMarkersClick', name);
            });
          } else if (eventName === 'dragend') {
            safeApply(leafletScope, function () {
              markerData.lat = marker.getLatLng().lat;
              markerData.lng = marker.getLatLng().lng;
            });
            if (markerData.message && markerData.focus === true) {
              marker.openPopup();
            }
          }
          safeApply(leafletScope, function (scope) {
            if (logic === 'emit') {
              scope.$emit(broadcastName, {
                markerName: name,
                leafletEvent: e
              });
            } else {
              $rootScope.$broadcast(broadcastName, {
                markerName: name,
                leafletEvent: e
              });
            }
          });
        };
      };
      var genDispatchPathEvent = function (eventName, logic, leafletScope, marker, name) {
        return function (e) {
          var broadcastName = 'leafletDirectivePath.' + eventName;
          safeApply(leafletScope, function (scope) {
            if (logic === 'emit') {
              scope.$emit(broadcastName, {
                pathName: name,
                leafletEvent: e
              });
            } else {
              $rootScope.$broadcast(broadcastName, {
                pathName: name,
                leafletEvent: e
              });
            }
          });
        };
      };
      var genDispatchLabelEvent = function (scope, eventName, logic, label, scope_watch_name) {
        return function (e) {
          var broadcastName = 'leafletDirectiveLabel.' + eventName;
          var markerName = scope_watch_name.replace('markers.', '');
          safeApply(scope, function (scope) {
            if (logic === 'emit') {
              scope.$emit(broadcastName, {
                leafletEvent: e,
                label: label,
                markerName: markerName
              });
            } else if (logic === 'broadcast') {
              $rootScope.$broadcast(broadcastName, {
                leafletEvent: e,
                label: label,
                markerName: markerName
              });
            }
          });
        };
      };
      var _getAvailableMarkerEvents = function () {
        return [
          'click',
          'dblclick',
          'mousedown',
          'mouseover',
          'mouseout',
          'contextmenu',
          'dragstart',
          'drag',
          'dragend',
          'move',
          'remove',
          'popupopen',
          'popupclose'
        ];
      };
      var _getAvailablePathEvents = function () {
        return [
          'click',
          'dblclick',
          'mousedown',
          'mouseover',
          'mouseout',
          'contextmenu',
          'add',
          'remove',
          'popupopen',
          'popupclose'
        ];
      };
      return {
        getAvailableMapEvents: function () {
          return [
            'click',
            'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'mousemove',
            'contextmenu',
            'focus',
            'blur',
            'preclick',
            'load',
            'unload',
            'viewreset',
            'movestart',
            'move',
            'moveend',
            'dragstart',
            'drag',
            'dragend',
            'zoomstart',
            'zoomend',
            'zoomlevelschange',
            'resize',
            'autopanstart',
            'layeradd',
            'layerremove',
            'baselayerchange',
            'overlayadd',
            'overlayremove',
            'locationfound',
            'locationerror',
            'popupopen',
            'popupclose',
            'draw:created',
            'draw:edited',
            'draw:deleted',
            'draw:drawstart',
            'draw:drawstop',
            'draw:editstart',
            'draw:editstop',
            'draw:deletestart',
            'draw:deletestop'
          ];
        },
        genDispatchMapEvent: function (scope, eventName, logic) {
          return function (e) {
            var broadcastName = 'leafletDirectiveMap.' + eventName;
            safeApply(scope, function (scope) {
              if (logic === 'emit') {
                scope.$emit(broadcastName, { leafletEvent: e });
              } else if (logic === 'broadcast') {
                $rootScope.$broadcast(broadcastName, { leafletEvent: e });
              }
            });
          };
        },
        getAvailableMarkerEvents: _getAvailableMarkerEvents,
        getAvailablePathEvents: _getAvailablePathEvents,
        bindMarkerEvents: function (marker, name, markerData, leafletScope) {
          var markerEvents = [];
          var i;
          var eventName;
          var logic = 'broadcast';
          if (!isDefined(leafletScope.eventBroadcast)) {
            markerEvents = _getAvailableMarkerEvents();
          } else if (!isObject(leafletScope.eventBroadcast)) {
            $log.error('[AngularJS - Leaflet] event-broadcast must be an object check your model.');
          } else {
            if (!isDefined(leafletScope.eventBroadcast.marker)) {
              markerEvents = _getAvailableMarkerEvents();
            } else if (!isObject(leafletScope.eventBroadcast.marker)) {
              $log.warn('[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.');
            } else {
              if (leafletScope.eventBroadcast.marker.logic !== undefined && leafletScope.eventBroadcast.marker.logic !== null) {
                if (leafletScope.eventBroadcast.marker.logic !== 'emit' && leafletScope.eventBroadcast.marker.logic !== 'broadcast') {
                  $log.warn('[AngularJS - Leaflet] Available event propagation logic are: \'emit\' or \'broadcast\'.');
                } else if (leafletScope.eventBroadcast.marker.logic === 'emit') {
                  logic = 'emit';
                }
              }
              var markerEventsEnable = false, markerEventsDisable = false;
              if (leafletScope.eventBroadcast.marker.enable !== undefined && leafletScope.eventBroadcast.marker.enable !== null) {
                if (typeof leafletScope.eventBroadcast.marker.enable === 'object') {
                  markerEventsEnable = true;
                }
              }
              if (leafletScope.eventBroadcast.marker.disable !== undefined && leafletScope.eventBroadcast.marker.disable !== null) {
                if (typeof leafletScope.eventBroadcast.marker.disable === 'object') {
                  markerEventsDisable = true;
                }
              }
              if (markerEventsEnable && markerEventsDisable) {
                $log.warn('[AngularJS - Leaflet] can not enable and disable events at the same time');
              } else if (!markerEventsEnable && !markerEventsDisable) {
                $log.warn('[AngularJS - Leaflet] must enable or disable events');
              } else {
                if (markerEventsEnable) {
                  for (i = 0; i < leafletScope.eventBroadcast.marker.enable.length; i++) {
                    eventName = leafletScope.eventBroadcast.marker.enable[i];
                    if (markerEvents.indexOf(eventName) !== -1) {
                      $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' is already enabled');
                    } else {
                      if (_getAvailableMarkerEvents().indexOf(eventName) === -1) {
                        $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist');
                      } else {
                        markerEvents.push(eventName);
                      }
                    }
                  }
                } else {
                  markerEvents = _getAvailableMarkerEvents();
                  for (i = 0; i < leafletScope.eventBroadcast.marker.disable.length; i++) {
                    eventName = leafletScope.eventBroadcast.marker.disable[i];
                    var index = markerEvents.indexOf(eventName);
                    if (index === -1) {
                      $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist or has been already disabled');
                    } else {
                      markerEvents.splice(index, 1);
                    }
                  }
                }
              }
            }
          }
          for (i = 0; i < markerEvents.length; i++) {
            eventName = markerEvents[i];
            marker.on(eventName, genDispatchMarkerEvent(eventName, logic, leafletScope, marker, name, markerData));
          }
          if (Helpers.LabelPlugin.isLoaded() && isDefined(marker.label)) {
            genLabelEvents(leafletScope, logic, marker, name);
          }
        },
        bindPathEvents: function (path, name, pathData, leafletScope) {
          var pathEvents = [];
          var i;
          var eventName;
          var logic = 'broadcast';
          window.lls = leafletScope;
          if (!isDefined(leafletScope.eventBroadcast)) {
            pathEvents = _getAvailablePathEvents();
          } else if (!isObject(leafletScope.eventBroadcast)) {
            $log.error('[AngularJS - Leaflet] event-broadcast must be an object check your model.');
          } else {
            if (!isDefined(leafletScope.eventBroadcast.path)) {
              pathEvents = _getAvailablePathEvents();
            } else if (isObject(leafletScope.eventBroadcast.paths)) {
              $log.warn('[AngularJS - Leaflet] event-broadcast.path must be an object check your model.');
            } else {
              if (leafletScope.eventBroadcast.path.logic !== undefined && leafletScope.eventBroadcast.path.logic !== null) {
                if (leafletScope.eventBroadcast.path.logic !== 'emit' && leafletScope.eventBroadcast.path.logic !== 'broadcast') {
                  $log.warn('[AngularJS - Leaflet] Available event propagation logic are: \'emit\' or \'broadcast\'.');
                } else if (leafletScope.eventBroadcast.path.logic === 'emit') {
                  logic = 'emit';
                }
              }
              var pathEventsEnable = false, pathEventsDisable = false;
              if (leafletScope.eventBroadcast.pats.enable !== undefined && leafletScope.eventBroadcast.path.enable !== null) {
                if (typeof leafletScope.eventBroadcast.path.enable === 'object') {
                  pathEventsEnable = true;
                }
              }
              if (leafletScope.eventBroadcast.path.disable !== undefined && leafletScope.eventBroadcast.path.disable !== null) {
                if (typeof leafletScope.eventBroadcast.path.disable === 'object') {
                  pathEventsDisable = true;
                }
              }
              if (pathEventsEnable && pathEventsDisable) {
                $log.warn('[AngularJS - Leaflet] can not enable and disable events at the same time');
              } else if (!pathEventsEnable && !pathEventsDisable) {
                $log.warn('[AngularJS - Leaflet] must enable or disable events');
              } else {
                if (pathEventsEnable) {
                  for (i = 0; i < leafletScope.eventBroadcast.path.enable.length; i++) {
                    eventName = leafletScope.eventBroadcast.path.enable[i];
                    if (pathEvents.indexOf(eventName) !== -1) {
                      $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' is already enabled');
                    } else {
                      if (_getAvailablePathEvents().indexOf(eventName) === -1) {
                        $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist');
                      } else {
                        pathEvents.push(eventName);
                      }
                    }
                  }
                } else {
                  pathEvents = _getAvailablePathEvents();
                  for (i = 0; i < leafletScope.eventBroadcast.path.disable.length; i++) {
                    eventName = leafletScope.eventBroadcast.path.disable[i];
                    var index = pathEvents.indexOf(eventName);
                    if (index === -1) {
                      $log.warn('[AngularJS - Leaflet] This event ' + eventName + ' does not exist or has been already disabled');
                    } else {
                      pathEvents.splice(index, 1);
                    }
                  }
                }
              }
            }
          }
          for (i = 0; i < pathEvents.length; i++) {
            eventName = pathEvents[i];
            path.on(eventName, genDispatchPathEvent(eventName, logic, leafletScope, pathEvents, name));
          }
          if (Helpers.LabelPlugin.isLoaded() && isDefined(path.label)) {
            genLabelEvents(leafletScope, logic, path, name);
          }
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletLayerHelpers', [
    '$rootScope',
    '$log',
    'leafletHelpers',
    function ($rootScope, $log, leafletHelpers) {
      var Helpers = leafletHelpers, isString = leafletHelpers.isString, isObject = leafletHelpers.isObject, isDefined = leafletHelpers.isDefined;
      var layerTypes = {
          xyz: {
            mustHaveUrl: true,
            createLayer: function (params) {
              return L.tileLayer(params.url, params.options);
            }
          },
          geoJSON: {
            mustHaveUrl: true,
            createLayer: function (params) {
              if (!Helpers.GeoJSONPlugin.isLoaded()) {
                return;
              }
              return new L.TileLayer.GeoJSON(params.url, params.pluginOptions, params.options);
            }
          },
          wms: {
            mustHaveUrl: true,
            createLayer: function (params) {
              return L.tileLayer.wms(params.url, params.options);
            }
          },
          wmts: {
            mustHaveUrl: true,
            createLayer: function (params) {
              return L.tileLayer.wmts(params.url, params.options);
            }
          },
          wfs: {
            mustHaveUrl: true,
            mustHaveLayer: true,
            createLayer: function (params) {
              if (!Helpers.WFSLayerPlugin.isLoaded()) {
                return;
              }
              var options = angular.copy(params.options);
              if (options.crs && 'string' === typeof options.crs) {
                options.crs = eval(options.crs);
              }
              return new L.GeoJSON.WFS(params.url, params.layer, options);
            }
          },
          group: {
            mustHaveUrl: false,
            createLayer: function () {
              return L.layerGroup();
            }
          },
          google: {
            mustHaveUrl: false,
            createLayer: function (params) {
              var type = params.type || 'SATELLITE';
              if (!Helpers.GoogleLayerPlugin.isLoaded()) {
                return;
              }
              return new L.Google(type, params.options);
            }
          },
          china: {
            mustHaveUrl: false,
            createLayer: function (params) {
              var type = params.type || '';
              if (!Helpers.ChinaLayerPlugin.isLoaded()) {
                return;
              }
              return L.tileLayer.chinaProvider(type, params.options);
            }
          },
          ags: {
            mustHaveUrl: true,
            createLayer: function (params) {
              if (!Helpers.AGSLayerPlugin.isLoaded()) {
                return;
              }
              var options = angular.copy(params.options);
              angular.extend(options, { url: params.url });
              var layer = new lvector.AGS(options);
              layer.onAdd = function (map) {
                this.setMap(map);
              };
              layer.onRemove = function () {
                this.setMap(null);
              };
              return layer;
            }
          },
          dynamic: {
            mustHaveUrl: true,
            createLayer: function (params) {
              if (!Helpers.DynamicMapLayerPlugin.isLoaded()) {
                return;
              }
              return L.esri.dynamicMapLayer(params.url, params.options);
            }
          },
          markercluster: {
            mustHaveUrl: false,
            createLayer: function (params) {
              if (!Helpers.MarkerClusterPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The markercluster plugin is not loaded.');
                return;
              }
              return new L.MarkerClusterGroup(params.options);
            }
          },
          bing: {
            mustHaveUrl: false,
            createLayer: function (params) {
              if (!Helpers.BingLayerPlugin.isLoaded()) {
                return;
              }
              return new L.BingLayer(params.key, params.options);
            }
          },
          yandex: {
            mustHaveUrl: false,
            createLayer: function (params) {
              var type = params.type || 'map';
              if (!Helpers.YandexLayerPlugin.isLoaded()) {
                return;
              }
              return new L.Yandex(type, params.options);
            }
          },
          imageOverlay: {
            mustHaveUrl: true,
            mustHaveBounds: true,
            createLayer: function (params) {
              return L.imageOverlay(params.url, params.bounds, params.options);
            }
          }
        };
      function isValidLayerType(layerDefinition) {
        if (!isString(layerDefinition.type)) {
          return false;
        }
        if (Object.keys(layerTypes).indexOf(layerDefinition.type) === -1) {
          $log.error('[AngularJS - Leaflet] A layer must have a valid type: ' + Object.keys(layerTypes));
          return false;
        }
        if (layerTypes[layerDefinition.type].mustHaveUrl && !isString(layerDefinition.url)) {
          $log.error('[AngularJS - Leaflet] A base layer must have an url');
          return false;
        }
        if (layerTypes[layerDefinition.type].mustHaveLayer && !isDefined(layerDefinition.layer)) {
          $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have an layer defined');
          return false;
        }
        if (layerTypes[layerDefinition.type].mustHaveBounds && !isDefined(layerDefinition.bounds)) {
          $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have bounds defined');
          return false;
        }
        return true;
      }
      return {
        createLayer: function (layerDefinition) {
          if (!isValidLayerType(layerDefinition)) {
            return;
          }
          if (!isString(layerDefinition.name)) {
            $log.error('[AngularJS - Leaflet] A base layer must have a name');
            return;
          }
          if (!isObject(layerDefinition.layerParams)) {
            layerDefinition.layerParams = {};
          }
          if (!isObject(layerDefinition.layerOptions)) {
            layerDefinition.layerOptions = {};
          }
          for (var attrname in layerDefinition.layerParams) {
            layerDefinition.layerOptions[attrname] = layerDefinition.layerParams[attrname];
          }
          var params = {
              url: layerDefinition.url,
              options: layerDefinition.layerOptions,
              layer: layerDefinition.layer,
              type: layerDefinition.layerType,
              bounds: layerDefinition.bounds,
              key: layerDefinition.key
            };
          return layerTypes[layerDefinition.type].createLayer(params);
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletControlHelpers', [
    '$rootScope',
    '$log',
    'leafletHelpers',
    'leafletMapDefaults',
    function ($rootScope, $log, leafletHelpers, leafletMapDefaults) {
      var isObject = leafletHelpers.isObject, isDefined = leafletHelpers.isDefined;
      var _layersControl;
      var _controlLayersMustBeVisible = function (baselayers, overlays) {
        var numberOfLayers = 0;
        if (isObject(baselayers)) {
          numberOfLayers += Object.keys(baselayers).length;
        }
        if (isObject(overlays)) {
          numberOfLayers += Object.keys(overlays).length;
        }
        return numberOfLayers > 1;
      };
      var _createLayersControl = function (mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        var controlOptions = {
            collapsed: defaults.controls.layers.collapsed,
            position: defaults.controls.layers.position
          };
        var control;
        if (defaults.controls.layers && isDefined(defaults.controls.layers.control)) {
          control = defaults.controls.layers.control.apply(this, [
            [],
            [],
            controlOptions
          ]);
        } else {
          control = new L.control.layers([], [], controlOptions);
        }
        return control;
      };
      return {
        layersControlMustBeVisible: _controlLayersMustBeVisible,
        updateLayersControl: function (map, mapId, loaded, baselayers, overlays, leafletLayers) {
          var i;
          var mustBeLoaded = _controlLayersMustBeVisible(baselayers, overlays);
          if (isDefined(_layersControl) && loaded) {
            for (i in leafletLayers.baselayers) {
              _layersControl.removeLayer(leafletLayers.baselayers[i]);
            }
            for (i in leafletLayers.overlays) {
              _layersControl.removeLayer(leafletLayers.overlays[i]);
            }
            _layersControl.removeFrom(map);
          }
          if (mustBeLoaded) {
            _layersControl = _createLayersControl(mapId);
            for (i in baselayers) {
              if (isDefined(leafletLayers.baselayers[i])) {
                _layersControl.addBaseLayer(leafletLayers.baselayers[i], baselayers[i].name);
              }
            }
            for (i in overlays) {
              if (isDefined(leafletLayers.overlays[i])) {
                _layersControl.addOverlay(leafletLayers.overlays[i], overlays[i].name);
              }
            }
            _layersControl.addTo(map);
          }
          return mustBeLoaded;
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletLegendHelpers', function () {
    var _updateArcGISLegend = function (div, legendData) {
      div.innerHTML = '';
      if (legendData.error) {
        div.innerHTML += '<div class="info-title alert alert-danger">' + legendData.error.message + '</div>';
      } else {
        for (var i = 0; i < legendData.layers.length; i++) {
          var layer = legendData.layers[i];
          div.innerHTML += '<div class="info-title">' + layer.layerName + '</div>';
          for (var j = 0; j < layer.legend.length; j++) {
            var leg = layer.legend[j];
            div.innerHTML += '<div class="inline"><img src="data:' + leg.contentType + ';base64,' + leg.imageData + '" /></div>' + '<div class="info-label">' + leg.label + '</div>';
          }
        }
      }
    };
    var _getOnAddArcGISLegend = function (legendData, legendClass) {
      return function () {
        var div = L.DomUtil.create('div', legendClass);
        if (!L.Browser.touch) {
          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
        } else {
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
        }
        _updateArcGISLegend(div, legendData);
        return div;
      };
    };
    var _getOnAddArrayLegend = function (legend, legendClass) {
      return function () {
        var div = L.DomUtil.create('div', legendClass);
        for (var i = 0; i < legend.colors.length; i++) {
          div.innerHTML += '<div class="outline"><i style="background:' + legend.colors[i] + '"></i></div>' + '<div class="info-label">' + legend.labels[i] + '</div>';
        }
        if (!L.Browser.touch) {
          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
        } else {
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
        }
        return div;
      };
    };
    return {
      getOnAddArcGISLegend: _getOnAddArcGISLegend,
      getOnAddArrayLegend: _getOnAddArrayLegend,
      updateArcGISLegend: _updateArcGISLegend
    };
  });
  angular.module('leaflet-directive').factory('leafletPathsHelpers', [
    '$rootScope',
    '$log',
    'leafletHelpers',
    function ($rootScope, $log, leafletHelpers) {
      var isDefined = leafletHelpers.isDefined, isArray = leafletHelpers.isArray, isNumber = leafletHelpers.isNumber, isValidPoint = leafletHelpers.isValidPoint;
      function _convertToLeafletLatLngs(latlngs) {
        return latlngs.filter(function (latlng) {
          return isValidPoint(latlng);
        }).map(function (latlng) {
          return new L.LatLng(latlng.lat, latlng.lng);
        });
      }
      function _convertToLeafletLatLng(latlng) {
        return new L.LatLng(latlng.lat, latlng.lng);
      }
      function _convertToLeafletMultiLatLngs(paths) {
        return paths.map(function (latlngs) {
          return _convertToLeafletLatLngs(latlngs);
        });
      }
      function _getOptions(path, defaults) {
        var availableOptions = [
            'stroke',
            'weight',
            'color',
            'opacity',
            'fill',
            'fillColor',
            'fillOpacity',
            'dashArray',
            'lineCap',
            'lineJoin',
            'clickable',
            'pointerEvents',
            'className',
            'smoothFactor',
            'noClip'
          ];
        var options = {};
        for (var i = 0; i < availableOptions.length; i++) {
          var optionName = availableOptions[i];
          if (isDefined(path[optionName])) {
            options[optionName] = path[optionName];
          } else if (isDefined(defaults.path[optionName])) {
            options[optionName] = defaults.path[optionName];
          }
        }
        return options;
      }
      var _updatePathOptions = function (path, data) {
        if (isDefined(data.weight)) {
          path.setStyle({ weight: data.weight });
        }
        if (isDefined(data.color)) {
          path.setStyle({ color: data.color });
        }
        if (isDefined(data.opacity)) {
          path.setStyle({ opacity: data.opacity });
        }
      };
      var _isValidPolyline = function (latlngs) {
        if (!isArray(latlngs)) {
          return false;
        }
        for (var i in latlngs) {
          var point = latlngs[i];
          if (!isValidPoint(point)) {
            return false;
          }
        }
        return true;
      };
      var pathTypes = {
          polyline: {
            isValid: function (pathData) {
              var latlngs = pathData.latlngs;
              return _isValidPolyline(latlngs);
            },
            createPath: function (options) {
              return new L.Polyline([], options);
            },
            setPath: function (path, data) {
              path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
              _updatePathOptions(path, data);
              return;
            }
          },
          multiPolyline: {
            isValid: function (pathData) {
              var latlngs = pathData.latlngs;
              if (!isArray(latlngs) || latlngs.length !== 2) {
                return false;
              }
              for (var i in latlngs) {
                var polyline = latlngs[i];
                if (!_isValidPolyline(polyline)) {
                  return false;
                }
              }
              return true;
            },
            createPath: function (options) {
              return new L.multiPolyline([[
                  [
                    0,
                    0
                  ],
                  [
                    1,
                    1
                  ]
                ]], options);
            },
            setPath: function (path, data) {
              path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
              _updatePathOptions(path, data);
              return;
            }
          },
          polygon: {
            isValid: function (pathData) {
              var latlngs = pathData.latlngs;
              return _isValidPolyline(latlngs);
            },
            createPath: function (options) {
              return new L.Polygon([], options);
            },
            setPath: function (path, data) {
              path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
              _updatePathOptions(path, data);
              return;
            }
          },
          multiPolygon: {
            isValid: function (pathData) {
              var latlngs = pathData.latlngs;
              if (!isArray(latlngs) || latlngs.length !== 2) {
                return false;
              }
              for (var i in latlngs) {
                var polyline = latlngs[i];
                if (!_isValidPolyline(polyline)) {
                  return false;
                }
              }
              return true;
            },
            createPath: function (options) {
              return new L.MultiPolygon([[
                  [
                    0,
                    0
                  ],
                  [
                    1,
                    1
                  ],
                  [
                    0,
                    1
                  ]
                ]], options);
            },
            setPath: function (path, data) {
              path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
              _updatePathOptions(path, data);
              return;
            }
          },
          rectangle: {
            isValid: function (pathData) {
              var latlngs = pathData.latlngs;
              if (!isArray(latlngs) || latlngs.length !== 2) {
                return false;
              }
              for (var i in latlngs) {
                var point = latlngs[i];
                if (!isValidPoint(point)) {
                  return false;
                }
              }
              return true;
            },
            createPath: function (options) {
              return new L.Rectangle([
                [
                  0,
                  0
                ],
                [
                  1,
                  1
                ]
              ], options);
            },
            setPath: function (path, data) {
              path.setBounds(new L.LatLngBounds(_convertToLeafletLatLngs(data.latlngs)));
              _updatePathOptions(path, data);
            }
          },
          circle: {
            isValid: function (pathData) {
              var point = pathData.latlngs;
              return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function (options) {
              return new L.Circle([
                0,
                0
              ], 1, options);
            },
            setPath: function (path, data) {
              path.setLatLng(_convertToLeafletLatLng(data.latlngs));
              if (isDefined(data.radius)) {
                path.setRadius(data.radius);
              }
              _updatePathOptions(path, data);
            }
          },
          circleMarker: {
            isValid: function (pathData) {
              var point = pathData.latlngs;
              return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function (options) {
              return new L.CircleMarker([
                0,
                0
              ], options);
            },
            setPath: function (path, data) {
              path.setLatLng(_convertToLeafletLatLng(data.latlngs));
              if (isDefined(data.radius)) {
                path.setRadius(data.radius);
              }
              _updatePathOptions(path, data);
            }
          }
        };
      var _getPathData = function (path) {
        var pathData = {};
        if (path.latlngs) {
          pathData.latlngs = path.latlngs;
        }
        if (path.radius) {
          pathData.radius = path.radius;
        }
        return pathData;
      };
      return {
        setPathOptions: function (leafletPath, pathType, data) {
          if (!isDefined(pathType)) {
            pathType = 'polyline';
          }
          pathTypes[pathType].setPath(leafletPath, data);
        },
        createPath: function (name, path, defaults) {
          if (!isDefined(path.type)) {
            path.type = 'polyline';
          }
          var options = _getOptions(path, defaults);
          var pathData = _getPathData(path);
          if (!pathTypes[path.type].isValid(pathData)) {
            $log.error('[AngularJS - Leaflet] Invalid data passed to the ' + path.type + ' path');
            return;
          }
          return pathTypes[path.type].createPath(options);
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletBoundsHelpers', [
    '$log',
    'leafletHelpers',
    function ($log, leafletHelpers) {
      var isArray = leafletHelpers.isArray, isNumber = leafletHelpers.isNumber;
      function _isValidBounds(bounds) {
        return angular.isDefined(bounds) && angular.isDefined(bounds.southWest) && angular.isDefined(bounds.northEast) && angular.isNumber(bounds.southWest.lat) && angular.isNumber(bounds.southWest.lng) && angular.isNumber(bounds.northEast.lat) && angular.isNumber(bounds.northEast.lng);
      }
      return {
        createLeafletBounds: function (bounds) {
          if (_isValidBounds(bounds)) {
            return L.latLngBounds([
              bounds.southWest.lat,
              bounds.southWest.lng
            ], [
              bounds.northEast.lat,
              bounds.northEast.lng
            ]);
          } else {
            return false;
          }
        },
        isValidBounds: _isValidBounds,
        createBoundsFromArray: function (boundsArray) {
          if (!(isArray(boundsArray) && boundsArray.length === 2 && isArray(boundsArray[0]) && isArray(boundsArray[1]) && boundsArray[0].length === 2 && boundsArray[1].length === 2 && isNumber(boundsArray[0][0]) && isNumber(boundsArray[0][1]) && isNumber(boundsArray[1][0]) && isNumber(boundsArray[1][1]))) {
            $log.error('[AngularJS - Leaflet] The bounds array is not valid.');
            return;
          }
          return {
            northEast: {
              lat: boundsArray[0][0],
              lng: boundsArray[0][1]
            },
            southWest: {
              lat: boundsArray[1][0],
              lng: boundsArray[1][1]
            }
          };
        },
        updateBoundsInScope: function (leafletScope, map) {
          var mapBounds = map.getBounds();
          var newScopeBounds = {
              northEast: {
                lat: mapBounds.getNorthEast().lat,
                lng: mapBounds.getNorthEast().lng
              },
              southWest: {
                lat: mapBounds.getSouthWest().lat,
                lng: mapBounds.getSouthWest().lng
              }
            };
          if (!angular.equals(leafletScope.bounds, newScopeBounds)) {
            leafletScope.bounds = newScopeBounds;
          }
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletMarkersHelpers', [
    '$rootScope',
    'leafletHelpers',
    '$log',
    function ($rootScope, leafletHelpers, $log) {
      var isDefined = leafletHelpers.isDefined, MarkerClusterPlugin = leafletHelpers.MarkerClusterPlugin, AwesomeMarkersPlugin = leafletHelpers.AwesomeMarkersPlugin, safeApply = leafletHelpers.safeApply, Helpers = leafletHelpers, isString = leafletHelpers.isString, isNumber = leafletHelpers.isNumber, isObject = leafletHelpers.isObject, groups = {};
      var createLeafletIcon = function (iconData) {
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'awesomeMarker') {
          if (!AwesomeMarkersPlugin.isLoaded()) {
            $log.error('[AngularJS - Leaflet] The AwesomeMarkers Plugin is not loaded.');
          }
          return new L.AwesomeMarkers.icon(iconData);
        }
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'div') {
          return new L.divIcon(iconData);
        }
        var base64icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAGmklEQVRYw7VXeUyTZxjvNnfELFuyIzOabermMZEeQC/OclkO49CpOHXOLJl/CAURuYbQi3KLgEhbrhZ1aDwmaoGqKII6odATmH/scDFbdC7LvFqOCc+e95s2VG50X/LLm/f4/Z7neY/ne18aANCmAr5E/xZf1uDOkTcGcWR6hl9247tT5U7Y6SNvWsKT63P58qbfeLJG8M5qcgTknrvvrdDbsT7Ml+tv82X6vVxJE33aRmgSyYtcWVMqX97Yv2JvW39UhRE2HuyBL+t+gK1116ly06EeWFNlAmHxlQE0OMiV6mQCScusKRlhS3QLeVJdl1+23h5dY4FNB3thrbYboqptEFlphTC1hSpJnbRvxP4NWgsE5Jyz86QNNi/5qSUTGuFk1gu54tN9wuK2wc3o+Wc13RCmsoBwEqzGcZsxsvCSy/9wJKf7UWf1mEY8JWfewc67UUoDbDjQC+FqK4QqLVMGGR9d2wurKzqBk3nqIT/9zLxRRjgZ9bqQgub+DdoeCC03Q8j+0QhFhBHR/eP3U/zCln7Uu+hihJ1+bBNffLIvmkyP0gpBZWYXhKussK6mBz5HT6M1Nqpcp+mBCPXosYQfrekGvrjewd59/GvKCE7TbK/04/ZV5QZYVWmDwH1mF3xa2Q3ra3DBC5vBT1oP7PTj4C0+CcL8c7C2CtejqhuCnuIQHaKHzvcRfZpnylFfXsYJx3pNLwhKzRAwAhEqG0SpusBHfAKkxw3w4627MPhoCH798z7s0ZnBJ/MEJbZSbXPhER2ih7p2ok/zSj2cEJDd4CAe+5WYnBCgR2uruyEw6zRoW6/DWJ/OeAP8pd/BGtzOZKpG8oke0SX6GMmRk6GFlyAc59K32OTEinILRJRchah8HQwND8N435Z9Z0FY1EqtxUg+0SO6RJ/mmXz4VuS+DpxXC3gXmZwIL7dBSH4zKE50wESf8qwVgrP1EIlTO5JP9Igu0aexdh28F1lmAEGJGfh7jE6ElyM5Rw/FDcYJjWhbeiBYoYNIpc2FT/SILivp0F1ipDWk4BIEo2VuodEJUifhbiltnNBIXPUFCMpthtAyqws/BPlEF/VbaIxErdxPphsU7rcCp8DohC+GvBIPJS/tW2jtvTmmAeuNO8BNOYQeG8G/2OzCJ3q+soYB5i6NhMaKr17FSal7GIHheuV3uSCY8qYVuEm1cOzqdWr7ku/R0BDoTT+DT+ohCM6/CCvKLKO4RI+dXPeAuaMqksaKrZ7L3FE5FIFbkIceeOZ2OcHO6wIhTkNo0ffgjRGxEqogXHYUPHfWAC/lADpwGcLRY3aeK4/oRGCKYcZXPVoeX/kelVYY8dUGf8V5EBRbgJXT5QIPhP9ePJi428JKOiEYhYXFBqou2Guh+p/mEB1/RfMw6rY7cxcjTrneI1FrDyuzUSRm9miwEJx8E/gUmqlyvHGkneiwErR21F3tNOK5Tf0yXaT+O7DgCvALTUBXdM4YhC/IawPU+2PduqMvuaR6eoxSwUk75ggqsYJ7VicsnwGIkZBSXKOUww73WGXyqP+J2/b9c+gi1YAg/xpwck3gJuucNrh5JvDPvQr0WFXf0piyt8f8/WI0hV4pRxxkQZdJDfDJNOAmM0Ag8jyT6hz0WGXWuP94Yh2jcfjmXAGvHCMslRimDHYuHuDsy2QtHuIavznhbYURq5R57KpzBBRZKPJi8eQg48h4j8SDdowifdIrEVdU+gbO6QNvRRt4ZBthUaZhUnjlYObNagV3keoeru3rU7rcuceqU1mJBxy+BWZYlNEBH+0eH4vRiB+OYybU2hnblYlTvkHinM4m54YnxSyaZYSF6R3jwgP7udKLGIX6r/lbNa9N6y5MFynjWDtrHd75ZvTYAPO/6RgF0k76mQla3FGq7dO+cH8sKn0Vo7nDllwAhqwLPkxrHwWmHJOo+AKJ4rab5OgrM7rVu8eWb2Pu0Dh4eDgXoOfvp7Y7QeqknRmvcTBEyq9m/HQQSCSz6LHq3z0yzsNySRfMS253wl2KyRDbcZPcfJKjZmSEOjcxyi+Y8dUOtsIEH6R2wNykdqrkYJ0RV92H0W58pkfQk7cKevsLK10Py8SdMGfXNXATY+pPbyJR/ET6n9nIfztNtZYRV9XniQu9IA2vOVgy4ir7GCLVmmd+zjkH0eAF9Po6K61pmCXHxU5rHMYd1ftc3owjwRSVRzLjKvqZEty6cRUD7jGqiOdu5HG6MdHjNcNYGqfDm5YRzLBBCCDl/2bk8a8gdbqcfwECu62Fg/HrggAAAABJRU5ErkJggg==';
        var base64shadow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=';
        if (!isDefined(iconData)) {
          return new L.Icon.Default({
            iconUrl: base64icon,
            shadowUrl: base64shadow
          });
        }
        if (!isDefined(iconData.iconUrl)) {
          iconData.iconUrl = base64icon;
          iconData.shadowUrl = base64shadow;
        }
        return new L.Icon.Default(iconData);
      };
      var _deleteMarker = function (marker, map, layers) {
        marker.closePopup();
        if (isDefined(layers) && isDefined(layers.overlays)) {
          for (var key in layers.overlays) {
            if (layers.overlays[key] instanceof L.LayerGroup) {
              if (layers.overlays[key].hasLayer(marker)) {
                layers.overlays[key].removeLayer(marker);
                return;
              }
            }
          }
        }
        if (isDefined(groups)) {
          for (var groupKey in groups) {
            if (groups[groupKey].hasLayer(marker)) {
              groups[groupKey].removeLayer(marker);
            }
          }
        }
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      };
      return {
        deleteMarker: _deleteMarker,
        createMarker: function (markerData) {
          if (!isDefined(markerData)) {
            $log.error('[AngularJS - Leaflet] The marker definition is not valid.');
            return;
          }
          var markerOptions = {
              icon: createLeafletIcon(markerData.icon),
              title: isDefined(markerData.title) ? markerData.title : '',
              draggable: isDefined(markerData.draggable) ? markerData.draggable : false,
              clickable: isDefined(markerData.clickable) ? markerData.clickable : true,
              riseOnHover: isDefined(markerData.riseOnHover) ? markerData.riseOnHover : false,
              zIndexOffset: isDefined(markerData.zIndexOffset) ? markerData.zIndexOffset : 0,
              iconAngle: isDefined(markerData.iconAngle) ? markerData.iconAngle : 0
            };
          return new L.marker(markerData, markerOptions);
        },
        addMarkerToGroup: function (marker, groupName, map) {
          if (!isString(groupName)) {
            $log.error('[AngularJS - Leaflet] The marker group you have specified is invalid.');
            return;
          }
          if (!MarkerClusterPlugin.isLoaded()) {
            $log.error('[AngularJS - Leaflet] The MarkerCluster plugin is not loaded.');
            return;
          }
          if (!isDefined(groups[groupName])) {
            groups[groupName] = new L.MarkerClusterGroup();
            map.addLayer(groups[groupName]);
          }
          groups[groupName].addLayer(marker);
        },
        listenMarkerEvents: function (marker, markerData, leafletScope) {
          marker.on('popupopen', function () {
            safeApply(leafletScope, function () {
              markerData.focus = true;
            });
          });
          marker.on('popupclose', function () {
            safeApply(leafletScope, function () {
              markerData.focus = false;
            });
          });
        },
        addMarkerWatcher: function (marker, name, leafletScope, layers, map) {
          var clearWatch = leafletScope.$watch('markers.' + name, function (markerData, oldMarkerData) {
              if (!isDefined(markerData)) {
                _deleteMarker(marker, map, layers);
                clearWatch();
                return;
              }
              if (!isDefined(oldMarkerData)) {
                return;
              }
              if (!(isNumber(markerData.lat) && isNumber(markerData.lng))) {
                $log.warn('There are problems with lat-lng data, please verify your marker model');
                _deleteMarker(marker, map, layers);
                return;
              }
              if (!isString(markerData.layer)) {
                if (isString(oldMarkerData.layer)) {
                  if (isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                    layers.overlays[oldMarkerData.layer].removeLayer(marker);
                    marker.closePopup();
                  }
                  if (!map.hasLayer(marker)) {
                    map.addLayer(marker);
                  }
                }
              }
              if (isString(markerData.layer) && (isDefined(oldMarkerData.layer) || oldMarkerData.layer !== markerData.layer)) {
                if (isString(oldMarkerData.layer) && isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                  layers.overlays[oldMarkerData.layer].removeLayer(marker);
                }
                marker.closePopup();
                if (map.hasLayer(marker)) {
                  map.removeLayer(marker);
                }
                if (!isDefined(layers.overlays[markerData.layer])) {
                  $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                  return;
                }
                var layerGroup = layers.overlays[markerData.layer];
                if (!(layerGroup instanceof L.LayerGroup)) {
                  $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                  return;
                }
                layerGroup.addLayer(marker);
                if (map.hasLayer(marker) && markerData.focus === true) {
                  marker.openPopup();
                }
              }
              if (markerData.draggable !== true && oldMarkerData.draggable === true && (marker.dragging !== undefined && marker.dragging !== null)) {
                marker.dragging.disable();
              }
              if (markerData.draggable === true && oldMarkerData.draggable !== true) {
                if (marker.dragging) {
                  marker.dragging.enable();
                } else {
                  if (L.Handler.MarkerDrag) {
                    marker.dragging = new L.Handler.MarkerDrag(marker);
                    marker.options.draggable = true;
                    marker.dragging.enable();
                  }
                }
              }
              if (!isObject(markerData.icon)) {
                if (isObject(oldMarkerData.icon)) {
                  marker.setIcon(createLeafletIcon());
                  marker.closePopup();
                  marker.unbindPopup();
                  if (isString(markerData.message)) {
                    marker.bindPopup(markerData.message);
                  }
                }
              }
              if (isObject(markerData.icon) && isObject(oldMarkerData.icon) && !angular.equals(markerData.icon, oldMarkerData.icon)) {
                var dragG = false;
                if (marker.dragging) {
                  dragG = marker.dragging.enabled();
                }
                marker.setIcon(createLeafletIcon(markerData.icon));
                if (dragG) {
                  marker.dragging.enable();
                }
                marker.closePopup();
                marker.unbindPopup();
                if (isString(markerData.message)) {
                  marker.bindPopup(markerData.message);
                }
              }
              if (!isString(markerData.message) && isString(oldMarkerData.message)) {
                marker.closePopup();
                marker.unbindPopup();
              }
              if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message) && !angular.equals(markerData.label.message, oldMarkerData.label.message)) {
                marker.updateLabelContent(markerData.label.message);
              }
              if (isString(markerData.message) && !isString(oldMarkerData.message)) {
                marker.bindPopup(markerData.message);
                if (markerData.focus === true) {
                  marker.openPopup();
                }
              }
              if (isString(markerData.message) && isString(oldMarkerData.message) && markerData.message !== oldMarkerData.message) {
                marker.setPopupContent(markerData.message);
              }
              if (markerData.focus !== true && oldMarkerData.focus === true) {
                marker.closePopup();
              }
              if (markerData.focus === true && oldMarkerData.focus !== true) {
                marker.openPopup();
              }
              if (oldMarkerData.focus === true && markerData.focus === true) {
                marker.openPopup();
              }
              var markerLatLng = marker.getLatLng();
              if (markerLatLng.lat !== markerData.lat || markerLatLng.lng !== markerData.lng) {
                var isCluster = false;
                if (isString(markerData.layer) && Helpers.MarkerClusterPlugin.is(layers.overlays[markerData.layer])) {
                  layers.overlays[markerData.layer].removeLayer(marker);
                  isCluster = true;
                }
                marker.setLatLng([
                  markerData.lat,
                  markerData.lng
                ]);
                if (isCluster) {
                  layers.overlays[markerData.layer].addLayer(marker);
                }
              }
            }, true);
        }
      };
    }
  ]);
  angular.module('leaflet-directive').factory('leafletHelpers', [
    '$q',
    '$log',
    function ($q, $log) {
      function _obtainEffectiveMapId(d, mapId) {
        var id, i;
        if (!angular.isDefined(mapId)) {
          if (Object.keys(d).length === 1) {
            for (i in d) {
              if (d.hasOwnProperty(i)) {
                id = i;
              }
            }
          } else if (Object.keys(d).length === 0) {
            id = 'main';
          } else {
            $log.error('[AngularJS - Leaflet] - You have more than 1 map on the DOM, you must provide the map ID to the leafletData.getXXX call');
          }
        } else {
          id = mapId;
        }
        return id;
      }
      function _getUnresolvedDefer(d, mapId) {
        var id = _obtainEffectiveMapId(d, mapId), defer;
        if (!angular.isDefined(d[id]) || d[id].resolvedDefer === true) {
          defer = $q.defer();
          d[id] = {
            defer: defer,
            resolvedDefer: false
          };
        } else {
          defer = d[id].defer;
        }
        return defer;
      }
      return {
        isDefined: function (value) {
          return angular.isDefined(value) && value !== null;
        },
        isNumber: function (value) {
          return angular.isNumber(value);
        },
        isString: function (value) {
          return angular.isString(value);
        },
        isArray: function (value) {
          return angular.isArray(value);
        },
        isObject: function (value) {
          return angular.isObject(value);
        },
        isFunction: function (value) {
          return angular.isFunction(value);
        },
        equals: function (o1, o2) {
          return angular.equals(o1, o2);
        },
        isValidCenter: function (center) {
          return angular.isDefined(center) && angular.isNumber(center.lat) && angular.isNumber(center.lng) && angular.isNumber(center.zoom);
        },
        isValidPoint: function (point) {
          return angular.isDefined(point) && angular.isNumber(point.lat) && angular.isNumber(point.lng);
        },
        safeApply: function ($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            $scope.$eval(fn);
          } else {
            $scope.$apply(fn);
          }
        },
        obtainEffectiveMapId: _obtainEffectiveMapId,
        getDefer: function (d, mapId) {
          var id = _obtainEffectiveMapId(d, mapId), defer;
          if (!angular.isDefined(d[id]) || d[id].resolvedDefer === false) {
            defer = _getUnresolvedDefer(d, mapId);
          } else {
            defer = d[id].defer;
          }
          return defer;
        },
        getUnresolvedDefer: _getUnresolvedDefer,
        setResolvedDefer: function (d, mapId) {
          var id = _obtainEffectiveMapId(d, mapId);
          d[id].resolvedDefer = true;
        },
        AwesomeMarkersPlugin: {
          isLoaded: function () {
            if (angular.isDefined(L.AwesomeMarkers) && angular.isDefined(L.AwesomeMarkers.Icon)) {
              return true;
            } else {
              return false;
            }
          },
          is: function (icon) {
            if (this.isLoaded()) {
              return icon instanceof L.AwesomeMarkers.Icon;
            } else {
              return false;
            }
          },
          equal: function (iconA, iconB) {
            if (!this.isLoaded()) {
              return false;
            }
            if (this.is(iconA)) {
              return angular.equals(iconA, iconB);
            } else {
              return false;
            }
          }
        },
        LabelPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.Label);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.MarkerClusterGroup;
            } else {
              return false;
            }
          }
        },
        MarkerClusterPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.MarkerClusterGroup);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.MarkerClusterGroup;
            } else {
              return false;
            }
          }
        },
        GoogleLayerPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.Google);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.Google;
            } else {
              return false;
            }
          }
        },
        ChinaLayerPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.tileLayer.chinaProvider);
          }
        },
        BingLayerPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.BingLayer);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.BingLayer;
            } else {
              return false;
            }
          }
        },
        WFSLayerPlugin: {
          isLoaded: function () {
            return L.GeoJSON.WFS !== undefined;
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.GeoJSON.WFS;
            } else {
              return false;
            }
          }
        },
        AGSLayerPlugin: {
          isLoaded: function () {
            return lvector !== undefined && lvector.AGS !== undefined;
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof lvector.AGS;
            } else {
              return false;
            }
          }
        },
        YandexLayerPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.Yandex);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.Yandex;
            } else {
              return false;
            }
          }
        },
        DynamicMapLayerPlugin: {
          isLoaded: function () {
            return L.esri !== undefined && L.esri.dynamicMapLayer !== undefined;
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.esri.dynamicMapLayer;
            } else {
              return false;
            }
          }
        },
        GeoJSONPlugin: {
          isLoaded: function () {
            return angular.isDefined(L.TileLayer.GeoJSON);
          },
          is: function (layer) {
            if (this.isLoaded()) {
              return layer instanceof L.TileLayer.GeoJSON;
            } else {
              return false;
            }
          }
        },
        Leaflet: {
          DivIcon: {
            is: function (icon) {
              return icon instanceof L.DivIcon;
            },
            equal: function (iconA, iconB) {
              if (this.is(iconA)) {
                return angular.equals(iconA, iconB);
              } else {
                return false;
              }
            }
          },
          Icon: {
            is: function (icon) {
              return icon instanceof L.Icon;
            },
            equal: function (iconA, iconB) {
              if (this.is(iconA)) {
                return angular.equals(iconA, iconB);
              } else {
                return false;
              }
            }
          }
        }
      };
    }
  ]);
}());