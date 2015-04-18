'use strict';

describe('Loading 0203-layers-imageoverlay-example.html', function() {

    beforeEach(function() {
        browser.get('0203-layers-imageoverlay-example.html');
        browser.wait(function() {
            return element(by.xpath('//img[contains(@src, "andes.jpg")]')).isPresent();
        }, 5000);
    });

    it('should load the static image of the andes on the map', function() {
        expect(element(by.xpath('//img[contains(@src, "andes.jpg")]')).isPresent()).toBe(true);
    });
});
