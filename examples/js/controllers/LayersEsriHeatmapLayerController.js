        app.controller("LayersEsriHeatmapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat:  40.706,
	                lng: -73.926,
	                zoom: 14
	            },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
				    	}
                    },
                    overlays: {
                        simple: {
                            name: "Simple",
                            type: "agsHeatmap",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Graffiti_Reports/FeatureServer/0",
                            visible: true,
                            layerOptions: {
                                radius: 14,
                                gradient: {
                                    0.2: "#ffffb2",
                                    0.4: "#fd8d3c",
                                    0.6: "#fd8d3c",
                                    0.8: "#f03b20",
                                    1: "#bd0026"
                                }
                            }
                        }
                    }
                }
            });
        }]);