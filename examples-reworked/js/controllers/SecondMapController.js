        app.controller("FirstMapController", [ "$scope", "$log", "leafletData", "leafletEvents", function($scope, $log, leafletData, leafletEvents) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                markers: {
                    london: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.events = {
                map: {
                    enable: leafletEvents.getAvailableMapEvents(),
                    logic: 'emit'
                }
            };
            var mapEvents = leafletEvents.getAvailableMapEvents();
            for (var k in mapEvents) {
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                $scope.$on(eventName, function(event){
                    $scope.eventDetected = event.name;
                });
            }
        }]);
        app.controller("SecondMapController", [ "$scope", "$log", "leafletData", "leafletEvents", function($scope, $log, leafletData, leafletEvents) {
            angular.extend($scope, {
                spain: {
                    lat: 40.095,
                    lng: -3.823,
                    zoom: 4
                },
                markers: {
                    spain: {
                        lat: 51.505,
                        lng: -0.09,
                        draggable: true
                    }
                },
                defaults: {
                     tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                }
            });
            $scope.events = {
                map: {
                    enable: ['click', 'dblclick'],
                    logic: 'emit'
                }
            };
            var mapEvents = $scope.events.map.enable;
            for (var k in mapEvents) {
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                $scope.$on(eventName, function(event){
                    $scope.eventDetected = event.name;
                });
            }
        }]);