angular.module('myApp.end', []).
  controller('EndController', ['answers', EndController]);

function EndController(answers) {
  this.answers = answers;
}

EndController.prototype.canActivate = function() {
  return this.answers.name && this.answers.quest && this.answers.favoriteColor;
};
