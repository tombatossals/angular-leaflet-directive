'use strict';

describe('Loading googlemaps-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('/examples/googlemaps-example.html');
        driver = ptor.driver;
    });

    it('should change the Google Maps tiles if clicked on the leaflet control switch layer', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.xpath('//img[contains(@draggable, "false")]'));
        });

        var img1 = element(by.xpath('//img[contains(@draggable, "false")][1]'));
        expect(img1.getAttribute("src")).toMatch("mt.\.googleapis\.com");

        ptor.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]')).find()).perform();

        ptor.sleep(100);
        ptor.findElements(by.css("input.leaflet-control-layers-selector")).then(function(inputs) {
            var input = inputs[1];
            input.click().then(function() {
                ptor.sleep(300);
                var img1 = element(by.xpath('//img[contains(@draggable, "false")][1]'));
                expect(img1.getAttribute("src")).toMatch("khm.\.googleapis\.com");
            });
        });
    });
});
