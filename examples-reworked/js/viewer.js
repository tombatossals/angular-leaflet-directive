'use strict';

(function() {

    var app = angular.module('webapp', ['ngRoute', 'leaflet-directive']).config(function($locationProvider) {
        $locationProvider.html5Mode(false);
    });


    app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/frontpage.html'
        }).when('/:section/:example', {
            templateUrl: function(attrs) {
                return 'partials/example.html';
            },
            reloadOnSearch: false
        });
    });

    app.controller('MainController', function($scope, $http, $q, $timeout) {

        var examples = $q.defer();

        $scope.$on('$routeChangeSuccess', function(event, route) {
            var url = route.params.example;
            $scope.section = route.params.section;

            var getSource = function(example) {
                $http.get(example.extUrl).success(function(data) {
                    example.source = data;

                    var $doc = new DOMParser().parseFromString(data, "text/html");
                    console.log($doc.getElementsByTagName('script'));

                    $timeout(function() {
                        Prism.highlightAll();
                    }, 200);
                });
            };

            examples.promise.then(function(examples) {
                if (!$scope.section) {
                    $scope.section = 'basic';
                }
                var sectionExamples = examples[$scope.section];
                for (var i in sectionExamples) {
                    var example = sectionExamples[i];
                    if (example.url === url) {
                        $scope.activeExample = example;
                        getSource(example);
                    }
                }
            });
        });

        $http.get('json/examples.json').success(function(data) {
            if (!$scope.section) {
                $scope.section = 'basic';
            }
            $scope.examples = data.examples;
            examples.resolve(data.examples);
        });

    });


}());
