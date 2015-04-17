        app.config(function ($routeProvider) {
            $routeProvider.when('/map', {
                template: '<leaflet width="100%" height="480px"></leaflet>',
                controller: 'BasicDynamicAddRemoveMapExample'
            });
        });
        app.controller('BasicDynamicAddRemoveMapExample', [ '$scope', 'leafletData', function($scope, leafletData) {
        } ]);