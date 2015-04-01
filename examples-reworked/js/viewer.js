'use strict';

(function() {

    var getSource = function(url) {
    };

    var app = angular.module('webapp', ['ngRoute', 'leaflet-directive']).config(function($locationProvider) {
        $locationProvider.html5Mode(false);
    });

    app.config(function($routeProvider) {
        $routeProvider.when('/:section/:example', {
            templateUrl: function(attrs) {
                return 'partials/example.html';
            },
            reloadOnSearch: false
        });
    });

    app.controller("BasicFirstController", [ "$scope", function($scope) {
        // Nothing here!
        console.log('holaaa');
    }]);

    app.directive('ngExample', [ '$http', '$compile', function($http, $compile) {
        return {
            restrict: 'A',
            scope: {
                url: '='
            },
            replace: true,
            template: '<div class="hola"></div>',
            link: function(scope, element, attrs) {
                scope.$watch('url', function(url) {

                    $http.get(url).success(function(data) {
                        var $doc = new DOMParser().parseFromString(data, "text/html");
                        var body = $doc.body;
                        var controller = body.getAttribute('ng-controller');
                        var compiled = $compile('<div ng-controller="' + controller + '">' + body.innerHTML + '</div>')(scope);
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

    app.controller('MainController', [ '$scope', '$http', '$q', function($scope, $http, $q) {

        var examples = $q.defer();
        $scope.$on('$routeChangeSuccess', function(event, route) {
            var url = route.params.example;
            $scope.section = route.params.section;

            examples.promise.then(function(examples) {
                if (!$scope.section) {
                    $scope.section = 'basic';
                }
                var sectionExamples = examples[$scope.section];
                for (var i in sectionExamples) {
                    var e = sectionExamples[i];
                    if (e.url === url) {
                        $scope.url = e.extUrl;
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

    } ]);


}());
