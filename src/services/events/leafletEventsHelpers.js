angular.module('leaflet-directive')
.factory('LeafletEventsHelpersFactory', function($rootScope, $q, $log, leafletHelpers) {
  var safeApply = leafletHelpers.safeApply;
  var isDefined = leafletHelpers.isDefined;
  var isObject = leafletHelpers.isObject;
  var isArray = leafletHelpers.isArray;
  var errorHeader = leafletHelpers.errorHeader;

  var EventsHelper = function(rootBroadcastName, lObjectType) {
    this.rootBroadcastName = rootBroadcastName;
    $log.debug('LeafletEventsHelpersFactory: lObjectType: ' + lObjectType + 'rootBroadcastName: ' + rootBroadcastName);

    //used to path/key out certain properties based on the type , "markers", "geojson"
    this.lObjectType = lObjectType;
  };

  EventsHelper.prototype.getAvailableEvents = function() {return [];};

  /*
   argument: name: Note this can be a single string or dot notation
   Example:
   markerModel : {
   m1: { lat:_, lon: _}
   }
   //would yield name of
   name = "m1"

   If nested:
   markerModel : {
   cars: {
   m1: { lat:_, lon: _}
   }
   }
   //would yield name of
   name = "cars.m1"
   */
  EventsHelper.prototype.genDispatchEvent = function(maybeMapId, eventName, logic, leafletScope, lObject, name, model, layerName, extra) {
    var _this = this;

    maybeMapId = maybeMapId || '';
    if (maybeMapId)
      maybeMapId = '.' + maybeMapId;

    return function(e) {
      var broadcastName = _this.rootBroadcastName + maybeMapId + '.' + eventName;
      $log.debug(broadcastName);
      _this.fire(leafletScope, broadcastName, logic, e, e.target || lObject, model, name, layerName, extra);
    };
  };

  EventsHelper.prototype.fire = function(scope, broadcastName, logic, event, lObject, model, modelName, layerName) {
    // Safely broadcast the event
    safeApply(scope, function() {
      var toSend = {
        leafletEvent: event,
        leafletObject: lObject,
        modelName: modelName,
        model: model,
      };
      if (isDefined(layerName))
          angular.extend(toSend, {layerName: layerName});

      if (logic === 'emit') {
        scope.$emit(broadcastName, toSend);
      } else {
        $rootScope.$broadcast(broadcastName, toSend);
      }
    });
  };

  EventsHelper.prototype.bindEvents = function(maybeMapId, lObject, name, model, leafletScope, layerName, extra) {
    var events = [];
    var logic = 'emit';
    var _this = this;

    if (!isDefined(leafletScope.eventBroadcast)) {
      // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
      events = this.getAvailableEvents();
    } else if (!isObject(leafletScope.eventBroadcast)) {
      // Not a valid object
      $log.error(errorHeader + 'event-broadcast must be an object check your model.');
    } else {
      // We have a possible valid object
      if (!isDefined(leafletScope.eventBroadcast[_this.lObjectType])) {
        // We do not have events enable/disable do we do nothing (all enabled by default)
        events = this.getAvailableEvents();
      } else if (!isObject(leafletScope.eventBroadcast[_this.lObjectType])) {
        // Not a valid object
        $log.warn(errorHeader + 'event-broadcast.' + [_this.lObjectType]  + ' must be an object check your model.');
      } else {
        // We have a possible valid map object
        // Event propadation logic
        if (isDefined(leafletScope.eventBroadcast[this.lObjectType].logic)) {
          // We take care of possible propagation logic
          if (leafletScope.eventBroadcast[_this.lObjectType].logic !== 'emit' &&
              leafletScope.eventBroadcast[_this.lObjectType].logic !== 'broadcast')
                  $log.warn(errorHeader + 'Available event propagation logic are: \'emit\' or \'broadcast\'.');
        }

        // Enable / Disable
        var eventsEnable = false;
        var eventsDisable = false;
        if (isDefined(leafletScope.eventBroadcast[_this.lObjectType].enable) &&
            isArray(leafletScope.eventBroadcast[_this.lObjectType].enable))
                eventsEnable = true;
        if (isDefined(leafletScope.eventBroadcast[_this.lObjectType].disable) &&
            isArray(leafletScope.eventBroadcast[_this.lObjectType].disable))
                eventsDisable = true;

        if (eventsEnable && eventsDisable) {
          // Both are active, this is an error
          $log.warn(errorHeader + 'can not enable and disable events at the same time');
        } else if (!eventsEnable && !eventsDisable) {
          // Both are inactive, this is an error
          $log.warn(errorHeader + 'must enable or disable events');
        } else {
          // At this point the object is OK, lets enable or disable events
          if (eventsEnable) {
            // Enable events
            leafletScope.eventBroadcast[this.lObjectType].enable.forEach(function(eventName) {
              // Do we have already the event enabled?
              if (events.indexOf(eventName) !== -1) {
                // Repeated event, this is an error
                $log.warn(errorHeader + 'This event ' + eventName + ' is already enabled');
              } else {
                // Does the event exists?
                if (_this.getAvailableEvents().indexOf(eventName) === -1) {
                  // The event does not exists, this is an error
                  $log.warn(errorHeader + 'This event ' + eventName + ' does not exist');
                } else {
                  // All ok enable the event
                  events.push(eventName);
                }
              }
            });
          } else {
            // Disable events
            events = this.getAvailableEvents();
            leafletScope.eventBroadcast[_this.lObjectType].disable.forEach(function(eventName) {
              var index = events.indexOf(eventName);
              if (index === -1) {
                // The event does not exist
                $log.warn(errorHeader + 'This event ' + eventName + ' does not exist or has been already disabled');

              } else {
                events.splice(index, 1);
              }
            });
          }
        }
      }
    }

    events.forEach(function(eventName) {
      lObject.on(eventName, _this.genDispatchEvent(maybeMapId, eventName, logic, leafletScope, lObject, name, model, layerName, extra));
    });

    return logic;
  };

  return EventsHelper;
})
.service('leafletEventsHelpers', function(LeafletEventsHelpersFactory) {
  return new LeafletEventsHelpersFactory();
});
