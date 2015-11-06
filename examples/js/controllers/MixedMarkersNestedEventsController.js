    app.controller("MixedMarkersNestedEventsController", ["$scope", "leafletEvents", function ($scope, leafletEvents) {
        $scope.map = {
            show: true
        };
        $scope.layers = {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    type: 'xyz',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    layerOptions: {
                        subdomains: ['a', 'b', 'c'],
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        continuousWorld: true
                    }
                }
            },
            overlays: {
                london: {
                    name: 'London',
                    type: 'group',
                    visible: true
                }
            }
        };
        $scope.center = {
            lat: 51.505,
            lng: -0.09,
            zoom: 8
        };
        $scope.markers = {
            london: {
                1: {
                    lat: 51.505,
                    lng: -0.09,
                    draggable: true,
                    focus: true
                }
            }
        };
        $scope.events = {
            markers: {
                enable: leafletEvents.getAvailableMarkerEvents()
            }
        };
        $scope.eventDetected = "No events yet...";
        var markerEvents = leafletEvents.getAvailableMarkerEvents();
        for (var k in markerEvents) {
            var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
            $scope.$on(eventName, function (event, args) {
                $scope.eventDetected = event.name;
                $scope.args = {
                    layerName: args.layerName,
                    model: args.model,
                    modelName: args.modelName
                };
            });
        }
    }]);