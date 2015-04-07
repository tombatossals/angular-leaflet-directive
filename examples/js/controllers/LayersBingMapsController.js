        app.controller("LayersBingMapsController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bastia: {
                    lat: 42.7029,
                    lng: 9.4529,
                    zoom: 13
                },
                markers: {
                    bastia: {
                        lat: 67.6755,
                        lng: 9.4529
                    }
                },
                layers: {
                    baselayers: {
                        bingAerial: {
                            name: 'Bing Aerial',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Aerial'
                            }
                        },
                        bingRoad: {
                            name: 'Bing Road',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Road'
                            }
                        },
                        bingAerialWithLabels: {
                            name: 'Bing Aerial With Labels',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'AerialWithLabels'
                            }
                        },
                    }
                }
            });
        }]);