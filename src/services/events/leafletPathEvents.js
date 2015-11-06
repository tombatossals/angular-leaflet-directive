angular.module('leaflet-directive')
.factory('leafletPathEvents', function($rootScope, $q, $log, leafletHelpers, leafletLabelEvents, leafletEventsHelpers) {
  var isDefined = leafletHelpers.isDefined;
  var isObject = leafletHelpers.isObject;
  var Helpers = leafletHelpers;
  var errorHeader = leafletHelpers.errorHeader;
  var lblHelp = leafletLabelEvents;
  var fire = leafletEventsHelpers.fire;

  /*
  TODO (nmccready) This EventsHelper needs to be derrived from leafletEventsHelpers to elminate copy and paste code.
  */

  var _genDispatchPathEvent = function(maybeMapId, eventName, logic, leafletScope, lObject, name, model, layerName) {
    maybeMapId = maybeMapId || '';

    if (maybeMapId)
      maybeMapId = '.' + maybeMapId;

    return function(e) {
      var broadcastName = 'leafletDirectivePath' + maybeMapId + '.' + eventName;
      $log.debug(broadcastName);
      fire(leafletScope, broadcastName, logic, e, e.target || lObject, model, name, layerName);
    };
  };

  var _bindPathEvents = function(maybeMapId, lObject, name, model, leafletScope) {
    var pathEvents = [];
    var i;
    var eventName;
    var logic = 'broadcast';

    if (!isDefined(leafletScope.eventBroadcast)) {
      // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
      pathEvents = _getAvailablePathEvents();
    } else if (!isObject(leafletScope.eventBroadcast)) {
      // Not a valid object
      $log.error(errorHeader + 'event-broadcast must be an object check your model.');
    } else {
      // We have a possible valid object
      if (!isDefined(leafletScope.eventBroadcast.path)) {
        // We do not have events enable/disable do we do nothing (all enabled by default)
        pathEvents = _getAvailablePathEvents();
      } else if (isObject(leafletScope.eventBroadcast.paths)) {
        // Not a valid object
        $log.warn(errorHeader + 'event-broadcast.path must be an object check your model.');
      } else {
        // We have a possible valid map object
        // Event propadation logic
        if (leafletScope.eventBroadcast.path.logic !== undefined && leafletScope.eventBroadcast.path.logic !== null) {
          // We take care of possible propagation logic
          if (leafletScope.eventBroadcast.path.logic !== 'emit' && leafletScope.eventBroadcast.path.logic !== 'broadcast') {
            // This is an error
            $log.warn(errorHeader + 'Available event propagation logic are: \'emit\' or \'broadcast\'.');
          } else if (leafletScope.eventBroadcast.path.logic === 'emit') {
            logic = 'emit';
          }
        }

        // Enable / Disable
        var pathEventsEnable = false;
        var pathEventsDisable = false;
        if (leafletScope.eventBroadcast.path.enable !== undefined && leafletScope.eventBroadcast.path.enable !== null) {
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
          // Both are active, this is an error
          $log.warn(errorHeader + 'can not enable and disable events at the same time');
        } else if (!pathEventsEnable && !pathEventsDisable) {
          // Both are inactive, this is an error
          $log.warn(errorHeader + 'must enable or disable events');
        } else {
          // At this point the path object is OK, lets enable or disable events
          if (pathEventsEnable) {
            // Enable events
            for (i = 0; i < leafletScope.eventBroadcast.path.enable.length; i++) {
              eventName = leafletScope.eventBroadcast.path.enable[i];

              // Do we have already the event enabled?
              if (pathEvents.indexOf(eventName) !== -1) {
                // Repeated event, this is an error
                $log.warn(errorHeader + 'This event ' + eventName + ' is already enabled');
              } else {
                // Does the event exists?
                if (_getAvailablePathEvents().indexOf(eventName) === -1) {
                  // The event does not exists, this is an error
                  $log.warn(errorHeader + 'This event ' + eventName + ' does not exist');
                } else {
                  // All ok enable the event
                  pathEvents.push(eventName);
                }
              }
            }
          } else {
            // Disable events
            pathEvents = _getAvailablePathEvents();
            for (i = 0; i < leafletScope.eventBroadcast.path.disable.length; i++) {
              eventName = leafletScope.eventBroadcast.path.disable[i];
              var index = pathEvents.indexOf(eventName);
              if (index === -1) {
                // The event does not exist
                $log.warn(errorHeader + 'This event ' + eventName + ' does not exist or has been already disabled');

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
      lObject.on(eventName, _genDispatchPathEvent(maybeMapId, eventName, logic, leafletScope, pathEvents, name));
    }

    if (Helpers.LabelPlugin.isLoaded() && isDefined(lObject.label)) {
      lblHelp.genEvents(maybeMapId, name, logic, leafletScope, lObject, model);
    }
  };

  var _getAvailablePathEvents = function() {
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
        'popupclose',
    ];
  };

  return {
    getAvailablePathEvents: _getAvailablePathEvents,
    bindPathEvents: _bindPathEvents,
  };
});
