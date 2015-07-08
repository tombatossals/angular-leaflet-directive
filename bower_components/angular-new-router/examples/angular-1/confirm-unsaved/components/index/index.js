angular.module('myApp.index', []).
  controller('IndexController', ['posts', IndexController]);

function IndexController (posts) {
  this.posts = posts;
}
