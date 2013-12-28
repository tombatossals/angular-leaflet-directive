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
        ptor.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]')).find()).perform();

        ptor.findElements(by.css("input.leaflet-control-layers-selector")).then(function(inputs) {
            var input = inputs[1];
            input.click().then(function() {
                ptor.wait(function() {
                    return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://b.tile.cloudmade.com/")]')).then(function(elementLoaded) {
                        return elementLoaded;
                    });
                });
                expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://b.tile.cloudmade.com/007b9471b4c74da4a6ec7ff43552b16f/7/256/6/53/26.png")]'))).toBe(true);
            });
        });
    });
});
