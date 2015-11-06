'use strict';

describe('Loading 0501-markers-events-add-example.html', function() {

  beforeEach(function() {
    browser.get('0501-markers-events-add-example.html');
    browser.wait(function() {
      return element(by.css('img.leaflet-tile-loaded')).isPresent();
    }, 5000);
  });

  it('should load a marker when clicked on the map', function() {
    element(by.css('img.leaflet-tile-loaded')).click();
    browser.driver.sleep(100);
    expect(element(by.css('img.leaflet-marker-icon')).isPresent()).toBe(true);
  });
});
