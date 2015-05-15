'use strict';

describe('Loading 0202-layers-overlays-simple-example.html', function() {

    beforeEach(function() {
        browser.get('0202-layers-overlays-simple-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    });

    it('should change the layer tiles if clicked on the leaflet control switch layer', function() {
        expect(element(by.xpath('//img[contains(@src, "http://c.tile.openstreetmap.org/")]')).isPresent()).toBe(true);
        browser.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

        browser.wait(function() {
            return element(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]')).isPresent();
        }, 5000);

        expect(element(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]')).isPresent()).toBe(true);

        var overlayButton = element(by.xpath("//input[@type='checkbox'][1]"));
        overlayButton.click();
        browser.driver.sleep(300);
        expect(element(by.xpath('//img[contains(@src, "http://suite.opengeo.org/geoserver/usa/wms")]')).isPresent()).toBe(false);
    });
});
