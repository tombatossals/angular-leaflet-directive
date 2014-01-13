'use strict';

describe('Loading markers-add-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('markers-add-example.html');
        driver = ptor.driver;
    });

    it('should load a marker when clicked on the map', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        element(by.css('img.leaflet-tile-loaded')).click().then(function() {
            ptor.sleep(100);
            expect(ptor.isElementPresent(by.css("img.leaflet-marker-icon"))).toBe(true);
        });
    });
});
