angular.module('leaflet-directive')
.service('leafletDirectiveControlsHelpers', function(leafletLogger, leafletData, leafletHelpers) {
  var _isDefined = leafletHelpers.isDefined;
  var _isString = leafletHelpers.isString;
  var _isObject = leafletHelpers.isObject;

  var _extend = function(id, thingToAddName, createFn, cleanFn) {
    var extender = {};
    if (!_isDefined(thingToAddName)) {
      leafletLogger.error('control name cannot be undefined');
      return;
    }

    if (_isString(thingToAddName) && _isDefined(createFn) && _isDefined(cleanFn)) {
      extender[thingToAddName] = {
        create: createFn,
        clean: cleanFn,
      };
    }    else if (_isObject(thingToAddName) && !_isDefined(createFn) && !_isDefined(cleanFn)) {
      extender = thingToAddName;
    }    else {
      leafletLogger.error('incorrect arguments');
      return;
    }

    //add external control to create / destroy markers without a watch
    leafletData.getDirectiveControls().then(function(controls) {
      angular.extend(controls, extender);
      leafletData.setDirectiveControls(controls, id);
    });
  };

  return {
    extend: _extend,
  };
});
