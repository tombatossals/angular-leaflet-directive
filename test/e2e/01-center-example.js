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
        element(by.model("center.zoom")).then(function(zoom) {
            expect(zoom).toBe('5');
        });
    });

    it('should update the zoom value if the map is dragged', function() {
        element(by.css('img.leaflet-map-pane')).find().then(function(el) {
            console.log(el.getLocation());
            browser.actions().mouseDown(el.find(), protractor.Button.LEFT).mouseMove({ x: 1400, y: 1200 }).perform();
            ptor.sleep(1300);
        });
    });

});
