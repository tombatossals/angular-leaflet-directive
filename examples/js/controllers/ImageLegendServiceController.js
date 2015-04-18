        app.controller("ImageLegendServiceController", [ "$scope", function($scope) {
            angular.extend($scope, {
            	options: {
            		controls: {
            			layers: {
            				visible: false
            			}
            		}
            	},
                usa: {
	            	lat: 39.931486,
	                lng: -101.406250,
	                zoom: 3
	            },
                markers: {
                    m1: {
                        lat: 39.931486,
	                	lng: -101.406250,
                    }
                },
                layers: {
					baselayers: {
						googleTerrain: {
						    name: 'Google Terrain',
						    layerType: 'TERRAIN',
						    type: 'google'
						}
                   },
                   overlays: {
                        sst: {
                            name: 'Analyses - Sea Surface Temperature',
                            type: 'wms',
                            url: 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/analyses',
                            visible: true,
                            layerOptions: {
                                layers: 'NCEP_RAS_ANAL_RTG_SST,NCEP_POLY_ANAL_RTG_SST',
                                format: 'image/png',
                                transparent: true,
                                attribution: 'NOAA/NOS nowCOAST',
                            }
                        },
				    	wave: {
                            name: 'Forecasts - Wave height',
                            type: 'wms',
                            url: 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/forecasts',
                            visible: false,
                            layerOptions: {
                                layers: 'NDFD_RAS_WAVEH_3_00,NDFD_POLY_WAVEH_3_00',
                                format: 'image/png',
                                transparent: true,
                                attribution: 'NOAA/NOS nowCOAST',
                            }
                        }
                    }
                },
                legend: {
                	url: "http://nowcoast.noaa.gov/LayerInfo?layer=NCEP_RAS_ANAL_RTG_SST&data=legend",
                	legendClass: "info legend",
					position: "bottomleft",
                    type: "image"
                },
                legendURL1: "http://nowcoast.noaa.gov/LayerInfo?layer=NCEP_RAS_ANAL_RTG_SST&data=legend",
                legendURL2: "http://nowcoast.noaa.gov/LayerInfo?layer=NDFD_RAS_WAVEH_3_00&data=legend",
                switchLegend: function() {
                        $scope.layers.overlays.sst.visible = !$scope.layers.overlays.sst.visible;
                        $scope.layers.overlays.wave.visible = !$scope.layers.overlays.wave.visible;
                        $scope.legend.url == $scope.legendURL1? $scope.legendURL2:$scope.legendURL1;
                }
            });
        }]);