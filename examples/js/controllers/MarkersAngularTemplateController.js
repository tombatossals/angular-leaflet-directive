        app.controller('MarkersAngularTemplateController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                data: {markers: {}}
            });
            $scope.addMarkers = function() {
                $scope.data.markers = {};
                angular.extend($scope.data, { angularInterpolatedMessage : "Angular interpolated message!"});
                angular.extend($scope.data, {
                    markers: {
                        m1: {
                            lat: 51.505,
                            lng: -0.09,
                            compileMessage: false,
                            message: "I'm a static marker",
                        },
                        m2: {
                            lat: 51,
                            lng: 0,
                            focus: true,
                            message: "<div ng-include src=\"'views/template.html'\"></div>",
                            draggable: true,
                        },
                        m3: {
                            lat: 51,
                            lng: -1,
                            getMessageScope: function () { return $scope; },
                            message: "<p>{{data.angularInterpolatedMessage}}</p>",
                            compileMessage: true
                        }
                    }
                });
            };
            $scope.removeMarkers = function() {
                $scope.data.markers = {};
            }
            $scope.addMarkers();
        } ]);
        app.controller('ViewController', ['$scope', function($scope) {
            $scope.user = {}
            $scope.greet = function(user) {
              alert('hello ' + user.name)
            }
        } ]);