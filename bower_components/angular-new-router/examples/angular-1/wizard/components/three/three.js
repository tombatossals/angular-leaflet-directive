
angular.module('myApp.three', []).
  controller('ThreeController', ['answers', ThreeController]);

function ThreeController(answers) {
  this.answers = answers;
  this.question = 'What...is your favorite color?';
}

ThreeController.prototype.canActivate = function () {
  return this.answers.name && this.answers.quest;
};
