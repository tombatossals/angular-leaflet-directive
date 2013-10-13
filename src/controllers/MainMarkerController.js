app.controller("MainMarkerController", [ '$scope', function($scope) {
    angular.extend($scope, {
        osloCenter: {
            lat: 59.91,
            lng: 10.75,
            zoom: 12
        },
        osloMarker: {
            lat: 59.91,
            lng: 10.75,
            message: "I want to travel here!",
            focus: true,
            draggable: false
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}]);
