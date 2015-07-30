        app.controller('MarkersSimpleController', [ '$scope', function($scope) {
            var mainMarker = {
                lat: 51,
                lng: 0,
                focus: true,
                message: "Hey, drag me if you want",
                draggable: true
            };
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    mainMarker: angular.copy(mainMarker)
                },
                position: {
                    lat: 51,
                    lng: 0
                },
                events: { // or just {} //all events
                    markers:{
                      enable: [ 'dragend' ]
                      //logic: 'emit'
                    }
                }
            });
            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.position.lat = args.model.lat;
                $scope.position.lng = args.model.lng;
            });
        } ]);