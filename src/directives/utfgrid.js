angular.module("leaflet-directive").directive('utfgrid', function ($log, $rootScope, leafletData, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                leafletUTFGrid = {};

            controller.getMap().then(function(map) {
                leafletScope.$watch("utfgrid", function(utfgrid) {
                
                    $log.error('[AngularJS - Leaflet] IN UTFGrid directive!');
                    if (isDefined(leafletUTFGrid) && map.hasLayer(leafletUTFGrid)) {
                        map.removeLayer(leafletUTFGrid);
                    }

                    if (!isDefined(utfgrid)) {
                        $log.error('[AngularJS - Leaflet] utfgrid is not defined!');
                        return;
                    }

                    leafletUTFGrid = new L.UtfGrid(utfgrid.url, utfgrid.pluginOptions);
                    leafletData.setUTFGrid(leafletUTFGrid, attrs.id);
                    map.addLayer(leafletUTFGrid);
                    $log.error('[AngularJS - Leaflet] Added UTFGrid to map!');

                    leafletUTFGrid.on('mouseover', function(e) {
                        safeApply(leafletScope, function() {
                            $rootScope.$broadcast('leafletDirectiveMap.utfgridMouseover', e);
                        });
                    });
                    
                    leafletUTFGrid.on('mouseout', function(e) {
                        safeApply(leafletScope, function() {
                            $rootScope.$broadcast('leafletDirectiveMap.utfgridMouseout', e);
                        });
                    });
                    
                    leafletUTFGrid.on('click', function(e) {
                        safeApply(leafletScope, function() {
                            $rootScope.$broadcast('leafletDirectiveMap.utfgridClick', e);
                        });
                    });
                    
                    leafletUTFGrid.options = {
                        useJsonP: false
                    };
                });
            });
        }
    };
});
