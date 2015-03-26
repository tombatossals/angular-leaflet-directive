'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe('Directive: leaflet', function() {
    var $compile, $rootScope, leafletData, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        scope = $rootScope.$new();
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));


    it('should have two maps with distinct layers', function() {
        var scope2 = $rootScope.$new();
        angular.extend(scope, {
             layers1: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap2',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    shapes1: {
                        name: 'shapes1',
                        type: 'group',
                        visible: true
                    }
                }
            },
            markers1: {
                m1: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'shapes1'
                }
            }
        });
        angular.extend(scope2, {
            layers2:
            {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap2',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    shapes2: {
                        name: 'shapes2',
                        type: 'group',
                        visible: true
                    }
                }
            },
            markers2: {
                m1: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'shapes2'
                }
            }
        });

        var elements = [];
        elements.push(angular.element('<leaflet id="map1" layers="layers1" markers="markers1"></leaflet>'));
        elements.push(angular.element('<leaflet id="map2" layers="layers2" markers="markers2"></leaflet>'));

        var ctrl = [];
        ctrl.push($compile(elements[0])(scope));
        ctrl.push($compile(elements[1])(scope2));
        scope.$digest();
        scope2.$digest();

        leafletData.getMap("map1").then(function(map) {
            leafletData.getLayers("map1").then(function(layers) {
                expect(map.hasLayer(layers.overlays.shapes2)).toBe(false);
                expect(map.hasLayer(layers.overlays.shapes1)).toBe(true);
            });
        });

        leafletData.getMap("map2").then(function(map) {
            leafletData.getLayers("map2").then(function(layers) {
                expect(map.hasLayer(layers.overlays.shapes1)).toBe(false);
                expect(map.hasLayer(layers.overlays.shapes2)).toBe(true);
            });
        });

    });
    it('should have two maps with distinct markers', function() {
        var scope2 = $rootScope.$new();
        angular.extend(scope, {
             layers1: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap2',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    layer1: {
                        name: 'layer1',
                        type: 'group',
                        visible: true
                    }
                }
            },
            markers1: {
                m1: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'layer1'
                }
            }
        });
        angular.extend(scope2, {
            layers2:
            {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap2',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    layer2: {
                        name: 'layer2',
                        type: 'group',
                        visible: true
                    }
                }
            },
            markers2: {
                m2: {
                    lat: 1.2,
                    lng: 0.3,
                    layer: 'layer2'
                }
            }
        });

        var elements = [];
        elements.push(angular.element('<leaflet id="map1" layers="layers1" markers="markers1"></leaflet>'));
        elements.push(angular.element('<leaflet id="map2" layers="layers2" markers="markers2"></leaflet>'));

        var ctrl = [];
        ctrl.push($compile(elements[0])(scope));
        ctrl.push($compile(elements[1])(scope2));
        scope.$digest();
        scope2.$digest();

        leafletData.getMap("map1").then(function(map) {
            var markers;
            leafletData.getMarkers("map1").then(function(leafletMarkers) {
                markers = leafletMarkers;
            });

            leafletData.getLayers("map1").then(function(layers) {
                expect(Object.keys(markers).length).toEqual(1);
                expect(markers.m1 instanceof L.Marker).toBe(true);
                expect(markers.m2 instanceof L.Marker).toBe(false);
                expect(layers.overlays.layer1 instanceof L.LayerGroup).toBe(true);

                expect(layers.overlays.layer1.hasLayer(markers.m1)).toBe(true);
                expect(map.hasLayer(markers.m1)).toBe(true);
            });
        });

        leafletData.getMap("map2").then(function(map) {
            var markers;
            leafletData.getMarkers("map2").then(function(leafletMarkers) {
                markers = leafletMarkers;
            });
            leafletData.getLayers("map2").then(function(layers) {
                expect(Object.keys(markers).length).toEqual(1);
                expect(markers.m1 instanceof L.Marker).toBe(false);
                expect(markers.m2 instanceof L.Marker).toBe(true);

                expect(layers.overlays.layer2 instanceof L.LayerGroup).toBe(true);
                expect(layers.overlays.layer2.hasLayer(markers.m2)).toBe(true);
                expect(map.hasLayer(markers.m2)).toBe(true);
            });
        });
    });

});
