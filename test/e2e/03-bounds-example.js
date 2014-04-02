'use strict';

describe('Loading bounds-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('bounds-example.html');
        driver = ptor.driver;
    });

    it('should update the bounds values in the input if clicked the zoom control', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        expect(element(by.model("bounds.southWest.lat")).getAttribute("value")).toBe("51.508742458803326");
        expect(element(by.model("bounds.southWest.lng")).getAttribute("value")).toBe("-0.087890625");
        expect(element(by.model("bounds.northEast.lat")).getAttribute("value")).toBe("51.508742458803326");
        expect(element(by.model("bounds.northEast.lng")).getAttribute("value")).toBe("-0.087890625");

        element(by.xpath('.//*[@title="Zoom out"]')).click().then(function() {
            ptor.sleep(400);
            expect(element(by.model("bounds.southWest.lat")).getAttribute("value")).toBe("51.507406923983446");
            expect(element(by.model("bounds.southWest.lng")).getAttribute("value")).toBe("-0.0913238525390625");
            expect(element(by.model("bounds.northEast.lat")).getAttribute("value")).toBe("51.510077954475555");
            expect(element(by.model("bounds.northEast.lng")).getAttribute("value")).toBe("-0.0844573974609375");
        });

    });
});
