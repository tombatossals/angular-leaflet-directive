angular.module("leaflet-directive")
.factory('leafletLabelEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers) {
    var Helpers = leafletHelpers,
        fire = leafletEventsHelpers.fire;

    var _getAvailableLabelEvents = function () {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu'
        ];
    };

    var _genDispatchLabelEvent = function (eventName, logic, leafletScope, label, name, model, layerName) {
        return function (e) {
            // Put together broadcast name
            var broadcastName = 'leafletDirectiveLabel.' + eventName;
            var markerName = scope_watch_name.replace('markers.', '');
            fire(leafletScope, broadcastName, logic, e, label, model, markerName, layerName);
        };
    };


    var _genLabelEvents = function (eventName, logic, leafletScope, lObject, name, model, layerName) {
        var labelEvents = _getAvailableLabelEvents();
        var scopeWatchName = Helpers.getObjectArrayPath("markers." + name);
        for (var i = 0; i < labelEvents.length; i++) {
            var eventName = labelEvents[i];
            lObject.label.on(eventName,
                _genDispatchLabelEvent(
                    eventName, logic, leafletScope, lObject.label, scopeWatchName, model, layerName));
        }
    };

    return {
        getAvailableLabelEvents: _getAvailableLabelEvents,
        genDispatchLabelEvent: _genDispatchLabelEvent,
        genLabelEvents: _genLabelEvents
    };
});
