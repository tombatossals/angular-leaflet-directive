angular.module("leaflet-directive").directive('controls', function ($log, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: '?^leaflet',

        link: function(scope, element, attrs, controller) {
            if(!controller) {
                return;
            }

            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                controls = leafletScope.controls;

            controller.getMap().then(function(map) {
                if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {

                    if (!isDefined(controls.edit)) {
                        controls.edit = { featureGroup: new L.FeatureGroup() };
                        map.addLayer(controls.edit.featureGroup);
                    }

                    var drawControl = new L.Control.Draw(controls);
                    map.addControl(drawControl);
                }

                if (isDefined(controls.scale)) {
                    var scaleControl = new L.control.scale(controls.scale);
                    map.addControl(scaleControl);
                }

                if (isDefined(controls.fullscreen)) {
                    if (leafletHelpers.FullScreenControlPlugin.isLoaded()) {
                        var fullscreenControl = new L.Control.Fullscreen(controls.fullscreen);
                        map.addControl(fullscreenControl);
                    } else {
                        $log.error('[AngularJS - Leaflet] Fullscreen plugin is not loaded.');
                    }
                }

                if (isDefined(controls.custom)) {
                    for(var i in controls.custom) {
                        map.addControl(controls.custom[i]);
                    }
                }
            });
        }
    };
});
