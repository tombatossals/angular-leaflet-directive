<<<<<<< HEAD
<<<<<<< HEAD
angular.module("leaflet-directive")
.factory('leafletMapEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers) {
=======
angular.module("leaflet-directive").factory('leafletMapEvents', function ($rootScope, $q, $log, leafletHelpers) {
>>>>>>> breaking up leafletEvents for developers sake
=======
angular.module("leaflet-directive")
.factory('leafletMapEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers) {
>>>>>>> leafletEvents split up to keep sanity.
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        isObject = leafletHelpers.isObject,
        Helpers = leafletHelpers,
<<<<<<< HEAD
<<<<<<< HEAD
        errorHeader = leafletHelpers.errorHeader,
        fire = leafletEventsHelpers.fire;
=======
        errorHeader = leafletHelpers.errorHeader;
>>>>>>> breaking up leafletEvents for developers sake
=======
        errorHeader = leafletHelpers.errorHeader,
        fire = leafletEventsHelpers.fire;
>>>>>>> leafletEvents split up to keep sanity.

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

    var _genDispatchMapEvent = function(scope, eventName, logic) {
        return function(e) {
            // Put together broadcast name
            var broadcastName = 'leafletDirectiveMap.' + eventName;
            // Safely broadcast the event
<<<<<<< HEAD
<<<<<<< HEAD
            fire(scope, broadcastName, logic, e, e.target, scope)
=======
            safeApply(scope, function(scope) {
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
>>>>>>> breaking up leafletEvents for developers sake
=======
            fire(scope, broadcastName, logic, e, e.target, scope)
>>>>>>> leafletEvents split up to keep sanity.
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

    return {
        getAvailableMapEvents: _getAvailableMapEvents,
        genDispatchMapEvent: _genDispatchMapEvent,
        notifyCenterChangedToBounds: _notifyCenterChangedToBounds,
        notifyCenterUrlHashChanged: _notifyCenterUrlHashChanged
    };
});
