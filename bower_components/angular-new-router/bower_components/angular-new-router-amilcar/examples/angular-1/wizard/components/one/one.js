angular.module('myApp.one', []).
  controller('OneController', ['answers', OneController]);

function OneController (answers) {
  this.answers = answers;
  this.question = 'What...is your name?';
}
