        app.controller("LayersHideOverlaysOnSelectorController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                defaults: {
                    scrollWheelZoom: false
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'Mapbox Streets',
                            url: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                showOnSelector: true,
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.ll5em372'
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
                                showOnSelector: false,
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
        }]);