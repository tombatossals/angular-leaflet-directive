'use strict';

describe('Loading tiles-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('tiles-example.html');
        driver = ptor.driver;
    });

    it('should update the map tiles if clicked on the tiles changer buttons', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://b.tile.opencyclemap.org")]'))).toBe(true);

        element(by.xpath('//button[text()="OpenStreetMaps"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://b.tile.openstreetmap.org")]'))).toBe(true);
        });
    });
});
