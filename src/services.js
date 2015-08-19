var app = angular.module('app.services', []);

app.factory('Examples', [ '$http', '$q', Examples]);

function Examples($http, $q) {
    var df = $q.defer();

    $http.get('examples/json/examples.json').success(function(data) {
        df.resolve(data);
    });

    return {
        getExamples: function() {
            return df.promise.then(function(examples) {
                return examples;
            });
        },
        getExample: function(location) {
            return df.promise.then(function(examples) {

                if (!examples[location.section]) {
                    return;
                }

                var found = {};
                angular.forEach(examples[location.section], function(example) {
                    if (example.id === '/' + location.section + '/' + location.example) {
                        found = example;
                    }
                });

                return found;
            });
        },
        getSections: function() {
            return df.promise.then(function(examples) {
                return Object.keys(examples).map(function(section) {
                    return {
                        id: section,
                        name: section.charAt(0).toUpperCase() + section.slice(1),
                        active: false
                    };
                });
            });
        }
    };
}
