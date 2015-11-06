'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */
describe('Directive: leaflet: layers.watch', function() {
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

  it('should add and remove layers in watch', function() {
    // If we not provide layers the system will use the default
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
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    var layers;
    leafletData.getLayers().then(function(leafletLayers) {
      layers = leafletLayers;
    });

    scope.$digest();

    expect(Object.keys(layers.baselayers).length).toEqual(2);
    delete scope.layers.baselayers.cycle;
    scope.$digest();
    expect(Object.keys(layers.baselayers).length).toEqual(1);
    expect(typeof layers.baselayers.osm).toBe('object');
    expect(layers.baselayers.cycle).toBe(undefined);
    scope.layers.baselayers.cloudmade1 = {
      name: 'Cloudmade Night Commander',
      type: 'xyz',
      url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
      layerParams: {
        key: '007b9471b4c74da4a6ec7ff43552b16f',
        styleId: 999,
      },
      layerOptions: {
        subdomains: ['a', 'b', 'c'],
        continuousWorld: true,
      },
    };
    scope.$digest();
    expect(Object.keys(layers.baselayers).length).toEqual(2);
    expect(typeof layers.baselayers.osm).toBe('object');
    expect(typeof layers.baselayers.cloudmade1).toBe('object');
    delete scope.layers.baselayers.osm;
    delete scope.layers.baselayers.cloudmade1;
    scope.$digest();
    expect(Object.keys(layers.baselayers).length).toEqual(0);
  });

  it('should add and remove overlays in watch', function() {
    // Create correct overlays
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
        },
        overlays: {
          hillshade: {
            name: 'Hillshade Europa',
            type: 'wms',
            url: 'http://129.206.228.72/cached/hillshade',
            visible: true,
            layerOptions: {
              layers: 'europe_wms:hs_srtm_europa',
              format: 'image/png',
              opacity: 0.25,
              attribution: 'Hillshade layer by GIScience http://www.osm-wms.de',
              crs: L.CRS.EPSG900913,
            },
          },
          fire: {
            name: 'OpenFireMap',
            type: 'xyz',
            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
            layerOptions: {
              attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true,
            },
          },
        },
      },
    });
    var element = angular.element('<leaflet layers="layers"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    var layers;
    leafletData.getLayers().then(function(leafletLayers) {
      layers = leafletLayers;
    });

    scope.$digest();
    expect(Object.keys(layers.overlays).length).toEqual(2);
    delete scope.layers.overlays.fire;

    scope.$digest();
    expect(Object.keys(layers.overlays).length).toEqual(1);
    expect(typeof layers.overlays.hillshade).toBe('object');
    expect(layers.overlays.fire).toBe(undefined);

    // Added a bad layer
    scope.layers.overlays.fire = {
      name: 'OpenFireMap',
      badtype: 'xyz',
      url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
      layerOptions: {
        attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        continuousWorld: true,
      },
    };
    scope.$digest();
    expect(Object.keys(layers.overlays).length).toEqual(1);
    expect(typeof layers.overlays.hillshade).toBe('object');
    expect(layers.overlays.fire).toBe(undefined);

    // Added a good layer
    scope.layers.overlays.fire = {
      name: 'OpenFireMap',
      type: 'xyz',
      url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
      layerOptions: {
        attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        continuousWorld: true,
      },
    };
    scope.$digest();
    expect(Object.keys(layers.overlays).length).toEqual(2);
    expect(typeof layers.overlays.hillshade).toBe('object');
    expect(typeof layers.overlays.fire).toBe('object');

    // geoJSON Shape Type

    // Added a good layer.. Data is normally geojson file but not testing this
    scope.layers.overlays.countries = {
      name: 'Countries',
      type: 'geoJSONShape',
      data: {type: 'FeatureCollection',
                    features: [{
                      type:'Feature',
                      geometry: {
                        type: 'Polygon',
                        coordinates: [[[22.65715, 44.234923], [22.944832, 43.823785], [22.65715, 44.234923]]],
                      },
                    },],
            },
      layerOptions: {
        style: {
          color: '#00D',
          fillColor: 'red',
          weight: 2.0,
          opacity: 0.6,
          fillOpacity: 0.2,
        },
      },
    };

    scope.$digest();
    expect(Object.keys(layers.overlays).length).toEqual(3);
    expect(typeof layers.overlays.countries).toBe('object');

  });
});
