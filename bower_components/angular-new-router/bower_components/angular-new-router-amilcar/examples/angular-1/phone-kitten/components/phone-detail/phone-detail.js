'use strict';

angular.module('phoneKitten.phoneDetail', []).
    controller('PhoneDetailController', ['$routeParams', 'Phone', PhoneDetailController]);

function PhoneDetailController($routeParams, Phone) {
  var self = this;
  this.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    self.setImage(phone.images[0]);
  });
}

PhoneDetailController.prototype.canActivate = function() {
  return this.phone.$promise;
};

PhoneDetailController.prototype.setImage = function(imageUrl) {
  this.mainImageUrl = imageUrl;
};
