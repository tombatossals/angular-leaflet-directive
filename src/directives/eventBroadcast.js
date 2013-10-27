angular.module("leaflet-directive").directive('eventBroadcast', function ($log, $rootScope) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var map = controller.getMap();
            var legend = $scope.legend;

            setupMapEventCallbacks();
            setupMapEventBroadcasting();

            /*
            * Set up broadcasting of map events to the rootScope
            *
            * Listeners listen at leafletDirectiveMap.<event name>
            *
            * All events listed at http://leafletjs.com/reference.html#map-events are supported
            */
            function setupMapEventBroadcasting() {

                function genDispatchMapEvent(eventName, logic) {
                    return function(e) {
                        // Put together broadcast name
                        var broadcastName = 'leafletDirectiveMap.' + eventName;
                        // Safely broadcast the event
                        safeApply($scope, function(scope) {
                            if (logic === "emit") {
                                scope.$emit(broadcastName, {
                                    leafletEvent : e
                                });
                            } else if (logic === "broadcast") {
                                $rootScope.$broadcast(broadcastName, {
                                    leafletEvent : e
                                });
                            }
                        });
                    };
                }

              var availableMapEvents = [
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
                'popupclose'
              ];

              var mapEvents = [];
              var i;
              var eventName;
              var logic = "broadcast";

              if ($scope.eventBroadcast === undefined || $scope.eventBroadcast === null) {
                  // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                  mapEvents = availableMapEvents;
              } else if (typeof $scope.eventBroadcast !== 'object') {
                  // Not a valid object
                  $log.warn("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
              } else {
                  // We have a possible valid object
                  if ($scope.eventBroadcast.map === undefined || $scope.eventBroadcast.map === null) {
                      // We do not have events enable/disable do we do nothing (all enabled by default)
                      mapEvents = availableMapEvents;
                  } else if (typeof $scope.eventBroadcast.map !== 'object') {
                      // Not a valid object
                      $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                  } else {
                      // We have a possible valid map object
                      // Event propadation logic
                      if ($scope.eventBroadcast.map.logic !== undefined && $scope.eventBroadcast.map.logic !== null) {
                          // We take care of possible propagation logic
                          if ($scope.eventBroadcast.map.logic !== "emit" && $scope.eventBroadcast.map.logic !== "broadcast") {
                              // This is an error
                              $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                          } else if ($scope.eventBroadcast.map.logic === "emit") {
                              logic = "emit";
                          }
                      }
                      // Enable / Disable
                      var mapEventsEnable = false, mapEventsDisable = false;
                      if ($scope.eventBroadcast.map.enable !== undefined && $scope.eventBroadcast.map.enable !== null) {
                          if (typeof $scope.eventBroadcast.map.enable === 'object') {
                              mapEventsEnable = true;
                          }
                      }
                      if ($scope.eventBroadcast.map.disable !== undefined && $scope.eventBroadcast.map.disable !== null) {
                          if (typeof $scope.eventBroadcast.map.disable === 'object') {
                              mapEventsDisable = true;
                          }
                      }
                      if (mapEventsEnable && mapEventsDisable) {
                          // Both are active, this is an error
                          $log.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                      } else if (!mapEventsEnable && !mapEventsDisable) {
                          // Both are inactive, this is an error
                          $log.warn("[AngularJS - Leaflet] must enable or disable events");
                      } else {
                          // At this point the map object is OK, lets enable or disable events
                          if (mapEventsEnable) {
                              // Enable events
                              for (i = 0; i < $scope.eventBroadcast.map.enable.length; i++) {
                                  eventName = $scope.eventBroadcast.map.enable[i];
                                  // Do we have already the event enabled?
                                  if (mapEvents.indexOf(eventName) !== -1) {
                                      // Repeated event, this is an error
                                      $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                  } else {
                                      // Does the event exists?
                                      if (availableMapEvents.indexOf(eventName) === -1) {
                                          // The event does not exists, this is an error
                                          $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                      } else {
                                          // All ok enable the event
                                          mapEvents.push(eventName);
                                      }
                                  }
                              }
                          } else {
                              // Disable events
                              mapEvents = availableMapEvents;
                              for (i = 0; i < $scope.eventBroadcast.map.disable.length; i++) {
                                  eventName = $scope.eventBroadcast.map.disable[i];
                                  var index = mapEvents.indexOf(eventName);
                                  if (index === -1) {
                                      // The event does not exist
                                      $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                  } else {
                                      mapEvents.splice(index, 1);
                                  }
                              }
                          }
                      }
                  }
              }

              for (i = 0; i < mapEvents.length; i++) {
                eventName = mapEvents[i];

                map.on(eventName, genDispatchMapEvent(eventName, logic), {
                  eventName: eventName
                });
              }
            }

            /*
             * Event setup watches for callbacks set in the parent scope
             *
             *    $scope.events = {
             *      dblclick: function(){
             *         // doThis()
             *      },
             *      click: function(){
             *         // doThat()
             *      }
             * }
             */

            function setupMapEventCallbacks() {
                if (typeof($scope.events) !== 'object') {
                    return false;
                } else {
                    for (var bind_to  in $scope.events) {
                        map.on(bind_to, $scope.events[bind_to]);
                    }
                }
            }
        }
    };
});
