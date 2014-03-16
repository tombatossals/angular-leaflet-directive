angular.module("leaflet-directive").directive('paths', function ($log, leafletData, leafletMapDefaults, leafletHelpers, leafletPathsHelpers, leafletEvents) {
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
                bindPathEvents = leafletEvents.bindPathEvents,
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

                leafletScope.$watch("paths", function (newPaths) {
                    // Create the new paths
                    for (var newName in newPaths) {
                        if (newName.search("-") !== -1) {
                            $log.error('[AngularJS - Leaflet] The path name "' + newName + '" is not valid. It must not include "-" and a number.');
                            continue;
                        }

                        if (!isDefined(leafletPaths[newName])) {
                            var pathData = newPaths[newName];
                            var newPath = createPath(newName, newPaths[newName], defaults);

                            // bind popup if defined
							if (isDefined(newPath) && isDefined(pathData.message)) {
                                newPath.bindPopup(pathData.message);
                            }

                            // Show label if defined
                            if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(pathData.label) && isDefined(pathData.label.message)) {
                                newPath.bindLabel(pathData.label.message, pathData.label.options);
                            }

                            // Listen for changes on the new path
                            if (isDefined(newPath)) {
                                leafletPaths[newName] = newPath;
                                map.addLayer(newPath);
                                watchPathFn(newPath, newName);
                            }

                            bindPathEvents(newPath, newName, pathData, leafletScope);
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
