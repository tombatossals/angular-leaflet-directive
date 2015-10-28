'use strict';

var appRoot = 'examples/angular-1/animation';

describe('angular 1.x Hello App', function() {
  beforeEach(function() {
    browserGet('index.html');
  });

  it('should work', function() {
    expect(element(by.binding('welcome.heading')).getText())
        .toBe('Welcome to The New Angular Router Demo!');
  });
});

function browserGet (url) {
  browser.get(appRoot + '/' + url);
}
