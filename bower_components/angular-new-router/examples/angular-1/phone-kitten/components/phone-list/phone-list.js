'use strict';

angular.module('phoneKitten.phoneList', []).
    controller('PhoneListController', ['Phone', PhoneListController]);

function PhoneListController(Phone) {
  this.Phone = Phone;
  this.orderProp = 'age';
}

PhoneListController.prototype.activate = function() {
  this.phones = this.Phone.query();
};
