'use strict';

describe('Loading paths-types-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get('paths-types-example.html');
        driver = ptor.driver;
    });

    it('should show a polyline on the map when clicked the polyline button', function() {
        element(by.xpath('//button[text()="polyline"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M320 200L300 291L392 280"]'))).toBe(true);
        });
    });

    it('should show a multipolyline on the map when clicked the multipolyline button', function() {
        element(by.xpath('//button[text()="multiPolyline"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M320 200L269 304"]'))).toBe(true);
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M334 223L300 291"]'))).toBe(true);
        });
    });

    it('should show a polygon on the map when clicked the polygon button', function() {
        element(by.xpath('//button[text()="polygon"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M320 200L269 304L300 291L334 223z"]'))).toBe(true);
        });
    });

    it('should show a multipolygon on the map when clicked the multipolygon button', function() {
        element(by.xpath('//button[text()="multiPolygon"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M320 200L269 304L300 291L334 223z"]'))).toBe(true);
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M397 191L392 280L344 206z"]'))).toBe(true);
        });
    });

    it('should show a rectangle on the map when clicked the rectangle button', function() {
        element(by.xpath('//button[text()="rectangle"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M269 304L269 191L397 191L397 304z"]'))).toBe(true);
        });
    });

    it('should show a circle on the map when clicked the circle button', function() {
        element(by.xpath('//button[text()="circle"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M344,165A41,41,0,1,1,343.9,165 z" and @stroke-linejoin="round"]'))).toBe(true);
        });
    });

    it('should show a circleMarker on the map when clicked the circleMarker button', function() {
        element(by.xpath('//button[text()="circleMarker"]')).click().then(function() {
            expect(ptor.isElementPresent(by.xpath('//*[local-name()="svg" and namespace-uri()="http://www.w3.org/2000/svg"]//*[local-name()="path" and @d="M392,230A50,50,0,1,1,391.9,230 z" and @stroke-linejoin="round"]'))).toBe(true);
        });
    });

});
