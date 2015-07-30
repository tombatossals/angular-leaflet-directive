        app.controller("LayersRefreshOverlayEveryMinuteController", [ "$scope", "$interval", function($scope, $interval) {
            angular.extend($scope, {
                amberes: {
                    lat: 51.2,
                    lng: 4.4,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia3no0m'
                            }
                        }
                    },
                    overlays: {
                        traffic: {
                            name: "Traffic Jams",
                            type: "xyz",
                            url: "http://map.be-mobile.be/customer/mobileninja/nl/los/{z}/{x}/{y}.png",
                            visible: 1,
                            doRefresh: false
                        }
                    }
                }
            });
            var refreshIntervalInSeconds = 60;
            var actualSeconds = 0;
            $interval(function() {
                if (actualSeconds === refreshIntervalInSeconds) {
                    $scope.layers.overlays.traffic.doRefresh = true;
                    console.log("Overlay refreshed.")
                    actualSeconds = 0;
                } else {
                    console.log("Next update of overlay in " + (refreshIntervalInSeconds - actualSeconds) + " seconds.");
                    actualSeconds += 1;
                }
            }, 1000);
        }]);