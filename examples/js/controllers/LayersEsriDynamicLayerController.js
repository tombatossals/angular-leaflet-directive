        app.controller("LayersEsriDynamicLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bogota: {
	            	lat: 4.649,
	                lng: -74.086,
	                zoom: 15
	            },
                markers: {
                    m1: {
                        lat: 4.649,
	                	lng: -74.086,
                    }
                },
                layers: {
                    baselayers: {
				    	world: {
					    	name: "Imagery",
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
					        visible: false,
					        layerOptions: {
					            layers: [0, 1, 2, 3],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
				    	topo: {
					    	name: "World Topographic",
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
					        visible: false,
					        layerOptions: {
					            layers: [0],
				                opacity: 0.9,
				                attribution: "Copyright:© 2014 Esri, FAO, NOAA"
					        }
				    	},
                    },
                },
            });
        }]);