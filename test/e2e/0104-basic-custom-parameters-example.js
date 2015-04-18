'use strict';

describe('Loading custom-parameters-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('custom-parameters-example.html');
        driver = ptor.driver;
    });

    it('should have loaded the opencyclemaps tiles', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        element(by.xpath('//img[contains(@class, "leaflet-tile-loaded")][1]')).getAttribute("src").then(function(src) {
            expect(src).toContain("tile.opencyclemap.org");
        });
    });
});
