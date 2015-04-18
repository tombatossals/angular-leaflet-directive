'use strict';

describe('Loading googlemaps-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('googlemaps-example.html');
        driver = ptor.driver;
    });

    it('should change the Google Maps tiles if clicked on the leaflet control switch layer', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://mt1.googleapis.com")]')).then(function(elementLoaded) {
                return elementLoaded;
            });
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://mt1.googleapis.com")]'))).toBe(true);
        ptor.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

        ptor.findElements(by.css("input.leaflet-control-layers-selector")).then(function(inputs) {
            var input = inputs[1];
            input.click().then(function() {
                ptor.wait(function() {
                    return ptor.isElementPresent(by.xpath('//img[contains(@src, "http://khm1.googleapis.com")]')).then(function(elementLoaded) {
                        return elementLoaded;
                    });
                });
                expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "http://khm1.googleapis.com")]'))).toBe(true);
            });
        });
    });
});
