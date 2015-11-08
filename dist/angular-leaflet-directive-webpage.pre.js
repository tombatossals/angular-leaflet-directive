(function(angular){
'use strict';
var app = angular.module('app', ['ngNewRouter', 'leaflet-directive', 'hljs', 'hc.marked', 'app.directives', 'app.services', 'app.home', 'app.void', 'app.exlist', 'app.documentation', 'app.examples', 'app.extend']);
var controller = app.controller('AppController', [ '$router', '$scope', '$location', '$http', '$q', '$interval', '$rootScope', '$window', AppController ]);

app.config(['markedProvider', function(markedProvider) {
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
}]);

function AppController($router, $scope, $location, $http, $q, $interval, $rootScope, $window) {
    var scope = this;

    $router.config([
        { path: '/', redirectTo: '/home' },
        { path: '/home', components: { main: 'home' }, as: 'home' },
        { path: '/documentation', components: { main: 'documentation' }, as: 'documentation' },
        { path: '/examples/:section/:example', components: { main: 'examples', left: 'exlist' } },
        { path: '/extend', components: { main: 'extend' }, as: 'extend' }
    ]);

    var locationData = {
        home: 'Getting started',
        documentation: 'Documentation',
        examples: 'Examples',
        extend: 'How to extend'
    };

    function getCities() {
        var df = $q.defer();

        $http.jsonp('bower_components/geodata/cities.jsonp');

        window.citiesCallback = function(data) {
            df.resolve(data);
        };

        return df.promise;
    }

    function getSectionFromUrl(url) {
        return url.split('/')[1];
    }

    function randomProperty(obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    }

    $scope.$on('$locationChangeSuccess', function(event, url) {
        scope.section = getSectionFromUrl($location.path());
        scope.name = locationData[scope.section];
    });

    function loadCity() {
        getCities().then(function(data) {
            var city = randomProperty(data);
            scope.center = {
                lat: city.lat,
                lng: city.lon,
                zoom: 3
            };

            scope.markers = {
                city: {
                    lat: city.lat,
                    lng: city.lon,
                    wikipedia: city.wikipedia,
                    label: {
                        message: city.city,
                        options: {
                            noHide: true
                        }
                    }
                }
            };
        });
    }

    loadCity();

    $interval(loadCity, 5000);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $rootScope.$on('leafletDirectiveMarker.click', function (e, args) {
        var marker = args.model;
        $window.location.href = 'http://en.wikipedia.org/wiki/' + marker.wikipedia;
    });

    angular.extend(scope, {
        center: {
            lat: 40.095,
            lng: 23.823,
            zoom: 4
        },
        tiles: {
            name: 'Mapbox Outdoors',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia3no0m'
            }
        },
        markers: {},
        defaults: {
            scrollWheelZoom: false,
            attributionControl: false,
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            }
        }
    });
}

var app = angular.module('app.directives', []);

app.directive('ngExample', [ '$http', '$compile', function($http, $compile) {
    return {
        restrict: 'A',
        scope: {
            source: '='
        },
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            scope.$watch('source', function(source) {
                if (!source) {
                    return;
                }
                var $doc = new DOMParser().parseFromString(source, "text/html");
                var body = $doc.body;
                var ctlr = body.getAttribute('ng-controller');
                var compiled = $compile('<div ng-controller="' + ctlr + '">' + body.innerHTML.replace('height="480px"', 'height="240px"') + '</div>')(scope);
                element.append(compiled);
            });

        }
    };
}]);


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

var app = angular.module('app.documentation', []);

app.controller('DocumentationController', [ DocumentationController ]);

function DocumentationController() {}

var app = angular.module('app.examples', []);

app.controller('ExamplesController', [ '$routeParams', '$http', 'Examples', ExamplesController ]);

function ExamplesController($routeParams, $http, Examples) {

    var self = this;

    if (!$routeParams.section) {
        return;
    }

    Examples.getExample($routeParams).then(function(example) {
        self.example = example;

        $http.get('examples/' + self.example.extUrl).success(function(data) {
            self.example.source = data;
        });
    });
}

app.controller("BasicFirstController", [ "$scope", function($scope) {
    // Nothing here!
}]);

app.controller('BasicCenterAutodiscoverController', [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            autoDiscover: true
        }
    });
}]);
app.controller('BasicCenterController', [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
}]);
app.controller('BasicCenterGeoIPController', [ '$scope', '$http', function($scope, $http) {
    angular.extend($scope, {
        center: {
            lat: 0,
            lng: 0,
            zoom: 2
        }
    });
    $scope.searchIP = function(ip) {
        var url = "http://freegeoip.net/json/" + ip;
        $http.get(url).success(function(res) {
            $scope.center = {
                lat: res.latitude,
                lng: res.longitude,
                zoom: 10
            }
            $scope.ip = res.ip;
        })
    };
    $scope.searchIP("");
}]);
app.controller('BasicCenterUrlHashController', [ '$scope', '$location', function($scope, $location) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
    $scope.$on("centerUrlHash", function(event, centerHash) {
        $location.search({ c: centerHash });
    });
    $scope.changeLocation = function(centerHash) {
        $location.search({ c: centerHash });
    }
}]);

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

var app = angular.module('app.extend', []);

app.controller('ExtendController', [ ExtendController ]);

function ExtendController() {}

function HomeFirstExampleController($scope) {
    angular.extend($scope, {
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}

var app = angular.module('app.home', []);

app.controller('HomeController', [ HomeController ]);
app.controller('HomeFirstExampleController', [ '$scope', HomeFirstExampleController ]);

function HomeController() {}

function HomeFirstExampleController($scope) {
    angular.extend($scope, {
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 6
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}

var app = angular.module('app.void', []);

app.controller('VoidController', [ VoidController ]);

function VoidController() {}

}(window.angular));