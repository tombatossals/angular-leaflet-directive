'use strict';

describe('Loading simple-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        ptor.get('/simple-example.html');
        driver = ptor.driver;
    }, 30000);

    it('should load the Leaflet map inside the directive tag', function() {
        driver.findElement(protractor.By.className('angular-leaflet-map')).getText().then(function(text) {
            expect(text).toBe("+\n-\nLeaflet | © OpenStreetMap contributors");
        });
    });

});
