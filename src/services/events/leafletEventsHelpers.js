angular.module("leaflet-directive")
.factory('leafletEventsHelpers', function ($rootScope, $q, $log, leafletHelpers) {
        var safeApply = leafletHelpers.safeApply,
            isDefined = leafletHelpers.isDefined;

        var _fire = function(scope, broadcastName, logic, event, lObject, model, modelName, layerName){
            // Safely broadcast the event
            safeApply(scope, function(){
                var toSend = {
                    leafletEvent: event,
                    leafletObject: lObject,
                    modelName: modelName,
                    model: model
                };
                if (isDefined(layerName))
                    angular.extend(toSend, {layerName: layerName});

                if (logic === "emit") {
                    scope.$emit(broadcastName, toSend);
                } else {
                    $rootScope.$broadcast(broadcastName, toSend);
                }
            });
        };

        return {
            fire: _fire
        }
});
