'use strict';

var appRoot = 'examples/angular-1/confirm-unsaved';

describe('angular 1.x "Confirm Unsaved" App', function() {

  describe('Index', function () {
    beforeEach(function() {
      browserGet('index.html');
    });

    it('should list items', function() {
      var items = element.all(by.binding('item.title'));
      var first = items.get(0);
      expect(first.getText()).toBe('Edit First Post');
    });

    it('should link items', function() {
      var items = element.all(by.binding('item.title'));
      var first = items.get(0);
      expect(first.getAttribute('href')).toBe('http://0.0.0.0:8000/examples/angular-1/confirm-unsaved/post/1');

      first.click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/post/1');
      });
    });
  });

  describe('Edit', function () {
    beforeEach(function () {
      browserGet('index.html#/post/1');
    });

    it('should show the initial text', function() {
      expect(element(by.model('editPost.newContent')).getAttribute('value')).toBe('I wrote this first.');
    });

    it('should let you navigate back to the index', function () {
      var back = element(by.linkText('Back'));
      back.click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/');
      });
    })

    it('should prompt you to save if content was changed', function() {
      var postContent = element(by.model('editPost.newContent'));
      postContent.sendKeys(' Hey!');
      var back = element(by.linkText('Back'));
      back.click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/post/1');
      });

      expect($('.modal').getText()).toContain('You have unsaved work');

      element(by.buttonText('Go back and save')).click();
      element(by.buttonText('Save')).click();

      back.click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/');
      });
    });

    it('should let you navigate back without saving', function () {
      var postContent = element(by.model('editPost.newContent'));
      var previousText = postContent.getText();

      postContent.sendKeys(' Hey!');
      var back = element(by.linkText('Back'));
      back.click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/post/1');
      });

      expect($('.modal').getText()).toContain('You have unsaved work');

      element(by.buttonText('Go back and save')).click();
      element(by.buttonText('Save')).click();

      back.click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/');
      });
    });

    it('should save content if you click "Save"', function () {
      element(by.model('editPost.newContent')).sendKeys(' Hey!');
      element(by.buttonText('Save')).click();
      element(by.linkText('Back')).click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/');
      });

      element.all(by.binding('item.title')).get(0).click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/post/1');
      });

      expect(element(by.model('editPost.newContent')).getAttribute('value')).toBe('I wrote this first. Hey!');
    });
  });
});


function browserGet (url) {
  browser.get(appRoot + '/' + url);
}
