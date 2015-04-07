        app.config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    template: '<a href="#/map">Go to Map</a>'
                })
                .when('/map', {
                    template: '<button type="button" ng-click="makeFit()">Make Fit!</button><a href="#/">Go Back!</a><leaflet></leaflet>',
                    controller: 'MapCtrl'
                })
            });
        app.controller('MapCtrl', [ '$scope', 'leafletData', function($scope, leafletData) {
           $scope.makeFit = function() {
               leafletData.getMap().then(function(map) {
                   map.fitBounds([
                       [48.7120066603552, 9.04994057067812],
                       [48.6120066603552, 9.14994057067812]]);
                   });
            };
        } ]);