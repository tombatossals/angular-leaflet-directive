angular.module("leaflet-directive")
.service('leafletDirectiveControlsHelpers', function (leafletLogger, leafletData, leafletHelpers) {
    var _isDefined = leafletHelpers.isDefined,
        _isString = leafletHelpers.isString,
        _isObject = leafletHelpers.isObject,
        _mainErrorHeader = leafletHelpers.errorHeader,
        $log = leafletLogger;

    var _errorHeader = _mainErrorHeader + '[leafletDirectiveControlsHelpers';

    var _extend = function(id, thingToAddName, createFn, cleanFn){
        var _fnHeader = _errorHeader + '.extend] ';
        var extender = {};
        if(!_isDefined(thingToAddName)){
            $log.error(_fnHeader + 'thingToAddName cannot be undefined');
            return;
        }

        if(_isString(thingToAddName) && _isDefined(createFn) && _isDefined(cleanFn)){
            extender[thingToAddName] = {
                create: createFn,
                clean: cleanFn
            };
        }
        else if(_isObject(thingToAddName) && !_isDefined(createFn) && !_isDefined(cleanFn)){
            extender = thingToAddName;
        }
        else{
            $log.error(_fnHeader + 'incorrect arguments');
            return;
        }

        //add external control to create / destroy markers without a watch
        leafletData.getDirectiveControls().then(function(controls){
            angular.extend(controls, extender);
            leafletData.setDirectiveControls(controls, id);
        });
    };

    return {
        extend: _extend
    };
});
