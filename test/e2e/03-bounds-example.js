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

        element(by.css('img.leaflet-tile-loaded')).click().then(function() {
            expect(element(by.model("bounds.southWest.lat")).getAttribute("value")).toBe("39.232253141714885");
            expect(element(by.model("bounds.southWest.lng")).getAttribute("value")).toBe("-28.212890625");
            expect(element(by.model("bounds.northEast.lat")).getAttribute("value")).toBe("61.18562468142283");
            expect(element(by.model("bounds.northEast.lng")).getAttribute("value")).toBe("28.037109375");
        });
    });
});
