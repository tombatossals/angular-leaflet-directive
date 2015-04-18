'use strict';

describe('Loading 0104-basic-custom-parameters-example.html', function() {

    beforeEach(function() {
        browser.get('0104-basic-custom-parameters-example.html');
        browser.wait(function() {
            return element(by.css('img.leaflet-tile-loaded')).isPresent();
        }, 5000);
    });

    it('should have loaded the opencyclemaps tiles', function() {
        expect(element(by.css('img.leaflet-tile-loaded')).getAttribute("src")).toContain("tile.opencyclemap.org");
    });
});
