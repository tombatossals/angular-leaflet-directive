        app.controller('BasicCenterGeoIPController', [ '$scope', '$http', function($scope, $http) {
            angular.extend($scope, {
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 2
                }
            });
            $scope.searchIP = function(ip) {
                var url = "http://freegeoip.net/json/" + ip;
                $http.get(url).success(function(res) {
                    $scope.center = {
                        lat: res.latitude,
                        lng: res.longitude,
                        zoom: 10
                    };
                    $scope.ip = res.ip;
                });
            };
            $scope.searchIP("");
       }]);