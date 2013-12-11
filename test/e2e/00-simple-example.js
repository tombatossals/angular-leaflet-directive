'use strict';

describe('Loading simple-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('simple-example.html');
        driver = ptor.driver;
    }, 30000);

    it('should load the Leaflet map inside the directive tag', function() {
        element(by.className('angular-leaflet-map')).getText().then(function(text) {
            expect(text).toBe("+\n-\nLeaflet | © OpenStreetMap contributors");
        });
    });

});
