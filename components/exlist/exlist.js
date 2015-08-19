var app = angular.module('app.exlist', []);

app.controller('ExlistController', [ '$q', '$http', 'Examples', ExlistController ]);

function ExlistController($q, $http, Examples) {

    var self = this;

    Examples.getSections().then(function(sections) {
        self.sections = sections;
    });

    Examples.getExamples().then(function(examples) {
        self.examples = examples;
    });

}
