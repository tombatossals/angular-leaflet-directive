app.controller("EventsController", [ '$scope', function($scope) {

    angular.extend($scope, {
        center: {
            lat: 52.374004,
            lng: 4.890359,
            zoom: 7
        },
        defaults: {
            scrollWheelZoom: false
        },
        events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        }
    });

    $scope.eventDetected = "No events yet...";

    $scope.$on('leafletDirectiveMap.zoomstart', function(event){
        $scope.eventDetected = "ZoomStart";
    });

    $scope.$on('leafletDirectiveMap.drag', function(event){
        $scope.eventDetected = "Drag";
    });

    $scope.$on('leafletDirectiveMap.click', function(event){
        $scope.eventDetected = "Click";
    });

    $scope.$on('leafletDirectiveMap.mousemove', function(event){
        $scope.eventDetected = "MouseMove";
    });
}]);
