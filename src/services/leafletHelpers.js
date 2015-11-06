angular.module('leaflet-directive').service('leafletHelpers', function($q, $log) {
  var _errorHeader = '[AngularJS - Leaflet] ';
  var _copy = angular.copy;
  var _clone = _copy;
  /*
  For parsing paths to a field in an object

  Example:
  var obj = {
      bike:{
       1: 'hi'
       2: 'foo'
      }
  };
  _getObjectValue(obj,"bike.1") returns 'hi'
  this is getPath in ui-gmap
   */
  var _getObjectValue = function(object, pathStr) {
    var obj;
    if (!object || !angular.isObject(object))
        return;

    //if the key is not a sting then we already have the value
    if ((pathStr === null) || !angular.isString(pathStr)) {
      return pathStr;
    }

    obj = object;
    pathStr.split('.').forEach(function(value) {
      if (obj) {
        obj = obj[value];
      }
    });

    return obj;
  };

  /*
   Object Array Notation
   _getObjectArrayPath("bike.one.two")
   returns:
   'bike["one"]["two"]'
   */
  var _getObjectArrayPath = function(pathStr) {
    return pathStr.split('.').reduce(function(previous, current) {
      return previous + '["' + current + '"]';
    });
  };

  /* Object Dot Notation
   _getObjectPath(["bike","one","two"])
   returns:
   "bike.one.two"
   */
  var _getObjectDotPath = function(arrayOfStrings) {
    return arrayOfStrings.reduce(function(previous, current) {
      return previous + '.' + current;
    });
  };

  function _obtainEffectiveMapId(d, mapId) {
    var id;
    var i;
    if (!angular.isDefined(mapId)) {
      if (Object.keys(d).length === 0) {
        id = 'main';
      } else if (Object.keys(d).length >= 1) {
        for (i in d) {
          if (d.hasOwnProperty(i)) {
            id = i;
          }
        }
      } else {
        $log.error(_errorHeader + '- You have more than 1 map on the DOM, you must provide the map ID to the leafletData.getXXX call');
      }
    } else {
      id = mapId;
    }

    return id;
  }

  function _getUnresolvedDefer(d, mapId) {
    var id = _obtainEffectiveMapId(d, mapId);
    var defer;

    if (!angular.isDefined(d[id]) || d[id].resolvedDefer === true) {
      defer = $q.defer();
      d[id] = {
        defer: defer,
        resolvedDefer: false,
      };
    } else {
      defer = d[id].defer;
    }

    return defer;
  }

  var _isDefined = function(value) {
    return angular.isDefined(value) && value !== null;
  };

  var _isUndefined = function(value) {
    return !_isDefined(value);
  };

  // BEGIN DIRECT PORT FROM AngularJS code base

  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

  var MOZ_HACK_REGEXP = /^moz([A-Z])/;

  var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;

  /**
  Converts snake_case to camelCase.
  Also there is special case for Moz prefix starting with upper case letter.
  @param name Name to normalize
   */

  var camelCase = function(name) {
      return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        if (offset) {
          return letter.toUpperCase();
        } else {
          return letter;
        }
      }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    };

  /**
  Converts all accepted directives format into proper directive name.
  @param name Name to normalize
   */

  var directiveNormalize = function(name) {
      return camelCase(name.replace(PREFIX_REGEXP, ''));
    };

  // END AngularJS port

  return {
    camelCase: camelCase,
    directiveNormalize: directiveNormalize,
    copy:_copy,
    clone:_clone,
    errorHeader: _errorHeader,
    getObjectValue: _getObjectValue,
    getObjectArrayPath:_getObjectArrayPath,
    getObjectDotPath: _getObjectDotPath,
    defaultTo: function(val, _default) {
      return _isDefined(val) ? val : _default;
    },

    //mainly for checking attributes of directives lets keep this minimal (on what we accept)
    isTruthy: function(val) {
      return val === 'true' || val === true;
    },

    //Determine if a reference is {}
    isEmpty: function(value) {
      return Object.keys(value).length === 0;
    },

    //Determine if a reference is undefined or {}
    isUndefinedOrEmpty: function(value) {
      return (angular.isUndefined(value) || value === null) || Object.keys(value).length === 0;
    },

    // Determine if a reference is defined
    isDefined: _isDefined,
    isUndefined:_isUndefined,
    isNumber: angular.isNumber,
    isString: angular.isString,
    isArray: angular.isArray,
    isObject: angular.isObject,
    isFunction: angular.isFunction,
    equals: angular.equals,

    isValidCenter: function(center) {
      return angular.isDefined(center) && angular.isNumber(center.lat) &&
             angular.isNumber(center.lng) && angular.isNumber(center.zoom);
    },

    isValidPoint: function(point) {
      if (!angular.isDefined(point)) {
        return false;
      }

      if (angular.isArray(point)) {
        return point.length === 2 && angular.isNumber(point[0]) && angular.isNumber(point[1]);
      }

      return angular.isNumber(point.lat) && angular.isNumber(point.lng);
    },

    isSameCenterOnMap: function(centerModel, map) {
      var mapCenter = map.getCenter();
      var zoom = map.getZoom();
      if (centerModel.lat && centerModel.lng &&
          mapCenter.lat.toFixed(4) === centerModel.lat.toFixed(4) &&
          mapCenter.lng.toFixed(4) === centerModel.lng.toFixed(4) &&
          zoom === centerModel.zoom) {
        return true;
      }

      return false;
    },

    safeApply: function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        $scope.$eval(fn);
      } else {
        $scope.$evalAsync(fn);
      }
    },

    obtainEffectiveMapId: _obtainEffectiveMapId,

    getDefer: function(d, mapId) {
      var id = _obtainEffectiveMapId(d, mapId);
      var defer;
      if (!angular.isDefined(d[id]) || d[id].resolvedDefer === false) {
        defer = _getUnresolvedDefer(d, mapId);
      } else {
        defer = d[id].defer;
      }

      return defer;
    },

    getUnresolvedDefer: _getUnresolvedDefer,

    setResolvedDefer: function(d, mapId) {
      var id = _obtainEffectiveMapId(d, mapId);
      d[id].resolvedDefer = true;
    },

    rangeIsSupported: function() {
      var testrange = document.createElement('input');
      testrange.setAttribute('type', 'range');
      return testrange.type === 'range';
    },

    FullScreenControlPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.Control.Fullscreen);
      },
    },

    MiniMapControlPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.Control.MiniMap);
      },
    },

    AwesomeMarkersPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.AwesomeMarkers) && angular.isDefined(L.AwesomeMarkers.Icon);
      },

      is: function(icon) {
        if (this.isLoaded()) {
          return icon instanceof L.AwesomeMarkers.Icon;
        } else {
          return false;
        }
      },

      equal: function(iconA, iconB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(iconA)) {
          return angular.equals(iconA, iconB);
        } else {
          return false;
        }
      },
    },

    VectorMarkersPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.VectorMarkers) && angular.isDefined(L.VectorMarkers.Icon);
      },

      is: function(icon) {
        if (this.isLoaded()) {
          return icon instanceof L.VectorMarkers.Icon;
        } else {
          return false;
        }
      },

      equal: function(iconA, iconB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(iconA)) {
          return angular.equals(iconA, iconB);
        } else {
          return false;
        }
      },
    },

    DomMarkersPlugin: {
      isLoaded: function() {
        if (angular.isDefined(L.DomMarkers) && angular.isDefined(L.DomMarkers.Icon)) {
          return true;
        } else {
          return false;
        }
      },

      is: function(icon) {
        if (this.isLoaded()) {
          return icon instanceof L.DomMarkers.Icon;
        } else {
          return false;
        }
      },

      equal: function(iconA, iconB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(iconA)) {
          return angular.equals(iconA, iconB);
        } else {
          return false;
        }
      },
    },

    PolylineDecoratorPlugin: {
      isLoaded: function() {
        if (angular.isDefined(L.PolylineDecorator)) {
          return true;
        } else {
          return false;
        }
      },

      is: function(decoration) {
        if (this.isLoaded()) {
          return decoration instanceof L.PolylineDecorator;
        } else {
          return false;
        }
      },

      equal: function(decorationA, decorationB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(decorationA)) {
          return angular.equals(decorationA, decorationB);
        } else {
          return false;
        }
      },
    },

    MakiMarkersPlugin: {
      isLoaded: function() {
        if (angular.isDefined(L.MakiMarkers) && angular.isDefined(L.MakiMarkers.Icon)) {
          return true;
        } else {
          return false;
        }
      },

      is: function(icon) {
        if (this.isLoaded()) {
          return icon instanceof L.MakiMarkers.Icon;
        } else {
          return false;
        }
      },

      equal: function(iconA, iconB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(iconA)) {
          return angular.equals(iconA, iconB);
        } else {
          return false;
        }
      },
    },
    ExtraMarkersPlugin: {
      isLoaded: function() {
        if (angular.isDefined(L.ExtraMarkers) && angular.isDefined(L.ExtraMarkers.Icon)) {
          return true;
        } else {
          return false;
        }
      },

      is: function(icon) {
        if (this.isLoaded()) {
          return icon instanceof L.ExtraMarkers.Icon;
        } else {
          return false;
        }
      },

      equal: function(iconA, iconB) {
        if (!this.isLoaded()) {
          return false;
        }

        if (this.is(iconA)) {
          return angular.equals(iconA, iconB);
        } else {
          return false;
        }
      },
    },
    LabelPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.Label);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.MarkerClusterGroup;
        } else {
          return false;
        }
      },
    },
    MarkerClusterPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.MarkerClusterGroup);
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
        return angular.isDefined(L.Google);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.Google;
        } else {
          return false;
        }
      },
    },
    LeafletProviderPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.TileLayer.Provider);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.TileLayer.Provider;
        } else {
          return false;
        }
      },
    },
    ChinaLayerPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.tileLayer.chinaProvider);
      },
    },
    HeatLayerPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.heatLayer);
      },
    },
    WebGLHeatMapLayerPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.TileLayer.WebGLHeatMap);
      },
    },
    BingLayerPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.BingLayer);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.BingLayer;
        } else {
          return false;
        }
      },
    },
    WFSLayerPlugin: {
      isLoaded: function() {
        return L.GeoJSON.WFS !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.GeoJSON.WFS;
        } else {
          return false;
        }
      },
    },
    AGSBaseLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.basemapLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.basemapLayer;
        } else {
          return false;
        }
      },
    },
    AGSLayerPlugin: {
      isLoaded: function() {
        return lvector !== undefined && lvector.AGS !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof lvector.AGS;
        } else {
          return false;
        }
      },
    },
    AGSFeatureLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.featureLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.featureLayer;
        } else {
          return false;
        }
      },
    },
    AGSTiledMapLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.tiledMapLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.tiledMapLayer;
        } else {
          return false;
        }
      },
    },
    AGSDynamicMapLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.dynamicMapLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.dynamicMapLayer;
        } else {
          return false;
        }
      },
    },
    AGSImageMapLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.imageMapLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.imageMapLayer;
        } else {
          return false;
        }
      },
    },
    AGSClusteredLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.clusteredFeatureLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.clusteredFeatureLayer;
        } else {
          return false;
        }
      },
    },
    AGSHeatmapLayerPlugin: {
      isLoaded: function() {
        return L.esri !== undefined && L.esri.heatmapFeatureLayer !== undefined;
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.esri.heatmapFeatureLayer;
        } else {
          return false;
        }
      },
    },
    YandexLayerPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.Yandex);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.Yandex;
        } else {
          return false;
        }
      },
    },
    GeoJSONPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.TileLayer.GeoJSON);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.TileLayer.GeoJSON;
        } else {
          return false;
        }
      },
    },
    UTFGridPlugin: {
      isLoaded: function() {
        return angular.isDefined(L.UtfGrid);
      },

      is: function(layer) {
        if (this.isLoaded()) {
          return layer instanceof L.UtfGrid;
        } else {
          $log.error('[AngularJS - Leaflet] No UtfGrid plugin found.');
          return false;
        }
      },
    },
    CartoDB: {
      isLoaded: function() {
        return cartodb;
      },

      is: function(/*layer*/) {
        return true;
        /*
        if (this.isLoaded()) {
            return layer instanceof L.TileLayer.GeoJSON;
        } else {
            return false;
        }*/
      },
    },
    Leaflet: {
      DivIcon: {
        is: function(icon) {
          return icon instanceof L.DivIcon;
        },

        equal: function(iconA, iconB) {
          if (this.is(iconA)) {
            return angular.equals(iconA, iconB);
          } else {
            return false;
          }
        },
      },
      Icon: {
        is: function(icon) {
          return icon instanceof L.Icon;
        },

        equal: function(iconA, iconB) {
          if (this.is(iconA)) {
            return angular.equals(iconA, iconB);
          } else {
            return false;
          }
        },
      },
    },
    /*
     watchOptions - object to set deep nested watches and turn off watches all together
     (rely on control / functional updates)
     watchOptions - Object
         doWatch:boolean
         isDeep:boolean (sets $watch(function,isDeep))
         individual
             doWatch:boolean
             isDeep:boolean
     */

    //legacy defaults
    watchOptions: {
      doWatch:true,
      isDeep: true,
      individual:{
        doWatch:true,
        isDeep: true,
      },
    },
  };
});
