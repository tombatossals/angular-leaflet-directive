angular.module("leaflet-directive")
.directive('geojson', function ($log, $rootScope, leafletData, leafletHelpers,
<<<<<<< HEAD
    leafletWatchHelpers, leafletDirectiveControlsHelpers,leafletIterators) {

    var _maybeWatchCollection = leafletWatchHelpers.maybeWatchCollection,
        _watchOptions = leafletHelpers.watchOptions,
        _extendDirectiveControls = leafletDirectiveControlsHelpers.extend,
        hlp = leafletHelpers,
        $it = leafletIterators;
=======
    leafletWatchHelpers, leafletDirectiveControlsHelpers) {

    var _maybeWatchCollection = leafletWatchHelpers.maybeWatchCollection,
        _watchOptions = leafletHelpers.watchOptions,
        _extendDirectiveControls = leafletDirectiveControlsHelpers.extend;
>>>>>>> - leafletWatchHelpers for sharing unwatch code with other directives

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

<<<<<<< HEAD
                var isNested = (hlp.isDefined(attrs.geojsonNested) &&
                    hlp.isTruthy(attrs.geojsonNested));

                var _clean = function(){
                    var _remove = function(lObject) {
                        if (isDefined(lObject) && map.hasLayer(lObject)) {
                            map.removeLayer(lObject);
                        }
                    };
                    if(isNested) {
                        $it.each(leafletGeoJSON, function(lObject) {
                            _remove(lObject);
                        });
                        return;
                    }
                    _remove(leafletGeoJSON);
                };

                var _addGeojson = function(geojson, maybeName){
                    if (!(isDefined(geojson) && isDefined(geojson.data))) {
                        return;
                    }
=======
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

>>>>>>> - leafletWatchHelpers for sharing unwatch code with other directives
                    var onEachFeature = _hookUpEvents(geojson);

                    if (!isDefined(geojson.options)) {
                        geojson.options = {
                            style: geojson.style,
                            filter: geojson.filter,
                            onEachFeature: onEachFeature,
                            pointToLayer: geojson.pointToLayer
                        };
                    }

                    var lObject = L.geoJson(geojson.data, geojson.options);

                    if(maybeName && hlp.isString(maybeName)){
                        leafletGeoJSON[maybeName] = lObject;
                    }
                    else{
                        leafletGeoJSON = lObject;
                    }
                    leafletData.setGeoJSON(leafletGeoJSON, attrs.id);
<<<<<<< HEAD
                    lObject.addTo(map);
                };

                var _create = function(model){
                    _clean();
                    if(isNested) {
                        if(!model || !Object.keys(model).length)
                            return;
                        $it.each(model, function(m, name) {
                            //name could be layerName and or groupName
                            //for now it is not tied to a layer
                            _addGeojson(m,name);
                        });
                        return;
                    }
                    _addGeojson(model);
=======
                    leafletGeoJSON.addTo(map);
>>>>>>> - leafletWatchHelpers for sharing unwatch code with other directives
                };

                _extendDirectiveControls(attrs.id, 'geojson', _create, _clean);

                _maybeWatchCollection(leafletScope,'geojson', watchOptions, function(geojson){
                    _create(geojson);
                });
            });
        }
    };
});
