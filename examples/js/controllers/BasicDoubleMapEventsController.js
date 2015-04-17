        app.controller("BasicDoubleMapEventsController", [ "$scope", "$log", "leafletData", "leafletEvents", function($scope, $log, leafletData, leafletEvents) {
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
            angular.extend($scope, {
                spain: {
                    lat: 40.095,
                    lng: -3.823,
                    zoom: 4
                },
                markers2: {
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
            $scope.events2 = {
                map: {
                    enable: ['click', 'dblclick'],
                    logic: 'emit'
                }
            };
            var mapEvents2 = $scope.events2.map.enable;
            for (var j in mapEvents2) {
                var eventName2 = 'leafletDirectiveMap.' + mapEvents[j];
                $scope.$on(eventName2, function(event){
                    $scope.eventDetected2 = event.name;
                });
            }
        }]);