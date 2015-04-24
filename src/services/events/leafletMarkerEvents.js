angular.module("leaflet-directive")
.factory('leafletMarkerEvents', function ($rootScope, $q, $log, leafletHelpers, leafletEventsHelpers, leafletLabelEvents) {
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        Helpers = leafletHelpers,
        lblHelp = leafletLabelEvents;

    var MarkerEvents = function(){
        leafletEventsHelpers.call(this,'leafletDirectiveMarker', 'markers');
    };
    MarkerEvents.prototype =  new leafletEventsHelpers();

    MarkerEvents.prototype.genDispatchEvent = function(eventName, logic, leafletScope, lObject, name, model, layerName) {
        var handle = leafletEventsHelpers.prototype
            .genDispatchEvent.call(this, eventName, logic, leafletScope, lObject, name, model, layerName);
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
        'popupclose'
        ];
    };

    MarkerEvents.prototype.bindEvents = function (lObject, name, model, leafletScope, layerName) {
        EventsHelper.prototype.bindEvents.call(this,lObject, name, model, leafletScope, layerName);

        if (Helpers.LabelPlugin.isLoaded() && isDefined(lObject.label)) {
            lblHelp.genEvents(name, logic, leafletScope, lObject, model, layerName);
        }
    };

    return new MarkerEvents();
});
