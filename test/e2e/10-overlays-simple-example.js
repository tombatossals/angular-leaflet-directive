'use strict';

describe('Loading overlays-simple-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('overlays-simple-example.html');
        driver = ptor.driver;
    });

    it('should change the layer tiles if clicked on the leaflet control switch layer', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://c.tile.openstreetmap.org/")]'));
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://c.tile.openstreetmap.org/")]'))).toBe(true);
        ptor.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

        var overlayButton = element(by.xpath("//input[@type='checkbox'][1]"));
        overlayButton.click().then(function() {
            ptor.wait(function() {
                return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]'));
            });
            expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]'))).toBe(true);
            overlayButton.click().then(function() {
                ptor.wait(function() {
                    return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]')).then(function(present) {
                        return !present;
                    });
                });
                expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]'))).toBe(false);
            });
        });
    });
});
