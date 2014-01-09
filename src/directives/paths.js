angular.module("leaflet-directive").directive('paths', function ($log, leafletData, leafletMapDefaults, leafletHelpers, leafletPathsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                paths     = leafletScope.paths,
                createPath = leafletPathsHelpers.createPath,
                setPathOptions = leafletPathsHelpers.setPathOptions;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);

                if (!isDefined(paths)) {
                    return;
                }

                var leafletPaths = {};
                leafletData.setPaths(leafletPaths, attrs.id);

                // Function for listening every single path once created
                var watchPathFn = function(leafletPath, name) {
                    var clearWatch = leafletScope.$watch('paths.' + name, function(pathData) {
                        if (!isDefined(pathData)) {
                            map.removeLayer(leafletPath);
                            clearWatch();
                            return;
                        }
                        setPathOptions(leafletPath, pathData.type, pathData);
                    }, true);
                };

                scope.$watch("paths", function (newPaths) {
                    // Create the new paths
                    for (var new_name in newPaths) {
                        if (!isDefined(leafletPaths[new_name])) {
                            var newPath = createPath(new_name, newPaths[new_name], defaults);

                            // Listen for changes on the new path
                            if (isDefined(newPath)) {
                                leafletPaths[new_name] = newPath;
                                map.addLayer(newPath);
                                watchPathFn(newPath, new_name);
                            }
                        }
                    }

                    // Delete paths (by name) from the array
                    for (var name in leafletPaths) {
                        if (!isDefined(newPaths[name])) {
                            delete leafletPaths[name];
                        }
                    }
                }, true);
            });
        }
    };
});
