angular.module('example.welcome', []).
    controller('WelcomeController', WelcomeController);

function WelcomeController() {
  this.heading = 'Welcome to The New Angular Router Demo!';
}
