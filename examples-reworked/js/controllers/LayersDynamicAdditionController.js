        app.controller("LayersDynamicAdditionController", [ "$scope", function($scope) {
            $scope.definedLayers = {
                mapbox_wheat: {
                    name: 'Mapbox Wheat Paste',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia35jfp'
                    }
                },
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            };
            $scope.definedOverlays = {
                hillshade: {
                    name: 'Hillshade Europa',
                    type: 'wms',
                    url: 'http://129.206.228.72/cached/hillshade',
                    visible: true,
                    layerOptions: {
                        layers: 'europe_wms:hs_srtm_europa',
                        format: 'image/png',
                        opacity: 0.25,
                        attribution: 'Hillshade layer by GIScience http://www.osm-wms.de',
                        crs: L.CRS.EPSG900913
                    }
                }
            };
            angular.extend($scope, {
                bern: {
                    lat: 46.916,
                    lng: 7.466,
                    zoom: 10
                },
                layers: {
                    baselayers: {
                        osm: $scope.definedLayers.osm,
                        mapbox_wheat: $scope.definedLayers.mapbox_wheat
                    },
                    overlays: {
                        hillshade: $scope.definedOverlays.hillshade
                    }
                }
            });
            $scope.toggleLayer = function(layerName) {
                var baselayers = $scope.layers.baselayers;
                if (baselayers.hasOwnProperty(layerName)) {
                    delete baselayers[layerName];
                } else {
                    baselayers[layerName] = $scope.definedLayers[layerName];
                }
            };
            $scope.toggleOverlay = function(overlayName) {
                var overlays = $scope.layers.overlays;
                if (overlays.hasOwnProperty(overlayName)) {
                    delete overlays[overlayName];
                } else {
                    overlays[overlayName] = $scope.definedOverlays[overlayName];
                }
            };
        }]);