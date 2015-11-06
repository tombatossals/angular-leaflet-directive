'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
  var $compile;
  var $rootScope;
  var leafletData;
  var scope;

  beforeEach(function() {
      module('leaflet-directive');
      inject(function(_$compile_, _$rootScope_, _leafletData_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        scope = $rootScope.$new();
      });
    });

  afterEach(inject(function($rootScope) {
    $rootScope.$apply();
  }));

  // Error management
  it('should not allow a bad name object', function() {
    var latlngs1 = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
    ];
    angular.extend(scope, {
      paths: {
        'p1-p2': {
          latlngs: latlngs1,
        },
      },
    });

    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();

    leafletData.getPaths().then(function(paths) {
      expect(paths).toEqual({});
    });

  });

  // Polyline
  it('should create polyline on the map', function() {
    var latlngs1 = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
    ];
    var latlngs2 = [
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    angular.extend(scope, {
      paths: {
        p1: { latlngs: latlngs1 },
        p2: { latlngs: latlngs2 },
      },
    });
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polyline1 = paths.p1;
      var polyline2 = paths.p2;
      latlngs1 = polyline1.getLatLngs();
      expect(latlngs1[0].lat).toBeCloseTo(0.966);
      expect(latlngs1[0].lng).toBeCloseTo(2.02);
      expect(latlngs1[1].lat).toBeCloseTo(2.02);
      expect(latlngs1[1].lng).toBeCloseTo(4.04);

      latlngs2 = polyline2.getLatLngs();
      expect(latlngs2[0].lat).toBeCloseTo(0.466);
      expect(latlngs2[0].lng).toBeCloseTo(1.02);
      expect(latlngs2[1].lat).toBeCloseTo(1.02);
      expect(latlngs2[1].lng).toBeCloseTo(3.04);
    });
  });

  it('should support polyline with coordinates as arrays', function() {
    var latlngs = [
        [0.966, 2.02],
        [2.02, 4.04],
    ];
    angular.extend(scope, {
      paths: {
        p1: { latlngs: latlngs },
      },
    });
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polyline = paths.p1;
      latlngs = polyline.getLatLngs();
      expect(latlngs[0].lat).toBeCloseTo(0.966);
      expect(latlngs[0].lng).toBeCloseTo(2.02);
      expect(latlngs[1].lat).toBeCloseTo(2.02);
      expect(latlngs[1].lng).toBeCloseTo(4.04);
    });
  });

  // MultiPolyline
  it('should create multiPolyline on the map', function() {
    angular.extend(scope, {
      paths: {
        p1: {
          latlngs: [
              [
                  { lat: 0.966, lng: 2.02 },
                  { lat: 2.02, lng: 4.04 },
              ],
              [
                  { lat: 0.466, lng: 1.02 },
                  { lat: 1.02, lng: 3.04 },
              ],
          ],
          type: 'multiPolyline',
        },
      },
    });
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polylines = paths.p1;
      var latlngs = polylines.getLatLngs();
      expect(latlngs[0][0].lat).toBeCloseTo(0.966);
      expect(latlngs[0][0].lng).toBeCloseTo(2.02);
      expect(latlngs[0][1].lat).toBeCloseTo(2.02);
      expect(latlngs[0][1].lng).toBeCloseTo(4.04);
      expect(latlngs[1][0].lat).toBeCloseTo(0.466);
      expect(latlngs[1][0].lng).toBeCloseTo(1.02);
      expect(latlngs[1][1].lat).toBeCloseTo(1.02);
      expect(latlngs[1][1].lng).toBeCloseTo(3.04);
    });
  });

  // Polygon
  it('should create polygon on the map', function() {
    var latlngs = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    angular.extend(scope, { paths: { p1: { latlngs: latlngs, type: 'polygon' }}});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);

    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polygon = paths.p1;
      latlngs = polygon.getLatLngs();
      expect(latlngs[0].lat).toBeCloseTo(0.966);
      expect(latlngs[0].lng).toBeCloseTo(2.02);
      expect(latlngs[1].lat).toBeCloseTo(2.02);
      expect(latlngs[1].lng).toBeCloseTo(4.04);
      expect(latlngs[2].lat).toBeCloseTo(0.466);
      expect(latlngs[2].lng).toBeCloseTo(1.02);
      expect(latlngs[3].lat).toBeCloseTo(1.02);
      expect(latlngs[3].lng).toBeCloseTo(3.04);
    });
  });

  // MultiPolygon
  it('should create multiPolygon on the map', function() {
    var latlngs1 = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    var latlngs2 = [
        { lat: 1.966, lng: 3.02 },
        { lat: 3.02, lng: 5.04 },
        { lat: 1.466, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
    ];
    angular.extend(scope, { paths: { p1: { latlngs: [latlngs1, latlngs2], type: 'multiPolygon' }}});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var multiPolygon = paths.p1;

      latlngs1 = multiPolygon.getLatLngs();
      expect(latlngs1[0][0].lat).toBeCloseTo(0.966);
      expect(latlngs1[0][0].lng).toBeCloseTo(2.02);
      expect(latlngs1[0][1].lat).toBeCloseTo(2.02);
      expect(latlngs1[0][1].lng).toBeCloseTo(4.04);
      expect(latlngs1[0][2].lat).toBeCloseTo(0.466);
      expect(latlngs1[0][2].lng).toBeCloseTo(1.02);
      expect(latlngs1[0][3].lat).toBeCloseTo(1.02);
      expect(latlngs1[0][3].lng).toBeCloseTo(3.04);
      expect(latlngs1[1][0].lat).toBeCloseTo(1.966);
      expect(latlngs1[1][0].lng).toBeCloseTo(3.02);
      expect(latlngs1[1][1].lat).toBeCloseTo(3.02);
      expect(latlngs1[1][1].lng).toBeCloseTo(5.04);
      expect(latlngs1[1][2].lat).toBeCloseTo(1.466);
      expect(latlngs1[1][2].lng).toBeCloseTo(2.02);
      expect(latlngs1[1][3].lat).toBeCloseTo(2.02);
      expect(latlngs1[1][3].lng).toBeCloseTo(4.04);
    });
  });

  // Rectangle
  it('should create rectangle on the map', function() {
    var latlngs1 = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
    ];
    var latlngs2 = [
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    angular.extend(scope, { paths: { p1: { latlngs: latlngs1, type: 'rectangle' }, p2: { latlngs: latlngs2, type: 'rectangle' }}});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var rectangle1 = paths.p1;
      var rectangle2 = paths.p2;
      latlngs1 = rectangle1.getBounds();
      var sw = latlngs1.getSouthWest();
      var ne = latlngs1.getNorthEast();
      expect(sw.lat).toBeCloseTo(0.966);
      expect(sw.lng).toBeCloseTo(2.02);
      expect(ne.lat).toBeCloseTo(2.02);
      expect(ne.lng).toBeCloseTo(4.04);

      latlngs2 = rectangle2.getBounds();
      sw = latlngs2.getSouthWest();
      ne = latlngs2.getNorthEast();
      expect(sw.lat).toBeCloseTo(0.466);
      expect(sw.lng).toBeCloseTo(1.02);
      expect(ne.lat).toBeCloseTo(1.02);
      expect(ne.lng).toBeCloseTo(3.04);
    });
  });

  // Circle
  it('should create circle on the map', function() {
    var c1 = {
      latlngs: { lat: 0.966, lng: 2.02 },
      radius: 10,
      type: 'circle',
    };
    var c2 = {
      latlngs: { lat: 0.466, lng: 1.02 },
      radius: 20,
      type: 'circle',
    };
    angular.extend(scope, { paths: { p1: c1, p2: c2 }});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();

    leafletData.getPaths().then(function(paths) {
      var circle1 = paths.p1;
      var circle2 = paths.p2;
      var latlngs1 = circle1.getLatLng();
      expect(latlngs1.lat).toBeCloseTo(0.966);
      expect(latlngs1.lng).toBeCloseTo(2.02);
      var radius1 = circle1.getRadius();
      expect(radius1).toBe(10);

      var latlngs2 = circle2.getLatLng();
      expect(latlngs2.lat).toBeCloseTo(0.466);
      expect(latlngs2.lng).toBeCloseTo(1.02);
      var radius2 = circle2.getRadius();
      expect(radius2).toBe(20);
    });
  });

  // CircleMarker
  it('should create circleMarker on the map', function() {
    var c1 = {
      latlngs: { lat: 0.966, lng: 2.02 },
      radius: 10,
      type: 'circleMarker',
    };
    var c2 = {
      latlngs: { lat: 0.466, lng: 1.02 },
      radius: 20,
      type: 'circleMarker',
    };
    angular.extend(scope, { paths: { p1: c1, p2: c2 }});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);
    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var circle1 = paths.p1;
      var circle2 = paths.p2;
      var latlngs1 = circle1.getLatLng();
      expect(latlngs1.lat).toBeCloseTo(0.966);
      expect(latlngs1.lng).toBeCloseTo(2.02);
      var radius1 = circle1.getRadius();
      expect(radius1).toBe(10);

      var latlngs2 = circle2.getLatLng();
      expect(latlngs2.lat).toBeCloseTo(0.466);
      expect(latlngs2.lng).toBeCloseTo(1.02);
      var radius2 = circle2.getRadius();
      expect(radius2).toBe(20);
    });
  });

  // Polygon
  it('should update polygon colors on the map', function() {
    var latlngs = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    angular.extend(scope, { paths: { p1: { latlngs: latlngs, type: 'polygon', color: 'white', fillColor: 'red' }}});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);

    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polygon = paths.p1;
      expect(polygon.options.color).toBe('white');
      expect(polygon.options.fillColor).toBe('red');
    });

    angular.extend(scope, { paths: { p1: { latlngs: latlngs, type: 'polygon', color: 'green', fillColor: 'blue' }}});

    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polygon = paths.p1;
      expect(polygon.options.color).toBe('green');
      expect(polygon.options.fillColor).toBe('blue');
    });
  });

  it('should update the path if the path object is changed', function() {
    var latlngs = [
        { lat: 0.966, lng: 2.02 },
        { lat: 2.02, lng: 4.04 },
        { lat: 0.466, lng: 1.02 },
        { lat: 1.02, lng: 3.04 },
    ];
    angular.extend(scope, { paths: { p1: { latlngs: latlngs, type: 'polygon', color: 'white', fillColor: 'red' }}});
    var element = angular.element('<leaflet paths="paths"></leaflet>');
    element = $compile(element)(scope);

    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var polygon = paths.p1;
      expect(polygon.options.color).toBe('white');
      expect(polygon.options.fillColor).toBe('red');
    });

    scope.paths.p1.latlngs[0] = {
      lat: 0.97,
      lng: 2.00,
    };

    scope.$digest();
    leafletData.getPaths().then(function(paths) {
      var latlngs = paths.p1.getLatLngs();
      expect(latlngs[0].lat).toBeCloseTo(0.97);
      expect(latlngs[0].lng).toBeCloseTo(2.00);
    });
  });

});
