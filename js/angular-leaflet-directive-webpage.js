(function (angular) {
var app = angular.module('app', ['ngNewRouter', 'leaflet-directive', 'hljs', 'hc.marked', 'app.home', 'app.documentation', 'app.examples', 'app.extend']);
var controller = app.controller('AppController', [ '$router', '$scope', '$http', '$q', '$interval', '$rootScope', '$window', AppController ]);

app.config(['markedProvider', function(markedProvider) {
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
}]);

function AppController($router, $scope, $http, $q, $interval, $rootScope, $window) {
    var scope = this;

    $router.config([
        { path: '/', redirectTo: '/home' },
        { path: '/home', component: 'home' },
        { path: '/documentation', component: 'documentation' },
        { path: '/examples', component: 'examples' },
        { path: '/extend', component: 'extend' }
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
        var section = url.split(/[\/]+/).pop();
        return locationData[section];
    }

    function randomProperty(obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    }

    $scope.$on('$locationChangeSuccess', function(event, url) {
        scope.name = getSectionFromUrl(url);
    });

    function loadCity() {
        getCities().then(function(data) {
            var city = randomProperty(data);
            scope.center = {
                lat: city.lat,
                lng: city.lon,
                zoom: getRandomInt(3, 8)
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

    $interval(loadCity, 15000);

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

        app.controller("BasicFirstController", [ "$scope", function($scope) {
            // Nothing here!
        }]);
var app = angular.module('app.documentation', []);

app.controller('DocumentationController', [ DocumentationController ]);

function DocumentationController() {}

var app = angular.module('app.examples', [ 'ngNewRouter']);

app.controller('ExamplesController', [ '$router', '$scope', '$timeout', ExamplesController ]);

function ExamplesController($router, $scope, $timeout) {
    $router.config([
        {
            path: '/:section/:example',
            component: 'BasicFirstController'

        }
    ]);

    $timeout(function() {
        $('.ui.menu .browse')
          .popup({
            inline   : true,
            hoverable: true,
            position : 'bottom left',
            delay: {
              show: 300,
              hide: 800
            }
          })
        ;
    }, 200);
}

var app = angular.module('app.extend', []);

app.controller('ExtendController', [ ExtendController ]);

function ExtendController() {}

function BasicCenterController($scope) {
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

var home = angular.module('app.home', []);

home.controller('HomeController', [ HomeController ]);
home.controller('BasicCenterController', [ '$scope', BasicCenterController ]);

function HomeController() {}
})(window.angular);