angular.module("leaflet-directive")
.factory('leafletMapEvents', function ($rootScope, $q, leafletLogger, leafletHelpers, leafletEventsHelpers, leafletIterators) {
    var isDefined = leafletHelpers.isDefined,
        fire = leafletEventsHelpers.fire;

    var _getAvailableMapEvents = function() {
        return [
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
            'zoomanim',
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
            'popupclose',
            'draw:created',
            'draw:edited',
            'draw:deleted',
            'draw:drawstart',
            'draw:drawstop',
            'draw:editstart',
            'draw:editstop',
            'draw:deletestart',
            'draw:deletestop'
        ];
    };

    var _genDispatchMapEvent = function(scope, eventName, logic, maybeMapId) {
        if (maybeMapId)
          maybeMapId = maybeMapId + '.';
        return function(e) {
            // Put together broadcast name
            var broadcastName = 'leafletDirectiveMap.' + maybeMapId + eventName;
            leafletLogger.debug(broadcastName);
            // Safely broadcast the event
            fire(scope, broadcastName, logic, e, e.target, scope);
        };
    };

    var _notifyCenterChangedToBounds = function(scope) {
        scope.$broadcast("boundsChanged");
    };

    var _notifyCenterUrlHashChanged = function(scope, map, attrs, search) {
        if (!isDefined(attrs.urlHashCenter)) {
            return;
        }
        var center = map.getCenter();
        var centerUrlHash = (center.lat).toFixed(4) + ":" + (center.lng).toFixed(4) + ":" + map.getZoom();
        if (!isDefined(search.c) || search.c !== centerUrlHash) {
            //$log.debug("notified new center...");
            scope.$emit("centerUrlHash", centerUrlHash);
        }
    };

    var _addEvents =  function(map, mapEvents, contextName, scope, logic){
        leafletIterators.each(mapEvents, function(eventName) {
            var context = {};
            context[contextName] = eventName;
            map.on(eventName, _genDispatchMapEvent(scope, eventName, logic, map._container.id || ''), context);
        });
    };

    return {
        getAvailableMapEvents: _getAvailableMapEvents,
        genDispatchMapEvent: _genDispatchMapEvent,
        notifyCenterChangedToBounds: _notifyCenterChangedToBounds,
        notifyCenterUrlHashChanged: _notifyCenterUrlHashChanged,
        addEvents: _addEvents
    };
});
