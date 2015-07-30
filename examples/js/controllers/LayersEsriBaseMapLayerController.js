        app.controller("LayersEsriBaseMapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                bogota: {
	            	lat: 4.649,
	                lng: -74.086,
	                zoom: 5
	            },
                markers: {
                    m1: {
                        lat: 4.649,
	                	lng: -74.086,
                    }
                },
                layers: {
                    baselayers: {
				    	streets: {
					    	name: "Streets",
					        type: "agsBase",
					        layer: "Streets",
					        visible: false
				    	},
				    	topo: {
					    	name: "World Topographic",
					        type: "agsBase",
					        layer: "Topographic",
					        visible: false
				    	},
                        national: {
                            name: "National Geographic",
					        type: "agsBase",
					        layer: "NationalGeographic",
					        visible: false
                        },
                        oceans: {
                            name: "Oceans",
					        type: "agsBase",
					        layer: "Oceans",
					        visible: false
                        },
                        gray: {
                            name: "Gray",
					        type: "agsBase",
					        layer: "Gray",
					        visible: false
                        },
                        darkgray: {
                            name: "DarkGray",
					        type: "agsBase",
					        layer: "DarkGray",
					        visible: false
                        },
                        imagery: {
                            name: "Imagery",
					        type: "agsBase",
					        layer: "Imagery",
					        visible: false
                        },
                        shadedrelief: {
                            name: "ShadedRelief",
					        type: "agsBase",
					        layer: "ShadedRelief",
					        visible: false
                        },
                        terrain: {
                            name: "Terrain",
					        type: "agsBase",
					        layer: "Terrain",
					        visible: false
                        }
                    },
                },
            });
        }]);