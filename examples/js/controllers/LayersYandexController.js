        app.controller("LayersYandexController", [ "$scope", function($scope) {
            angular.extend($scope, {
                berlin: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: 14
                },
                markers: {
                    m1: {
                        lat: 52.52,
                        lng: 13.40
                    }
                },
                layers: {
                    baselayers: {
                      yandex: {
                        name: 'Yandex',
                        type: 'yandex',
                        layerOptions: {
                          layerType: 'map',
                        }
                      },
                      yandexTraffic: {
                        name: 'Yandex Traffic',
                        type: 'yandex',
                        layerOptions: {
                          layerType: 'map',
                          traffic: true,
                        }
                      }
                    }
                }
            });
        }]);