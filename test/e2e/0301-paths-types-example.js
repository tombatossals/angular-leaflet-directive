'use strict';

describe('Loading 0301-paths-types-example.html', function() {

  beforeEach(function() {
    browser.get('0301-paths-types-example.html');
    browser.wait(function() {
      return element(by.css('img.leaflet-tile-loaded')).isPresent();
    }, 5000);
  });

  it('should show a polyline on the map when clicked the polyline button', function() {
    element(by.xpath('//button[text()="polyline"]')).click();
    expect(element(by.xpath('//*[name()="svg"]//*[name()="path"]')).getAttribute('d')).toEqual('M512 240L492 331L584 320');
  });

  it('should show a multipolyline on the map when clicked the multipolyline button', function() {
    element(by.xpath('//button[text()="multiPolyline"]')).click();

    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[1]')).getAttribute('d')).toEqual('M512 240L461 344');
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[2]')).getAttribute('d')).toEqual('M526 263L492 331');

  });

  it('should show a polygon on the map when clicked the polygon button', function() {
    element(by.xpath('//button[text()="polygon"]')).click();
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[1]')).getAttribute('d')).toEqual('M512 240L461 344L492 331L526 263z');
  });

  it('should show a multipolygon on the map when clicked the multipolygon button', function() {
    element(by.xpath('//button[text()="multiPolygon"]')).click();
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[1]')).getAttribute('d')).toEqual('M512 240L461 344L492 331L526 263z');
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[2]')).getAttribute('d')).toEqual('M589 231L584 320L536 246z');
  });

  it('should show a rectangle on the map when clicked the rectangle button', function() {
    element(by.xpath('//button[text()="rectangle"]')).click();
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path"])[1]')).getAttribute('d')).toEqual('M461 344L461 231L589 231L589 344z');
  });

  it('should show a circle on the map when clicked the circle button', function() {
    element(by.xpath('//button[text()="circle"]')).click();
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path" and @stroke-linejoin="round"])[1]')).getAttribute('d')).toEqual('M536,205A41,41,0,1,1,535.9,205 z');
  });

  it('should show a circleMarker on the map when clicked the circleMarker button', function() {
    element(by.xpath('//button[text()="circleMarker"]')).click();
    expect(element(by.xpath('(//*[name()="svg"]//*[name()="path" and @stroke-linejoin="round"])[1]')).getAttribute('d')).toEqual('M584,270A50,50,0,1,1,583.9,270 z');
  });

});
