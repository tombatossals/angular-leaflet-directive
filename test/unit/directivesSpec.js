'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('leaflet-directive'));

  describe('leaflet', function() {
    it('should have loaded leaflet library inside the directive', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<leaflet></leaflet>')($rootScope);
        expect(element.text()).toEqual('+-Powered by Leaflet');
      });
    });
  });
});
