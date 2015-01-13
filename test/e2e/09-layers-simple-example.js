'use strict';

describe('Loading layers-simple-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('layers-simple-example.html');
        driver = ptor.driver;
    });

    it('should change the layer tiles if clicked on the leaflet control switch layer', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://c.tile.openstreetmap.org/")]'));
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://c.tile.openstreetmap.org/6/53/27.png")]'))).toBe(true);
        ptor.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

        ptor.findElements(by.css("input.leaflet-control-layers-selector")).then(function(inputs) {
            var input = inputs[1];
            input.click().then(function() {
                ptor.wait(function() {
                    return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://api.tiles.mapbox.com")]')).then(function(elementLoaded) {
                        return elementLoaded;
                    });
                });
                expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://api.tiles.mapbox.com/v4/examples.map-i86nkdio/6/53/27.png?access_token=pk.eyJ1IjoidG9tYmF0b3NzYWxzIiwiYSI6Imo3MWxyTHMifQ.TjXg_IV7ZYMHX6tqjMikPg")]'))).toBe(true);
            });
        });
    });
});
