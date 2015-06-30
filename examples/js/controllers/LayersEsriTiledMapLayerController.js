        app.controller("LayersEsriTiledMapLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
	            	lat: 30.70,
	                lng: -81.47,
	                zoom: 9
	            },
                layers: {
                    baselayers: {
				    	historic: {
					    	name: "Historic Topographic Maps",
					        type: "agsTiled",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
					        visible: false
				    	},
                        navigation: {
					    	name: "World Navigation Charts",
					        type: "agsTiled",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer",
					        visible: false
				    	}
                    }
                },
            });
        }]);