var home = angular.module('app.home', ['leaflet-directive', 'hljs']);

home.controller('HomeController', [ '$scope', '$location', HomeController ]);
home.controller('BasicCenterController', [ '$scope', BasicCenterController ]);

function HomeController($location) {
    angular.extend(this, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 8
        },
        defaults: {
            scrollWheelZoom: false,
            attributionControl: false,
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            }
        }
    });
}
