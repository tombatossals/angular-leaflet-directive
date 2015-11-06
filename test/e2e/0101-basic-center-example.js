'use strict';

describe('Loading 0101-basic-center-example.html', function() {

  beforeEach(function() {
    browser.get('0101-basic-center-example.html');
    browser.wait(function() {
      return element(by.css('img.leaflet-tile-loaded')).isPresent();
    }, 5000);
  }, 30000);

  it('should update the zoom value in the input if clicked the zoom control', function() {
    element(by.className('leaflet-control-zoom-in')).click();

    // Wait for zoom animation
    browser.driver.sleep(300);
    expect(element(by.model('london.zoom')).getAttribute('value')).toBe('5');
  });

  xit('should update the center value if the map is dragged', function() {
    expect(element(by.model('london.lat')).getAttribute('value')).toBe('51.505');
    expect(element(by.model('london.lng')).getAttribute('value')).toBe('-0.09');
    var el = element(by.xpath('.//img[contains(@class, "leaflet-tile-loaded")][1]'));
    var el2 = element(by.xpath('.//img[contains(@class, "leaflet-tile-loaded")][2]'));
    browser.actions()
            .mouseMove(el, {x: 5, y: 5})
            .mouseDown()
            .mouseMove(el2)
            .mouseUp()
            .perform();

    browser.waitForAngular();
    expect(element(by.model('london.lat')).getAttribute('value')).toBe('51.505');
    expect(element(by.model('london.lng')).getAttribute('value')).toBe('-0.09');
  });

});
