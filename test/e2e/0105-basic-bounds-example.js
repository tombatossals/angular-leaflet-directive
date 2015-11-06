'use strict';

describe('Loading 0105-basic-bounds-example.html', function() {

  beforeEach(function() {
    browser.get('0105-basic-bounds-example.html');
    browser.wait(function() {
      return element(by.css('img.leaflet-tile-loaded')).isPresent();
    }, 5000);
  });

  it('should update the bounds values in the input if clicked the zoom control', function() {
    expect(element(by.model('bounds.southWest.lat')).getAttribute('value')).toBe('51.507941142609155');
    expect(element(by.model('bounds.southWest.lng')).getAttribute('value')).toBe('-0.09059429168701172');
    expect(element(by.model('bounds.northEast.lat')).getAttribute('value')).toBe('51.50954376090435');
    expect(element(by.model('bounds.northEast.lng')).getAttribute('value')).toBe('-0.0851815938949585');

    element(by.xpath('.//*[@title="Zoom out"]')).click().then(function() {
      browser.driver.sleep(400);
      expect(element(by.model('bounds.southWest.lat')).getAttribute('value')).toBe('51.50713981232172');
      expect(element(by.model('bounds.southWest.lng')).getAttribute('value')).toBe('-0.09329795837402344');
      expect(element(by.model('bounds.northEast.lat')).getAttribute('value')).toBe('51.51034504891232');
      expect(element(by.model('bounds.northEast.lng')).getAttribute('value')).toBe('-0.08247256278991699');
    });

  });
});
