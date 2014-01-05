angular.module("leaflet-directive").factory('leafletEvents', function ($rootScope, $q, leafletHelpers) {
    var safeApply = leafletHelpers.safeApply;

    return {
        getAvailableMapEvents: function() {
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
                'popupclose'
            ];
        },

        genDispatchMapEvent: function(scope, eventName, logic) {
            return function(e) {
                // Put together broadcast name
                var broadcastName = 'leafletDirectiveMap.' + eventName;
                // Safely broadcast the event
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
            };
        },
        getAvailableMarkerEvents: function() {
            return [
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
        },
        genDispatchMarkerEvent: function(scope, eventName, logic, markerName) {
            return function(e) {
                // Put together broadcast name
                var broadcastName = 'leafletDirectiveMarker.' + eventName;

                // Safely broadcast the event
                safeApply(scope, function(scope) {
                    if (logic === "emit") {
                        scope.$emit(broadcastName, {
                            leafletEvent : e,
                            markerName: markerName

                        });
                    } else if (logic === "broadcast") {
                        $rootScope.$broadcast(broadcastName, {
                            leafletEvent : e,
                            markerName: markerName
                        });
                    }
                });
            };
        },
        getAvailableLabelEvents: function() {
            return [
                'click',
                'dblclick',
                'mousedown',
                'mouseover',
                'mouseout',
                'contextmenu'
            ];
        },
        genDispatchLabelEvent: function(scope, eventName, logic, label, scope_watch_name) {
            return function(e) {
                // Put together broadcast name
                var broadcastName = 'leafletDirectiveLabel.' + eventName;
                var markerName = scope_watch_name.replace('markers.', '');

                // Safely broadcast the event
                safeApply(scope, function(scope) {
                    if (logic === "emit") {
                        scope.$emit(broadcastName, {
                            leafletEvent : e,
                            label: label,
                            markerName: markerName
                        });
                    } else if (logic === "broadcast") {
                        $rootScope.$broadcast(broadcastName, {
                            leafletEvent : e,
                            label: label,
                            markerName: markerName
                        });
                    }
                });
            };
        }
    };
});

