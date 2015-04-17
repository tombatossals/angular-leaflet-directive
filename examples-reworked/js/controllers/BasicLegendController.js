        app.controller('BasicLegendController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#ff0000', '#28c9ff', '#0000ff', '#ecf386' ],
                    labels: [ 'National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway' ]
                },
                defaults: {
                    tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
                }
            });
        } ]);