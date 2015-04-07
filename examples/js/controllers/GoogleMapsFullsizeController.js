        app.controller("GoogleMapsFullsizeController", [ "$scope", "$element", function($scope, $element) {
            angular.extend($scope, {
                berlin: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: 14
                },
                markers: {
                    m1: {
                        lat: 52.52,
                        lng: 13.40
                    }
                },
                layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
	                        name: 'Google Hybrid',
	                        layerType: 'HYBRID',
	                        type: 'google'
	                    },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
            });
        }]);