angular.module("leaflet-directive").directive('controls', function ($log) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function($scope, element, attrs, controller) {
            var controls = $scope.controls;
            controller.getMap().then(function(map) {
                if (isDefined(controls.draw)) {
                    var drawControl = new L.Control.Draw();
                    map.addControl(drawControl);
                }
            });
        }
    };
});
