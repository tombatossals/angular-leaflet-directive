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
        $scope.sections = [];

        var getExample = function(id, section, examples) {
            var df = $q.defer();
            examples.promise.then(function(examples) {
                var sectionExamples = examples[section];
                for (var i in sectionExamples) {
                    var e = sectionExamples[i];
                    if (e.id === '/' + section + '/' + id) {
                        df.resolve(e);
                        break;
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

            $scope.setActiveSection(section);
            getExample(id, section, examples).then(function(example) {
                $scope.example = example;
            });

        });

        var extractSections = function(examples) {
            return Object.keys(examples).map(function(section) {
                return {
                    id: section,
                    name: section.charAt(0).toUpperCase() + section.slice(1),
                    active: false
                }
            });
        };

        $scope.setActiveSection = function(id) {
            $scope.sections.map(function(section) {
                section.active = (id === section.id);
            });
        };

        var getActiveSection = function(sections) {
            var active;
            for (var i=0; i<sections.length; i++) {
                if (sections[i].active) {
                    active = sections[i].id;
                    break;
                }
            }
            return active;
        }

        $scope.getExamplesFromActiveSection = function() {
            var section = getActiveSection($scope.sections);
            if (!section) return;
            return $scope.examples[section];
        }

        $http.get('json/examples.json').success(function(data) {
            $scope.sections = extractSections(data);
            $scope.examples = data;
            examples.resolve(data);
            $scope.setActiveSection('basic');
        });

    } ]);


}());
