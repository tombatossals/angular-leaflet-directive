angular.module('example.goodbye', []).
    controller('GoodbyeController', GoodbyeController);

function GoodbyeController() {
  this.heading = 'Goodbye to The New Angular Router Demo :(';
}
