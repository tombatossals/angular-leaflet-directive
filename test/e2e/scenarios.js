'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Test the directive from the examples', function() {

    describe('Simple example test', function() {
        it('should load the leaflet map', function() {

            browser().navigateTo('/examples/simple-example.html');
            expect(element("div.angular-leaflet-map").text()).toEqual("+-Leaflet | © OpenStreetMap contributors");
            expect(element("div.angular-leaflet-map").css("width")).toEqual("640px");
            expect(element("div.angular-leaflet-map").css("height")).toEqual("480px");
        });
    });
});
