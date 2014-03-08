'use strict';

describe('Loading center-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('url-hash-center-example.html');
        driver = ptor.driver;
    }, 30000);

    it('should update the url in the center value is changed from the form', function() {
        element(by.xpath('//input[1]')).clear();
        ptor.sleep(1000);
        element(by.xpath('//input[1]')).sendKeys('9');
        ptor.sleep(2000);
        element(by.xpath('//input[2]')).clear();
        element(by.xpath('//input[2]')).sendKeys('7');
        ptor.sleep(1000);
        element(by.xpath('//input[3]')).clear();
        element(by.xpath('//input[3]')).sendKeys('4');
        // Wait for zoom animation
        ptor.sleep(1000);
        expect(browser.getCurrentUrl()).toMatch(/c=9.102096738726456:7.03125:4$/);
    });

    it('should update the map center model if the url changes', function() {
        browser.get("url-hash-center-example.html#?c=9.102096738726456:7.03125:4");
        expect(element(by.xpath('//input[1]')).getAttribute("value")).toBe("9.102096738726456");
        expect(element(by.xpath('//input[2]')).getAttribute("value")).toBe("7.03125");
        expect(element(by.xpath('//input[3]')).getAttribute("value")).toBe("4");
    });
});
