'use strict';

describe('Loading 0205-layers-googlemaps-example.html', function() {

  beforeEach(function() {
    browser.get('0205-layers-googlemaps-example.html');
    browser.wait(function() {
      return element(by.xpath('//img[contains(@src, "http://mt1.googleapis.com")]')).isPresent();
    }, 5000);
  });

  it('should change the Google Maps tiles if clicked on the leaflet control switch layer', function() {
    expect(element(by.xpath('//img[contains(@src, "http://mt1.googleapis.com")]')).isPresent()).toBe(true);
    browser.actions().mouseMove(element(by.xpath('//a[contains(@class, "leaflet-control-layers-toggle")][1]'))).perform();

    browser.driver.findElements(by.css('input.leaflet-control-layers-selector')).then(function(inputs) {
      var input = inputs[1];
      input.click();
      browser.wait(function() {
        return element(by.xpath('//img[contains(@src, "http://khm1.googleapis.com")]')).isPresent();
      }, 5000);

      expect(element(by.xpath('//img[contains(@src, "http://khm1.googleapis.com")]')).isPresent()).toBe(true);
    });
  });
});
