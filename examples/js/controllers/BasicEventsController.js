        app.controller("BasicEventsController", [ "$scope", "leafletEvents", function($scope, leafletEvents) {
            $scope.center  = {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            };
            $scope.eventDetected = "No events yet...";
            var mapEvents = leafletEvents.getAvailableMapEvents();
            for (var k in mapEvents){
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                $scope.$on(eventName, function(event){
                    $scope.eventDetected = event.name;
                });
            }
        }]);