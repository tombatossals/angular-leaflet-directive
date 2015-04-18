'use strict';

describe('Loading 0108-basic-tiles-zoom-changer-example.html', function() {

    beforeEach(function() {
        browser.get('0108-basic-tiles-zoom-changer-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    });

    it('should update the map tiles if zoom in the map', function() {
        expect(element(by.xpath('//img[contains(@src, "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/")]')).isPresent()).toBe(true);
        var zoomin = element(by.xpath('.//*[@title="Zoom in"]'));

        zoomin.click();
        browser.driver.sleep(300);
        zoomin.click();
        browser.driver.sleep(300);
        zoomin.click();
        browser.wait(function() {
            return element(by.xpath('//img[contains(@src, "http://a.tile.openstreetmap.org/")]')).isPresent();
        }, 5000);
        expect(element(by.xpath('//img[contains(@src, "http://a.tile.openstreetmap.org/")]')).isPresent()).toBe(true);
    });
});
