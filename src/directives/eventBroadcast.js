angular.module('leaflet-directive').directive('eventBroadcast', function($log, $rootScope, leafletHelpers, leafletMapEvents, leafletIterators) {

  return {
    restrict: 'A',
    scope: false,
    replace: false,
    require: 'leaflet',

    link: function(scope, element, attrs, controller) {
      var isObject = leafletHelpers.isObject;
      var isDefined = leafletHelpers.isDefined;
      var leafletScope  = controller.getLeafletScope();
      var eventBroadcast = leafletScope.eventBroadcast;
      var availableMapEvents = leafletMapEvents.getAvailableMapEvents();
      var addEvents = leafletMapEvents.addEvents;

      controller.getMap().then(function(map) {

        var mapEvents = [];
        var logic = 'broadcast';

        // We have a possible valid object
        if (!isDefined(eventBroadcast.map)) {
          // We do not have events enable/disable do we do nothing (all enabled by default)
          mapEvents = availableMapEvents;
        } else if (!isObject(eventBroadcast.map)) {
          // Not a valid object
          $log.warn('[AngularJS - Leaflet] event-broadcast.map must be an object check your model.');
        } else {
          // We have a possible valid map object
          // Event propadation logic
          if (eventBroadcast.map.logic !== 'emit' && eventBroadcast.map.logic !== 'broadcast') {
            // This is an error
            $log.warn('[AngularJS - Leaflet] Available event propagation logic are: \'emit\' or \'broadcast\'.');
          } else {
            logic = eventBroadcast.map.logic;
          }

          if (!(isObject(eventBroadcast.map.enable) && eventBroadcast.map.enable.length >= 0)) {
            $log.warn('[AngularJS - Leaflet] event-broadcast.map.enable must be an object check your model.');
          } else {
            // Enable events
            leafletIterators.each(eventBroadcast.map.enable, function(eventName) {
              // Do we have already the event enabled?
              if (mapEvents.indexOf(eventName) === -1 && availableMapEvents.indexOf(eventName) !== -1) {
                mapEvents.push(eventName);
              }
            });
          }

        }

        // as long as the map is removed in the root leaflet directive we
        // do not need ot clean up the events as leaflet does it itself
        addEvents(map, mapEvents, 'eventName', leafletScope, logic);
      });
    },
  };
});
