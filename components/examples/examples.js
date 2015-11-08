var app = angular.module('webapp.examples', []);

app.controller('ExamplesController', ExamplesController);

function ExamplesController($routeParams, $http, Examples) {
  var self = this;

  if (!$routeParams.section) {
    return;
  }

  Examples.getExample($routeParams).then(function(example) {
    self.example = example;
  });
}
