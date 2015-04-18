'use strict';

describe('Loading 0201-layers-simple-example.html', function() {

    beforeEach(function() {
        browser.get('0201-layers-simple-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    });

    it('should change the layer tiles if clicked on the leaflet control switch layer', function() {
        expect(element(by.xpath('//img[contains(@src, "http://api.tiles.mapbox.com/v4/bufanuvols.lia22g09/")]')).isPresent()).toBe(true);
        browser.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

        browser.findElements(by.css("input.leaflet-control-layers-selector")).then(function(inputs) {
            var input = inputs[1];
            input.click().then(function() {
                browser.wait(function() {
                    return element(by.xpath('//img[contains(@src, "http://b.tile.openstreetmap.org")]')).isPresent();
                }, 5000);
                expect(element(by.xpath('//img[contains(@src, "http://b.tile.openstreetmap.org")]')).isPresent()).toBe(true);
            });
        });
    });
});
