        app.controller("BasicDoubleMapSharingAttributesController", [ "$scope", "$log", "$http", "leafletData", function($scope, $log, $http, leafletData) {
            angular.extend($scope, {
                center: {
                    lat: 43.7350,
                    lng: -79.3734,
                    zoom: 11
                },
                defaults: {
                    scrollWheelZoom: false
                },
                markers1: {
                    one: {
                        lat: 43.75,
                        lng: -79.56
                    },
                    two: {
                        lat: 43.76,
                        lng: -79.50
                    }
                },
                markers2: {
                    one: {
                        lat: 43.75,
                        lng: -79.56
                    },
                    two: {
                        lat: 43.75,
                        lng: -79.45
                    },
                    three: {
                        lat: 43.81,
                        lng: -79.26
                    }
                }
            });
            $http.get('json/toronto1.json').success(function(data, status) {
                $scope.toronto1 = data;
            });
            $http.get('json/toronto2.json').success(function(data, status) {
                $scope.toronto2 = data;
            });
        }]);