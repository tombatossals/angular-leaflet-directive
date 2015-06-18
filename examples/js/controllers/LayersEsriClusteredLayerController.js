        app.controller("LayersEsriClusteredLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                porland: {
	            	lat: 45.526,
	                lng: -122.667,
	                zoom: 15
	            },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Streets",
					        type: "agsBase",
					        layer: "Streets",
					        visible: false
				    	}
                    },
                    overlays: {
                        simple: {
                            name: "Simple",
                            type: "agsClustered",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                            visible: true
                        }
                    }
                }
            });
        }]);