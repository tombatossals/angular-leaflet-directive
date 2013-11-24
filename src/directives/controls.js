angular.module("leaflet-directive").directive('controls', function ($log, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                controls = leafletScope.controls;

            controller.getMap().then(function(map) {
                if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {
                    var drawControl = new L.Control.Draw(controls.draw.options);
                    map.addControl(drawControl);
                }
            });
        }
    };
});
