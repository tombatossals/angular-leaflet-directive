'use strict';

angular.module('example.flickr', []).
  controller('FlickrController', ['$http', FlickrController]);

var URL = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=angularjs&tagmode=any&format=json';

function FlickrController($http) {
  this.heading = 'Flickr';
  this.images = [];
  this.http = $http;

  this.activate();
}

FlickrController.prototype.activate = function() {
  var self = this;

  // hack
  window.jsonFlickrFeed = function(result) {
    self.images = result.items;
  };

  this.http.jsonp(URL);
};

FlickrController.prototype.canDeactivate = function() {
  return confirm('Are you sure you want to leave?');
};
