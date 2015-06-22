        app.controller("LayersEsriImageLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat: 43.415,
	                lng: -124.228,
	                zoom: 13
	            },
                layers: {
                    baselayers: {
                        gray: {
                            name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
                        }
                    },
                    overlays: {
                        infrared: {
					    	name: "Infrared Imagery",
					        type: "agsImage",
					        url: "http://imagery.oregonexplorer.info/arcgis/rest/services/NAIP_2011/NAIP_2011_Dynamic/ImageServer",
					        visible: true,
                            layerOptions: {
                                bandIds: "3,0,1"
                            }
				    	}
                    }
                },
            });
        }]);