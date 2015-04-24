angular.module("leaflet-directive")
.factory('leafletLabelEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers) {
    var Helpers = leafletHelpers;
        var MarkerEvents = function(){
            leafletEventsHelpers.call(this,'leafletDirectiveMarker', 'markers');
        };
        LabelEvents.prototype =  new leafletEventsHelpers();

        LabelEvents.prototype.genDispatchEvent = function(eventName, logic, leafletScope, lObject, name, model, layerName) {
            var markerName = name.replace('markers.', '');
            return leafletEventsHelpers.prototype
                .genDispatchEvent.call(this, eventName, logic, leafletScope, lObject, markerName, model, layerName);
        };

        LabelEvents.prototype.getAvailableEvents = function(){
            return [
                'click',
                'dblclick',
                'mousedown',
                'mouseover',
                'mouseout',
                'contextmenu'
            ];
        };

        LabelEvents.prototype.genEvents = function (eventName, logic, leafletScope, lObject, name, model, layerName) {
            var labelEvents = this.getAvailableEvents();
            var scopeWatchName = Helpers.getObjectArrayPath("markers." + name);
            labelEvents.forEach(function(eventName) {
                lObject.label.on(eventName, this.genDispatchEvent(
                    eventName, logic, leafletScope, lObject.label, scopeWatchName, model, layerName));
            });
        };

        LabelEvents.prototype.bindEvents = function (lObject, name, model, leafletScope, layerName) {};

        return new LabelEvents();
});
