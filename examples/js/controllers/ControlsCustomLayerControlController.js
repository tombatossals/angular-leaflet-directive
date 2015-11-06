        app.controller("ControlsCustomLayerControlController", [ "$scope", function($scope) {
            angular.extend($scope, {
                layercontrol: {
                    icons: {
                      uncheck: "fa fa-toggle-off",
                      check: "fa fa-toggle-on"
                    }
                },
                madrid: {
                    lat: 40.415363,
                    lng: -3.707398,
                    zoom: 11
                },
                markers: {
                    m1: {
                        lat: 42.20133,
                        lng: 2.19110
                    }
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: "OpenStreetMap",
                            type: "xyz",
                            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            layerOptions: {
                                subdomains: ["a", "b", "c"],
                                attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            }
                        },
                        cycle: {
                            name: "OpenCycleMap",
                            type: "xyz",
                            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                            layerOptions: {
                                subdomains: ["a", "b", "c"],
                                attribution: "&copy; <a href=\"http://www.opencyclemap.org/copyright\">OpenCycleMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            }
                        }
                    },
                    overlays: {
                        hillshade: {
                            name: "Hillshade Europa",
                            type: "wms",
                            url: "http://129.206.228.72/cached/hillshade",
                            visible: true,
                            layerOptions: {
                                layers: "europe_wms:hs_srtm_europa",
                                format: "image/png",
                                opacity: 0.25,
                                attribution: "Hillshade layer by GIScience http://www.osm-wms.de",
                                crs: L.CRS.EPSG900913
                            },
                            group: "Raster"
                        },
                        fire: {
                            name: "Fire Stations",
                            type: "xyz",
                            url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
                            layerOptions: {
                                attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            },
                            group: "Open Fire Map"
                        },
                        em: {
                            name: "Emergency Rooms",
                            type: "xyz",
                            url: "http://openfiremap.org/eytiles/{z}/{x}/{y}.png",
                            layerOptions: {
                                attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                                continuousWorld: true
                            },
                            group: "Open Fire Map"
                        }
                    }
                },
                removeFireLayer: function() {
                    delete this.layers.overlays.fire;
                },
                addFireLayer: function() {
                    this.layers.overlays.fire = {
                        name: "Fire Stations",
                        type: "xyz",
                        url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
                        layerOptions: {
                            attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        },
                        group: "Open Fire Map"
                    };
                },
                existsFireLayer: function() {
                    return ("fire" in this.layers.overlays);
                },
                removeEmergencyRooms: function() {
                    delete this.layers.overlays.em;
                },
                addEmergencyRooms: function() {
                    this.layers.overlays.em = {
                        name: "Emergency Rooms",
                        type: "xyz",
                        url: "http://openfiremap.org/eytiles/{z}/{x}/{y}.png",
                        layerOptions: {
                            attribution: "&copy; <a href=\"http://www.openfiremap.org\">OpenFireMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        },
                        group: "Open Fire Map"
                    };
                },
                existsEmergencyRooms: function() {
                    return ("em" in this.layers.overlays);
                },
                removeHillshadeLayer: function() {
                    delete this.layers.overlays.hillshade;
                },
                addHillshadeLayer: function() {
                    this.layers.overlays.hillshade = {
                        name: "Hillshade Europa",
                        type: "wms",
                        url: "http://129.206.228.72/cached/hillshade",
                        visible: true,
                        layerOptions: {
                            layers: "europe_wms:hs_srtm_europa",
                            format: "image/png",
                            opacity: 0.25,
                            attribution: "Hillshade layer by GIScience http://www.osm-wms.de",
                            crs: L.CRS.EPSG900913
                        },
                        group: "Raster"
                    };
                },
                existsHillshadeLayer: function() {
                    return ("hillshade" in this.layers.overlays);
                }
            });
        } ]);