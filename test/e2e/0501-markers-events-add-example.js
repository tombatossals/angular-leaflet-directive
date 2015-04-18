'use strict';

describe('Loading 0501-markers-events-add-example.html', function() {

    beforeEach(function() {
        browser.get('0501-markers-events-add-example.html');
    });

    it('should load a marker when clicked on the map', function() {
        browser.wait(function() {
            return browser.driver.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        element(by.css('img.leaflet-tile-loaded')).click().then(function() {
            browser.driver.sleep(100);
            expect(ptor.isElementPresent(by.css("img.leaflet-marker-icon"))).toBe(true);
        });
    });
});
