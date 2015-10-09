angular.module("leaflet-directive")
.factory('leafletMarkerEvents', function ($rootScope, $q, leafletLogger, leafletHelpers, leafletEventsHelpersFactory, leafletLabelEvents) {
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        Helpers = leafletHelpers,
        lblHelp = leafletLabelEvents,
        EventsHelper = leafletEventsHelpersFactory,
        $log = leafletLogger;

    var MarkerEvents = function(){
      EventsHelper.call(this,'leafletDirectiveMarker', 'markers');
    };

    MarkerEvents.prototype = new EventsHelper();

    MarkerEvents.prototype.genDispatchEvent = function(maybeMapId, eventName, logic, leafletScope, lObject, name, model, layerName) {
        var handle = EventsHelper.prototype
            .genDispatchEvent.call(this, maybeMapId, eventName, logic, leafletScope, lObject, name, model, layerName);
        return function(e){
            // Broadcast old marker click name for backwards compatibility
            if (eventName === "click") {
                safeApply(leafletScope, function () {
                    $rootScope.$broadcast('leafletDirectiveMarkersClick', name);
                });
            } else if (eventName === 'dragend') {
                safeApply(leafletScope, function () {
                    model.lat = lObject.getLatLng().lat;
                    model.lng = lObject.getLatLng().lng;
                });
                if (model.message && model.focus === true) {
                    lObject.openPopup();
                }
            }
            handle(e); //common
        };
    };

    MarkerEvents.prototype.getAvailableEvents = function(){ return [
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
        'popupclose',
        'touchend',
        'touchstart',
        'touchmove',
        'touchcancel',
        'touchleave'
        ];
    };

    MarkerEvents.prototype.bindEvents = function (maybeMapId, lObject, name, model, leafletScope, layerName) {
      var logic = EventsHelper.prototype.bindEvents.call(this, maybeMapId, lObject, name, model, leafletScope, layerName);

      if (Helpers.LabelPlugin.isLoaded() && isDefined(lObject.label)) {
          lblHelp.genEvents(maybeMapId, name, logic, leafletScope, lObject, model, layerName);
      }
    };

    return new MarkerEvents();
});
