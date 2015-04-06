angular.module("leaflet-directive").directive('markersWatchOptions',
    function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMarkersHelpers) {
    //less terse vars to helpers
    var isDefined = leafletHelpers.isDefined,
        errorHeader = leafletHelpers.errorHeader,
        isObject = leafletHelpers.isObject,
        _markersWatchOptions = leafletMarkersHelpers.markersWatchOptions;

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                leafletScope = mapController.getLeafletScope();


                if(isDefined(scope.markersWatchOptions)) {
                    if(isObject(scope.markersWatchOptions))
                        angular.extend(_markersWatchOptions, scope.markersWatchOptions);
                    else
                        $log.error(errorHeader + ' [markers] markersWatchOptions is not an object');
                    leafletScope.markersWatchOptions = _markersWatchOptions;
                }
        }
    };
});

