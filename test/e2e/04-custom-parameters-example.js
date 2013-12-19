'use strict';

describe('Loading custom-parameters-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('/examples/custom-parameters-example.html');
        driver = ptor.driver;
    });

    it('should have loaded the opencyclemaps tiles', function() {
        ptor.wait(function() {
            return ptor.isElementPresent(by.css('img.leaflet-tile-loaded'));
        });

        var tile = element(by.css('img.leaflet-tile-loaded'));
    });
});
