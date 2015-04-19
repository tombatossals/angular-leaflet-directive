'use strict';

describe('Loading 0107-basic-tiles-example.html', function() {

    beforeEach(function() {
        browser.get('0107-basic-tiles-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    });

    it('should update the map tiles if clicked on the tiles changer buttons', function() {
        expect(element(by.xpath('//img[contains(@src, "http://api.tiles.mapbox.com/v4/bufanuvols.lia35jfp/")]')).isPresent()).toBe(true);

        element(by.xpath('//button[text()="OpenStreetMaps"]')).click();
        expect(element(by.xpath('//img[contains(@src, "http://b.tile.openstreetmap.org")]')).isPresent()).toBe(true);
    });
});
