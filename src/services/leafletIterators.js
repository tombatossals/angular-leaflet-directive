angular.module('leaflet-directive').service('leafletIterators', function($log, leafletHelpers) {

  var lHlp = leafletHelpers;
  var errorHeader = leafletHelpers.errorHeader + 'leafletIterators: ';

  //BEGIN COPY from underscore
  var _keys = Object.keys;
  var _isFunction = lHlp.isFunction;
  var _isObject = lHlp.isObject;

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  var _isArrayLike = function(collection) {
    var length = collection !== null && collection.length;
    return lHlp.isNumber(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Keep the identity function around for default iteratees.
  var _identity = function(value) {
    return value;
  };

  var _property = function(key) {
    return function(obj) {
      return obj === null ? void 0 : obj[key];
    };
  };

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount === null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };

      case 2: return function(value, other) {
        return func.call(context, value, other);
      };

      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };

      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj === null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index];
        var keys = keysFunc(source);
        var l = keys.length;

        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }

      return obj;
    };
  };

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var _extendOwn;
  var _assign = null;
  _extendOwn = _assign = createAssigner(_keys);

  // Returns whether an object has a given set of `key:value` pairs.
  var _isMatch = function(object, attrs) {
    var keys = _keys(attrs);
    var length = keys.length;
    if (object === null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }

    return true;
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  var _matcher;
  var _matches = null;
  _matcher = _matches = function(attrs) {
    attrs = _extendOwn({}, attrs);
    return function(obj) {
      return _isMatch(obj, attrs);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value === null) return _identity;
    if (_isFunction(value)) return optimizeCb(value, context, argCount);
    if (_isObject(value)) return _matcher(value);
    return _property(value);
  };

  var _every;
  var _all = null;
  _every = _all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !_isArrayLike(obj) && _keys(obj);
    var length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }

    return true;
  };

  //END COPY fron underscore

  var _hasErrors = function(collection, cb, ignoreCollection, cbName) {
    if (!ignoreCollection) {
      if (!lHlp.isDefined(collection) || !lHlp.isDefined(cb)) {
        return true;
      }
    }

    if (!lHlp.isFunction(cb)) {
      cbName = lHlp.defaultTo(cb, 'cb');
      $log.error(errorHeader + cbName + ' is not a function');
      return true;
    }

    return false;
  };

  var _iterate = function(collection, externalCb, internalCb) {
    if (_hasErrors(undefined, internalCb, true, 'internalCb')) {
      return;
    }

    if (!_hasErrors(collection, externalCb)) {
      for (var key in collection) {
        if (collection.hasOwnProperty(key)) {
          internalCb(collection[key], key);
        }
      }
    }
  };

  //see http://jsperf.com/iterators/3
  //utilizing for in is way faster
  var _each = function(collection, cb) {
    _iterate(collection, cb, function(val, key) {
      cb(val, key);
    });
  };

  return {
    each:_each,
    forEach: _each,
    every: _every,
    all: _all,
  };
});
