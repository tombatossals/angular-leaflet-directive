        app.controller("MixedLayersOverlaysGeoJSONController", ["$scope", function($scope){
            angular.extend($scope, {
                sanfrancisco: {
                    lat: 37.79,
                    lng: -122.4,
                    zoom: 17
                },
                defaults: {
                    scrollWheelZoom: false
                },
                layers:{
                    baselayers: {
                        osm:{
                            name: "OpenStreetMap (XYZ)",
                            type: "xyz",
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                            }
                        }
                    }
                    ,
                    overlays: {
                        buildings: {
                            name:'Buildings',
                            type: 'geoJSON',
                            url:'http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json',
                            layerOptions: {
                                style: {
                                    "color": "#00D",
                                    "fillColor": "#00D",
                                    "weight": 1.0,
                                    "opacity": 0.6,
                                    "fillOpacity": .2
                                }
                            },
                            pluginOptions:{
                                cliptiles: true
                            }
                        },
                        Roads:{
                            name:'Roads',
                            type: 'geoJSON',
                            url: 'http://tile.openstreetmap.us/vectiles-skeletron/{z}/{x}/{y}.json',
                            layerOptions: {
                                style: {
                                    "color": "#DD0000 ",
                                    "fillColor": "#DD0000",
                                    "weight": 1.0,
                                    "fillOpacity": .4
                                }
                            },
                            pluginOptions:{
                                cliptiles: false
                            }
                        }
                    }
                }
            })
        }]);