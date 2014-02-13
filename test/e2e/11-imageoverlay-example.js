'use strict';

describe('Loading layers-imageoverlay-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('layers-imageoverlay-example.html');
        driver = ptor.driver;
    });

    it('should load the static image of the andes on the map', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.xpath('//img[contains(@src, "andes.jpg")]'));
        });

        expect(ptor.isElementPresent(by.xpath('//img[contains(@src, "andes.jpg")]'))).toBe(true);
    });
});
