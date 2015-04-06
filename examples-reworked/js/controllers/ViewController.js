        app.controller('MarkersLabelController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    main_marker: {
                        lat: 51.5,
                        lng: 0,
                        focus: true,
                        //message: "Hey, drag me if you want",
                        title: "Marker",
                        draggable: true,
                        label: {
                            message: "Hey, drag me if you want",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    another_marker: {
                        lat: 51,
                        lng: 0,
                        focus: true,
                        title: "Marker",
                        draggable: true,
                        label: {
                            message: "<div ng-include src=\"'views/template.html'\"></div>",
                            options: {
                                noHide: true
                            }
                        }
                    }
                }
            });
        } ]);
        app.controller('ViewController', ['$scope', function($scope) {
            $scope.user = {};
            $scope.greet = function(user) {
              alert('hello ' + user.name);
            }
        } ]);