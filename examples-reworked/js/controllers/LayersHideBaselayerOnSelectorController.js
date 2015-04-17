        app.controller("LayersHideBaselayerOnSelectorController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
        }]);