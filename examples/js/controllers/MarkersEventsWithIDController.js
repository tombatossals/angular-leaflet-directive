        app.controller("MarkersEventsWithIDController", [ "$scope", "leafletMarkerEvents", function($scope, leafletMarkerEvents) {
            $scope.center = {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            };
            $scope.markers = {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    draggable: true,
                    message: "I'm a draggable marker",
                    focus: true
                }
            }
            $scope.events = {
                markers: {
                    enable: leafletMarkerEvents.getAvailableEvents(),
                }
            };
            $scope.eventDetected = "No events yet...";
            var markerEvents = leafletMarkerEvents.getAvailableEvents();
            for (var k in markerEvents){
                var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
                $scope.$on(eventName, function(event, args){
                    $scope.eventDetected = event.name;
                });
            }
        }]);