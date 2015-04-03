'use strict';

(function() {

    var app = angular.module('webapp', ['ngRoute', 'leaflet-directive']);

    app.config(function($routeProvider) {
        $routeProvider.when('/:section/:example', {
            templateUrl: function(attrs) {
                return 'partials/example.html';
            },
            reloadOnSearch: false
        });
    });

    app.directive('ngExample', [ '$http', '$compile', function($http, $compile, $ocLazyLoad) {
        return {
            restrict: 'A',
            scope: {
                url: '='
            },
            replace: true,
            template: '<div></div>',
            link: function(scope, element, attrs) {
                scope.$watch('url', function(url) {

                    $http.get(url).success(function(data) {
                        var $doc = new DOMParser().parseFromString(data, "text/html");
                        var body = $doc.body;
                        var ctlr = $doc.body.getAttribute('ng-controller');
                        var compiled = $compile('<div ng-controller="' + ctlr + '">' + body.innerHTML + '</div>')(scope);
                        element.append(compiled);
                    });

                });

            }
        };
    }]);

    app.directive('ngCode', [ '$http', '$timeout', function($http, $timeout) {
        return {
            restrict: 'A',
            scope: {
                url: '='
            },
            replace: true,
            templateUrl: 'partials/source.html',
            link: function(scope, element, attrs) {

                scope.$watch('url', function(url) {
                    $http.get(url).success(function(data) {
                        scope.source = data;

                        var $doc = new DOMParser().parseFromString(data, "text/html");

                        $timeout(function() {
                            Prism.highlightAll();
                        }, 200);
                    });
                })
            }
        };
    }]);

    app.controller('MainController', [ '$scope', '$http', '$q', '$timeout', '$location', function($scope, $http, $q, $timeout, $location) {

        var examples = $q.defer();

        var getExample = function(id, section, examples) {
            var df = $q.defer();
            examples.promise.then(function(examples) {
                var sectionExamples = examples[section];
                for (var i in sectionExamples) {
                    var e = sectionExamples[i];
                    if (e.id === id) {
                        df.resolve(e);
                    }
                }
            });
            return df.promise;
        };

        $timeout(function() {
            if (!$scope.example) {
                $location.url('/basic/first-example');
            }
        },300);

        $scope.$on('$routeChangeSuccess', function(event, route) {
            var id = route.params.example;
            var section = route.params.section;

            getExample(id, section, examples).then(function(example) {
                $scope.example = example;
                $scope.section = section;
            });

        });

        $http.get('json/examples.json').success(function(data) {
            if (!$scope.section) {
                $scope.section = 'basic';
            }
            $scope.examples = data;
            examples.resolve(data);
        });

    } ]);


}());
