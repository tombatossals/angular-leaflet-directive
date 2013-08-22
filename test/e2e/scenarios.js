'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Test the directive from the examples', function() {

    beforeEach(function() {
        browser().navigateTo('/app/index.html');
    });

    it('should load the simple example page', function() {
        browser().navigateTo('/examples/simple-example.html');
    });
});
