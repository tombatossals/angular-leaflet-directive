app.controller("DraggingMarkersController", [ '$scope', function($scope) {

    angular.extend($scope, {
        center: {
            lat: 40.095,
            lng: -3.823,
            zoom: 6
        },
        defaults: {
            scrollWheelZoom: false
        },
        markers: {
            Madrid: {
                lat: 40.095,
                lng: -3.823,
                message: "This is Madrid. But you can drag me to another position",
                focus: true,
                draggable: true
            },
            Barcelona: {
                lat: 41.38,
                lng: 2.18,
                message: "This is Barcelona. You can't drag me",
                focus: false,
                draggable: false
            }
        }
    });
}]);
