angular.module("leaflet-directive")
.service('leafletWatchHelpers', function (){

    var _maybe = function(scope, watchFunctionName, thingToWatchStr, watchOptions, initCb){
        //watchOptions.isDeep is/should be ignored in $watchCollection
        var unWatch = scope[watchFunctionName](thingToWatchStr, function(newValue, oldValue) {
            initCb(newValue, oldValue);
            if(!watchOptions.doWatch)
                unWatch();
        }, watchOptions.isDeep);

        return unWatch;
    };

  /*
  @name: maybeWatch
  @description: Utility to watch something once or forever.
  @returns unWatch function
  @param watchOptions - see markersWatchOptions and or derrivatives. This object is used
  to set watching to once and its watch depth.
  */
  var _maybeWatch = function(scope, thingToWatchStr, watchOptions, initCb){
      var localWatchOptions, watchMethod;
      if(watchOptions.doWatch !== 'collection') {
          localWatchOptions = watchOptions;
          watchMethod = '$watch';
      }
      else {
          localWatchOptions = { doWatch: true, isDeep: watchOptions.isDeep };
          watchMethod = '$watchCollection';
      }

      return _maybe(scope, watchMethod, thingToWatchStr, localWatchOptions, initCb);
  };

  /*
  @name: _maybeWatchCollection
  @description: Utility to watch something once or forever.
  @returns unWatch function
  @param watchOptions - see markersWatchOptions and or derrivatives. This object is used
  to set watching to once and its watch depth.
  */
  var _maybeWatchCollection = function(scope, thingToWatchStr, watchOptions, initCb){
      return _maybe(scope, '$watchCollection', thingToWatchStr, watchOptions, initCb);
  };

  return {
    maybeWatch: _maybeWatch,
    maybeWatchCollection: _maybeWatchCollection
  };
});
