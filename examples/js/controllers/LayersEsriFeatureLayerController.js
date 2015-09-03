        app.controller("LayersEsriFeatureLayerController", [ "$scope", function($scope) {
            angular.extend($scope, {
                layercontrol: {
                    icons: {
                      uncheck: "fa fa-toggle-off",
                      check: "fa fa-toggle-on"
                    }
                },
                porland: {
	            	lat: 45.526,
	                lng: -122.667,
	                zoom: 14
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
                            type: "agsFeature",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0",
                            visible: true,
                            group: "Test"
                        },
                        points: {
                            name: "Styling Points",
                            type: "agsFeature",
                            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                pointToLayer: function (geojson, latlng) {
                                    if(geojson.properties.direction) {
                                        return L.marker(latlng, {
                                            icon: $scope.busIcons[geojson.properties.direction.toLowerCase()]
                                        });
                                    } else {
                                        return L.marker(latlng);
                                    }
                                }
                            },
                            group: "Test"
                        },
                        lines: {
                            name: "Styling Lines",
                            type: "agsFeature",
                            url: "http://services.arcgis.com/uCXeTVveQzP4IIcx/ArcGIS/rest/services/Bike_Routes/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                style: function (feature) {
                                    var c,o = 0.75;
                                    switch (feature.properties.BIKEMODE) {
                                        case "Low traffic through street":
                                            c = "#007D7D";
                                            break;
                                        case "Bike boulevard":
                                            c = "#00FF3C";
                                            break;
                                        case "Caution area":
                                            c = "#FF0000";
                                            break;
                                        case "Local multi-use path":
                                            c = "#00BEFF";
                                            break;
                                        case "Regional multi-use path":
                                            c = "#b1a9d0";
                                            break;
                                        case "Moderate traffic through street":
                                            c = "#FFEB00";
                                            break;
                                        case "Planned multi-use path":
                                            c = "#000000";
                                            break;
                                        case "Bike lane":
                                            c = "#328000";
                                            o = "0.70";
                                        break;
                                        case "High traffic through street":
                                            c = "#FFA500";
                                            break;
                                        case "Planned bike lane":
                                            c = "#000000";
                                            o = "1.0";
                                            break;
                                        default:
                                            c = "#C0C0C0";
                                    }
                                    return {color: c, opacity: o, weight: 5};
                                }
                            },
                            group: "Test"
                        },
                        polygons: {
                            name: "Styling Polygons",
                            type: "agsFeature",
                            url: "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Congressional_Districts/FeatureServer/0",
                            visible: false,
                            layerOptions: {
                                simplifyFactor: 0.5,
                                precision: 5,
                                style: function (feature) {
                                    if(feature.properties.PARTY === "Democrat"){
                                        return {color: "blue", weight: 2 };
                                    } else if(feature.properties.PARTY === "Republican"){
                                        return { color: "red", weight: 2 };
                                    } else {
                                        return { color: "white", weight: 2 };
                                    }
                                }
                            },
                            group: "Test"
                        },
                        group: {
                            name: "Grouped",
                            type: "group",
                            layerOptions: {
                                layers: [{
                                    name: "Simple",
                                    type: "agsFeature",
                                    url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0",
                                    visible: true,
                                    group: "Test"
                                }, {
                                    name: "Styling Points",
                                    type: "agsFeature",
                                    url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Trimet_Transit_Stops/FeatureServer/0",
                                    visible: false,
                                    layerOptions: {
                                        pointToLayer: function (geojson, latlng) {
                                            if(geojson.properties.direction) {
                                                return L.marker(latlng, {
                                                    icon: $scope.busIcons[geojson.properties.direction.toLowerCase()]
                                                });
                                            } else {
                                                return L.marker(latlng);
                                            }
                                        }
                                    }
                                }]
                            }
                        }
                    }
                },
                busIcons: {
                    north: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-north.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-north@2x.png",
                        iconSize: [27, 31],
                        iconAnchor: [13.5, 17.5],
                        popupAnchor: [0, -11],
                    }),
                    south: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-south.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-south@2x.png",
                        iconSize: [27, 31],
                        iconAnchor: [13.5, 13.5],
                        popupAnchor: [0, -11],
                    }),
                    east: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-east.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-east@2x.png",
                        iconSize: [31, 27],
                        iconAnchor: [13.5, 17.5],
                        popupAnchor: [0, -11],
                    }),
                    west: L.icon({
                        iconUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-west.png",
                        iconRetinaUrl: "http://esri.github.io/esri-leaflet/img/bus-stop-west@2x.png",
                        iconSize: [31, 27],
                        iconAnchor: [17.5, 13.5],
                        popupAnchor: [0, -11],
                    })
                }
            });
        }]);