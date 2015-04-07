angular.module("leaflet-directive")
.directive('geojson', function ($log, $rootScope, leafletData, leafletHelpers,
    leafletWatchHelpers, leafletDirectiveControlsHelpers) {

    var _maybeWatchCollection = leafletWatchHelpers.maybeWatchCollection,
        _watchOptions = leafletHelpers.watchOptions,
        _extendDirectiveControls = leafletDirectiveControlsHelpers.extend;

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                leafletGeoJSON = {};

            controller.getMap().then(function(map) {
                var watchOptions = leafletScope.geojsonWatchOptions || _watchOptions;

                var _hookUpEvents = function(geojson){
                    var resetStyleOnMouseout = geojson.resetStyleOnMouseout;
                    var onEachFeature;

                    if (angular.isFunction(geojson.onEachFeature)) {
                        onEachFeature = geojson.onEachFeature;
                    } else {
                        onEachFeature = function(feature, layer) {
                            if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(geojson.label)) {
                                layer.bindLabel(feature.properties.description);
                            }

                            layer.on({
                                mouseover: function(e) {
                                    safeApply(leafletScope, function() {
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', feature, e);
                                    });
                                },
                                mouseout: function(e) {
                                    if (resetStyleOnMouseout) {
                                        leafletGeoJSON.resetStyle(e.target);
                                    }
                                    safeApply(leafletScope, function() {
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                    });
                                },
                                click: function(e) {
                                    safeApply(leafletScope, function() {
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', feature, e);
                                    });
                                }
                            });
                        };
                    }
                    return onEachFeature;
                };

                var _clean = function(){
                    if (isDefined(leafletGeoJSON) && map.hasLayer(leafletGeoJSON)) {
                        map.removeLayer(leafletGeoJSON);
                    }
                };

                var _create = function(geojson){
                    _clean();
                    
                    if (!(isDefined(geojson) && isDefined(geojson.data))) {
                        return;
                    }

                    var onEachFeature = _hookUpEvents(geojson);

                    if (!isDefined(geojson.options)) {
                        geojson.options = {
                            style: geojson.style,
                            filter: geojson.filter,
                            onEachFeature: onEachFeature,
                            pointToLayer: geojson.pointToLayer
                        };
                    }

                    leafletGeoJSON = L.geoJson(geojson.data, geojson.options);
                    leafletData.setGeoJSON(leafletGeoJSON, attrs.id);
                    leafletGeoJSON.addTo(map);
                };

                _extendDirectiveControls(attrs.id, 'geojson', _create, _clean);

                _maybeWatchCollection(leafletScope,'geojson', watchOptions, function(geojson){
                    _create(geojson);
                });
            });
        }
    };
});
