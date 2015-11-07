describe('leafletData', function() {
  var $compile;
  var $q;
  var $rootScope;
  var geojsonData;
  var leafletData;
  var leafletHelpers;
  var mainLayers;

  $q = geojsonData = mainLayers = leafletHelpers = leafletData = $rootScope = $compile = void 0;
  beforeEach(function() {
    module('leaflet-directive');
    inject(function(_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletHelpers_, _$q_) {
      var $timeout;
      $q = _$q_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      leafletData = _leafletData_;
      $timeout = _$timeout_;
      scope = $rootScope.$new();
    });
  });

  describe('no mapId', function() {
    beforeEach(function() {
      scope.knownMarkers = [1, 2, 3];
      scope.knownGeoJSON = ['1', '2', '3'];
      scope.setPromise = $q.all([leafletData.setMarkers(scope.knownMarkers), leafletData.setGeoJSON(scope.knownGeoJSON)]);
    });

    it('has unique data', function(done) {
      var _allGet;
      var _geoJSON;
      var _markers;
      _geoJSON = null;
      _markers = null;
      _allGet = null;
      $rootScope.$digest();

      scope.setPromise.then(function() {
        _allGet = $q.all([
          leafletData.getMarkers().then(function(lObjs) {
            _markers = lObjs;
          }, leafletData.getGeoJSON().then(function(lObjs) {
            _geoJSON = lObjs;
          })),
        ]);
      });

      $rootScope.$digest();
      _allGet.then(function() {
        expect(scope.knownMarkers).toBe(_markers);
        expect(scope.knownGeoJSON).toBe(_geoJSON);
        expect(_geoJSON !== _markers).toBeTruthy();
        done();
      });
    });

    it('modifying localScope modifies leafletData\'s version', function(done) {
      var _allGet;
      var _geoJSON;
      var _markers;
      _geoJSON = null;
      _markers = null;
      _allGet = null;
      scope.knownMarkers.push(4);
      scope.knownGeoJSON.push('4');
      $rootScope.$digest();
      scope.setPromise.then(function() {
        _allGet = $q.all([
          leafletData.getMarkers().then(function(lObjs) {
            _markers = lObjs;
          }, leafletData.getGeoJSON().then(function(lObjs) {
            _geoJSON = lObjs;
          })),
        ]);
      });

      $rootScope.$digest();
      _allGet.then(function() {
        expect(scope.knownMarkers).toBe(_markers);
        expect(scope.knownGeoJSON).toBe(_geoJSON);
        expect(_geoJSON !== _markers).toBeTruthy();
        done();
      });
    });
  });
});
