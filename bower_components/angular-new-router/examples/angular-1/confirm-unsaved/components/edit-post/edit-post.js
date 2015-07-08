angular.module('myApp.editPost', []).
  controller('EditPostController', ['$routeParams', 'posts', 'saveModal', EditPostController]);

function EditPostController($routeParams, posts, saveModal) {
  this.saveModal = saveModal;
  this.post = posts[$routeParams.id];
  this.newContent = this.post.content;
}

EditPostController.prototype.canDeactivate = function () {
  if (this.newContent === this.post.content) {
    return true;
  }
  return this.saveModal.getResponse();
};

EditPostController.prototype.save = function () {
  this.post.content = this.newContent;
};
