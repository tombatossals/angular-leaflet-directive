'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe("Directive: leaflet: layers.overlays", function () {
    var $compile, $rootScope, leafletData, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function (_$compile_, _$rootScope_, _leafletData_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        scope = $rootScope.$new();
    }));

    afterEach(inject(function ($rootScope) {
        $rootScope.$apply();
    }));

    it('should check for a path in the layer group that is not visible', function() {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
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
                    lines: {
                        name: 'lines',
                        type: 'group',
                        visible: false
                    }
                }
            },
            paths : {
                p1: {
                    latlngs : [
                        [
                            { lat: 0.966, lng: 2.02 },
                            { lat: 2.02, lng: 4.04 }
                        ],
                        [
                            { lat: 0.466, lng: 1.02 },
                            { lat: 1.02, lng: 3.04 }
                        ]
                    ],
                    type: 'multiPolyline',
                    layer: 'lines'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" paths="paths"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        var paths;
        leafletData.getPaths().then(function(leafletPaths) {
            paths = leafletPaths;
        });

        scope.$digest();

        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(paths).length).toEqual(1);
            expect(layers.overlays.lines.hasLayer(paths.p1)).toBe(true);
            expect(map.hasLayer(paths.p1)).toBe(false);
        });
    });

    it('should check for a path in the layer group that is visible', function() {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
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
                    lines: {
                        name: 'lines',
                        type: 'group',
                        visible: true
                    }
                }
            },
            paths : {
                p1: {
                    latlngs : [
                        [
                            { lat: 0.966, lng: 2.02 },
                            { lat: 2.02, lng: 4.04 }
                        ],
                        [
                            { lat: 0.466, lng: 1.02 },
                            { lat: 1.02, lng: 3.04 }
                        ]
                    ],
                    type: 'multiPolyline',
                    layer: 'lines'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" paths="paths"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        var paths;
        leafletData.getPaths().then(function(leafletPaths) {
            paths = leafletPaths;
        });
        scope.$digest();

        leafletData.getLayers().then(function(layers) {
            expect(Object.keys(paths).length).toEqual(1);
            expect(layers.overlays.lines.hasLayer(paths.p1)).toBe(true);
            expect(map.hasLayer(paths.p1)).toBe(true);
        });
    });

    it('should check for a path in a wrong layer group', function() {
        angular.extend(scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
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
                    lines: {
                        name: 'lines',
                        type: 'group',
                        visible: true
                    }
                }
            },
            paths : {
                p1: {
                    latlngs : [
                        [
                            { lat: 0.966, lng: 2.02 },
                            { lat: 2.02, lng: 4.04 }
                        ],
                        [
                            { lat: 0.466, lng: 1.02 },
                            { lat: 1.02, lng: 3.04 }
                        ]
                    ],
                    type: 'multiPolyline',
                    layer: 'shapes'
                }
            }
        });
        var element = angular.element('<leaflet layers="layers" paths="paths"></leaflet>');
        element = $compile(element)(scope);
        leafletData.getPaths().then(function(paths) {
            expect(Object.keys(paths).length).toEqual(0);
        });
    });
});
