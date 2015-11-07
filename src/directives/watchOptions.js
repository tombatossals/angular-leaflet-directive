/*
    Create multiple similar directives for watchOptions to support directiveControl
    instead. (when watches are disabled)
    NgAnnotate does not work here due to the functional creation
*/
['markers', 'geojson'].forEach(function(name) {
  angular.module('leaflet-directive').directive(name + 'WatchOptions', [
      'leafletLogger', '$rootScope', '$q', 'leafletData', 'leafletHelpers',
        function(leafletLogger, $rootScope, $q, leafletData, leafletHelpers) {

          var isDefined = leafletHelpers.isDefined;
          var isObject = leafletHelpers.isObject;
          var _watchOptions = leafletHelpers.watchOptions;

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
                      leafletLogger.error('is not an object', 'watch options');
                  leafletScope[name + 'WatchOptions'] = _watchOptions;
                }
              });
            },
          };
        },]);
});
