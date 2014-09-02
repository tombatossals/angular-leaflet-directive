'use strict';

describe('Loading url-hash-center-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('url-hash-center-example.html');
        driver = ptor.driver;
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });
    }, 30000);

    it('should update the url if the center value is changed from the form', function() {
        element(by.xpath('//input[1]')).clear();
        element(by.xpath('//input[1]')).sendKeys("9");
        ptor.sleep(500);
        element(by.xpath('//input[2]')).clear();
        element(by.xpath('//input[2]')).sendKeys("7");
        ptor.sleep(500);
        element(by.xpath('//input[3]')).clear();
        element(by.xpath('//input[3]')).sendKeys("4");
        // Wait for zoom animation
        ptor.sleep(1500);
        expect(browser.getCurrentUrl()).toMatch(/c=9.0153:7.0313:4$/);
    });

    it('should update the url if the zoom is changed from the map', function() {
        element(by.xpath('.//*[@title="Zoom out"]')).click();
        expect(browser.getCurrentUrl()).toMatch(/51.5050:-0.0900:4/);
    });

    it('should update the map center model if the url changes', function() {
        browser.get("url-hash-center-example.html#?c=9.1021:7.0313:4");
        expect(element(by.xpath('//input[1]')).getAttribute("value")).toBe("9.1021");
        expect(element(by.xpath('//input[2]')).getAttribute("value")).toBe("7.0313");
        expect(element(by.xpath('//input[3]')).getAttribute("value")).toBe("4");
    });
});
