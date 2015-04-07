        app.controller("ControlsScaleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                controls: {
                    scale: true
                }
           });
       }]);