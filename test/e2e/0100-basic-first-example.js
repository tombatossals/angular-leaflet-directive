'use strict';

describe('Loading 0100-basic-first-example.html', function() {

    beforeEach(function() {
        browser.get('0100-basic-first-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    }, 30000);

    it('should load the Leaflet map inside the directive tag', function() {
        element(by.className('angular-leaflet-map')).getText().then(function(text) {
            expect(text).toBe("+\n-\nLeaflet | © OpenStreetMap contributors");
        });
    });

});
