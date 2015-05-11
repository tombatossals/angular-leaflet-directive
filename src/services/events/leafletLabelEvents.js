angular.module("leaflet-directive")
.factory('leafletLabelEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpersFactory) {
    var Helpers = leafletHelpers,
    EventsHelper = leafletEventsHelpersFactory;
        var LabelEvents = function(){
          EventsHelper.call(this,'leafletDirectiveLabel', 'markers');
        };
        LabelEvents.prototype =  new EventsHelper();

        LabelEvents.prototype.genDispatchEvent = function(eventName, logic, leafletScope, lObject, name, model, layerName) {
            var markerName = name.replace('markers.', '');
            return EventsHelper.prototype
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
            var _this = this;
            var labelEvents = this.getAvailableEvents();
            var scopeWatchName = Helpers.getObjectArrayPath("markers." + name);
            labelEvents.forEach(function(eventName) {
                lObject.label.on(eventName, _this.genDispatchEvent(
                    eventName, logic, leafletScope, lObject.label, scopeWatchName, model, layerName));
            });
        };

        LabelEvents.prototype.bindEvents = function (lObject, name, model, leafletScope, layerName) {};

        return new LabelEvents();
});
