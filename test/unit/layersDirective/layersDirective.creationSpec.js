'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe('Directive: leaflet: layers.creation', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var scope;

  beforeEach(module('leaflet-directive'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    leafletData = _leafletData_;
    scope = $rootScope.$new();
  }));

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  it('should not create layers if not specified', function() {
    angular.extend(scope, {
      layers: {},
    });

    // If we not provide layers the system will use the default
    var element = angular.element('<leaflet></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(layers).toBe({});
    });
  });

  it('miss-configured layers persist', function() {
    var nolayers = {
      baselayers: {},
      overlays: {},
    };
    angular.extend(scope, {
      layers: nolayers,
    });

    // If we not provide layers the system will use the default
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(layers).toEqual(nolayers);
    });
  });

  it('should create layers if baselayers is defined with data', function() {
    angular.extend(scope, {
      layers: {
        baselayers: {
          m1: {},
        },
        overlays: {},
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(layers).not.toBe(undefined);
      expect(layers.baselayers).toEqual({});
    });
  });

  it('should create one layer if correctly configured', function() {
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
              continuousWorld: true,
            },
          },
          m1: {},
        },
        overlays: {},
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(map.hasLayer(layers.baselayers.osm)).toBe(true);
    });
  });

  it('should create image overlay layer if correctly configured', function() {
    angular.extend(scope, {
      layers: {
        baselayers: {
          imageOverlay: {
            name: 'imageOverlay',
            type: 'imageOverlay',
            url: 'url',
            bounds: [[0, 1], [1, 0]],
            layerOptions: {},
          },
        },
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(map.hasLayer(layers.baselayers.imageOverlay)).toBe(true);
    });
  });

  it('should create two layers if correctly configured', function() {
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
              continuousWorld: true,
            },
          },
          cycle: {
            name: 'OpenCycleMap',
            type: 'xyz',
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            top: true,
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
        },
        overlays: {},
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    var map;
    leafletData.getMap().then(function(leafletMap) {
      map = leafletMap;
    });

    scope.$digest();
    leafletData.getLayers().then(function(layers) {
      expect(Object.keys(layers.baselayers).length).toEqual(2);
      expect(map.hasLayer(layers.baselayers.cycle)).toBe(true);
      expect(map.hasLayer(layers.baselayers.osm)).toBe(false);
    });
  });

  it('should create two different type layers if correctly configured', function() {
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
              continuousWorld: true,
            },
          },
          osmwms: {
            name: 'OpenStreetMap WMS Omniscale',
            type: 'wms',
            url: 'http://osm.omniscale.net/proxy/service',
            layerOptions: {
              layers: 'osm',
              format: 'image/png',
            },
          },
        },
        overlays: {},
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    leafletData.getLayers().then(function(layers) {
      expect(Object.keys(layers.baselayers).length).toEqual(2);
    });
  });

  it('should refuse to create malformed layers', function() {
    angular.extend(scope, {
      layers: {
        baselayers: {
          osm: {
            badname: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osm2: {
            name: null,
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osm3: {
            name: 'OpenStreetMap',
            badtype: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osm4: {
            name: 'OpenStreetMap',
            type: null,
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osm5: {
            name: 'OpenStreetMap',
            type: 'xyz',
            badurl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osm6: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: null,
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
          osmwms: {
            type: 'wms',
            url: 'http://osm.omniscale.net/proxy/service',
            layerOptions: {
              layers: 'osm',
              format: 'image/png',
            },
          },
          imageOverlay1: {
            name: 'imageOverlay',
            type: 'imageOverlay',
            bounds: [[0, 1], [1, 0]],
            layerOptions: {},
          },
          imageOverlay2: {
            name: 'imageOverlay',
            type: 'imageOverlay',
            url: 'url',
            layerOptions: {},
          },
        },
        overlays: {},
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    leafletData.getLayers().then(function(layers) {
      expect(Object.keys(layers.baselayers).length).toEqual(0);
    });
  });
});
