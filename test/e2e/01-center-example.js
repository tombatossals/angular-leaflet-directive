'use strict';

describe('Loading center-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('center-example.html');
        driver = ptor.driver;
    }, 30000);

    it('should update the zoom value in the input if clicked the zoom control', function() {
        element(by.className('leaflet-control-zoom-in')).click();
        // Wait for zoom animation
        ptor.sleep(300);
        expect(element(by.model("london.zoom")).getAttribute("value")).toBe('5');
    });

    it('should update the center value if the map is dragged', function() {
        expect(element(by.model("london.lat")).getAttribute("value")).toBe('51.505');
        expect(element(by.model("london.lng")).getAttribute("value")).toBe('-0.09');
        var el = element(by.xpath('.//img[contains(@class, "leaflet-tile-loaded")][1]'));
        browser.actions().dragAndDrop(el, { x: 40, y: 40 }).perform();
        ptor.sleep(300);
        expect(element(by.model("london.lat")).getAttribute("value")).toBe('51.505');
        expect(element(by.model("london.lng")).getAttribute("value")).toBe('-0.09');
    });

});
