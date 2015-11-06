/*
    Create multiple similar directives for watchOptions to support directiveControl
    instead. (when watches are disabled)
    NgAnnotate does not work here due to the functional creation
*/
['markers', 'geojson'].forEach(function(name) {
  angular.module('leaflet-directive').directive(name + 'WatchOptions', [
      '$log', '$rootScope', '$q', 'leafletData', 'leafletHelpers',
        function($log, $rootScope, $q, leafletData, leafletHelpers) {

          var isDefined = leafletHelpers.isDefined,
              errorHeader = leafletHelpers.errorHeader,
              isObject = leafletHelpers.isObject,
              _watchOptions = leafletHelpers.watchOptions;

          return {
            restrict: 'A',
            scope: false,
            replace: false,
            require: ['leaflet'],

            link: function(scope, element, attrs, controller) {
              var mapController = controller[0],
                  leafletScope = mapController.getLeafletScope();

              mapController.getMap().then(function() {
                if (isDefined(scope[name + 'WatchOptions'])) {
                  if (isObject(scope[name + 'WatchOptions']))
                      angular.extend(_watchOptions, scope[name + 'WatchOptions']);
                  else
                      $log.error(errorHeader + '[' + name + 'WatchOptions] is not an object');
                  leafletScope[name + 'WatchOptions'] = _watchOptions;
                }
              });
            },
          };
        }, ]);
});
