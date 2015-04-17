        app.controller("MixedMapboxTilesGeojsonController", [ "$scope", "$http", function($scope, $http) {
            angular.extend($scope, {
                center: {
                    lat: -33.8979173,
                    lng: 151.2323598,
                    zoom: 14
                },
                tiles: {
                    name: 'Mapbox Park',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ',
                        mapid: 'feelcreative.llm8dpdk'
                    }
                },
                geojson: {}
            });
            $http.get("https://a.tiles.mapbox.com/v4/feelcreative.llm8dpdk/features.json?access_token=pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ").success(function(data) {
                $scope.geojson.data = data;
                console.log(data);
            });
        }]);