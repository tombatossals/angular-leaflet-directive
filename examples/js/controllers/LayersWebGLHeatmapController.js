        app.controller("LayersWebGLHeatmapController", [ "$scope", function($scope) {
            var dataPoints = [
                [44.651144316,-63.586260171, 0.5],
                [44.75, -63.5, 0.8] ];
            angular.extend($scope, {
                center: {
                    lat: 44.8091,
                    lng: -63.3636,
                    zoom: 9
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        heatmap: {
                            name: 'Heat Map',
                            type: 'webGLHeatmap',
                            data: dataPoints,
                            visible: true
                        }
                    }
                }
            });
        }]);