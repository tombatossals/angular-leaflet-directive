angular.module("leaflet-directive").directive('controls', function ($log, leafletHelpers, leafletControlHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: '?^leaflet',

        link: function(scope, element, attrs, controller) {
            if(!controller) {
                return;
            }

            var createControl = leafletControlHelpers.createControl,
                leafletScope  = controller.getLeafletScope(),
                controls = leafletScope.controls;

            controller.getMap().then(function(map) {
                for (var controlType in controls) {
                    var control;
                    if (controlType !== 'custom') {
                        control = createControl(controlType, controls[controlType]);
                    } else {
                        control = controls[controlType];
                    }
                    map.addControl(control);
                }
            });
        }
    };
});
