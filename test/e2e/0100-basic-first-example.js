'use strict';

describe('Loading 0100-basic-first-example.html', function() {

    beforeEach(function() {
        browser.get('0100-basic-first-example.html');
    }, 30000);

    it('should load the Leaflet map inside the directive tag', function() {
        element(by.className('angular-leaflet-map')).getText().then(function(text) {
            expect(text).toBe("+\n-\nLeaflet | © OpenStreetMap contributors");
        });
    });

});
