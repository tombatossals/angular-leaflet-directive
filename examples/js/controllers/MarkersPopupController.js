        app.controller('MarkersPopupController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 51.505,
                        lng: -0.09,
                        focus: true,
                        draggable: false,
                        message: "Hi there!",
                        icon: {}
                    }
                },
                events: {
                    markers: {
                      enable: [ 'dragend' ]
                      //logic: 'emit'
                    }
                }
            });
            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                console.log('hola');
                $scope.markers.m1.lat = args.model.lat;
                $scope.markers.m1.lng = args.model.lng;
            });
        } ]);