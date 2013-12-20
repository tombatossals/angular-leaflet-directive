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

        expect(element(by.model("bounds.southWest.lat")).getAttribute("value")).toBe("39.232253141714885");
        expect(element(by.model("bounds.southWest.lng")).getAttribute("value")).toBe("-28.212890625");
        expect(element(by.model("bounds.northEast.lat")).getAttribute("value")).toBe("61.18562468142283");
        expect(element(by.model("bounds.northEast.lng")).getAttribute("value")).toBe("28.037109375");

        element(by.xpath('.//*[@title="Zoom in"]')).click().then(function() {
            ptor.sleep(400);
            expect(element(by.model("bounds.southWest.lat")).getAttribute("value")).toBe("45.706179285330855");
            expect(element(by.model("bounds.southWest.lng")).getAttribute("value")).toBe("-14.150390625");
            expect(element(by.model("bounds.northEast.lat")).getAttribute("value")).toBe("56.65622649350222");
            expect(element(by.model("bounds.northEast.lng")).getAttribute("value")).toBe("13.974609375");
        });

    });
});
