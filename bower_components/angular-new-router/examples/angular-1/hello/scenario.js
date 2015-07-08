'use strict';

var appRoot = 'examples/angular-1/hello';

describe('angular 1.x Hello App', function() {
  beforeEach(function() {
    browserGet('index.html');
  });

  xit('should work', function() {
    expect(element(by.binding('welcome.heading')).getText())
        .toBe('Welcome to The New Angular Router Demo!');
  });
});

function browserGet (url) {
  browser.get(appRoot + '/' + url);
}
