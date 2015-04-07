        app.controller("PathsAjaxLoadController", [ "$scope", "$http", function($scope, $http) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                europeanPaths: {}
            });
            $scope.loadPaths = function loadPaths() {
                $http.get('json/paths.json').success(function(data) {
                    $scope.europeanPaths = data;
                });
            };
            $scope.changePaths = function changePaths() {
                console.log($scope.europeanPaths);
                $scope.europeanPaths.p1.latlngs[0] = {
                    lat: 53,
                    lng: -0.1
                };
            };
        }]);