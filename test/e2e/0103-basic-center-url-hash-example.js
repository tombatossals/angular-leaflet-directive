'use strict';

describe('Loading 0103-basic-center-url-hash-example.html', function() {

    beforeEach(function() {
        browser.get('0103-basic-center-url-hash-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    }, 30000);

    it('should update the url if the center value is changed from the form', function() {
        element(by.xpath('//ul/li[1]/input[1]')).clear();
        element(by.xpath('//ul/li[1]/input[1]')).sendKeys("9");
        browser.driver.sleep(500);
        element(by.xpath('//ul/li[2]/input[1]')).clear();
        element(by.xpath('//ul/li[2]/input[1]')).sendKeys("7");
        browser.driver.sleep(500);
        element(by.xpath('//ul/li[3]/input[1]')).clear();
        element(by.xpath('//ul/li[3]/input[1]')).sendKeys("4");
        // Wait for zoom animation
        browser.driver.sleep(1500);
        expect(browser.driver.getCurrentUrl()).toMatch(/c=9.0153:6.9873:4$/);
    });

    it('should update the url if the zoom is changed from the map', function() {
        element(by.xpath('.//*[@title="Zoom out"]')).click();
        browser.driver.sleep(500);
        expect(browser.getCurrentUrl()).toMatch(/51.5050:-0.0900:3/);
    });

    it('should update the map center model if the url changes', function() {
        element(by.xpath('//ul/li[1]/a[1]')).click();
        expect(element(by.xpath('//ul/li[1]/input[1]')).getAttribute("value")).toBe("36.8899");
        expect(element(by.xpath('//ul/li[2]/input[1]')).getAttribute("value")).toBe("-121.8008");
        expect(element(by.xpath('//ul/li[3]/input[1]')).getAttribute("value")).toBe("12");
    });
});
