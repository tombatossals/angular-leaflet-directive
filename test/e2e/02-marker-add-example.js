'use strict';

describe('Loading marker-add-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('marker-add-example.html');
        driver = ptor.driver;
    });

    it('should update the zoom value in the input if clicked the zoom control', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        element(by.css('img.leaflet-tile-loaded')).click().then(function() {
            expect(ptor.isElementPresent(by.css("img.leaflet-marker-icon"))).toBe(true);
        });
    });
});
