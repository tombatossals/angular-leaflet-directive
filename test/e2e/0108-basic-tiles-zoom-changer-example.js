'use strict';

describe('Loading tiles-zoom-changer-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('tiles-zoom-changer-example.html');
        driver = ptor.driver;
    });

    it('should update the map tiles if zoom in the map', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/")]'))).toBe(true);
        var zoomin = element(by.xpath('.//*[@title="Zoom in"]'));

        zoomin.click().then(function() {
            ptor.sleep(300);
            zoomin.click().then(function() {
                ptor.sleep(300);
                zoomin.click().then(function() {
                    ptor.wait(function() {
                        return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://a.tile.openstreetmap.org/")]'));
                    });

                    expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://a.tile.openstreetmap.org/")]'))).toBe(true);
                });
            });
        });
    });
});
