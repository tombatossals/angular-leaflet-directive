var app = angular.module('app', ['ngNewRouter', 'leaflet-directive', 'hljs', 'hc.marked', 'app.directives', 'app.services', 'app.home', 'app.void', 'app.exlist', 'app.documentation', 'app.examples', 'app.extend']);
var controller = app.controller('AppController', AppController);

app.config(function(markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function(code) {
      return hljs.highlightAuto(code).value;
    },
  });
});

function AppController($router, $scope, $location, $http, $q, $interval, $rootScope, $window, Examples) {
  var scope = this;

  $router.config([
      { path: '/', redirectTo: '/home' },
      { path: '/home', components: { main: 'home' }, as: 'home' },
      { path: '/documentation/:subsection', components: { main: 'documentation' }, as: 'documentation' },
      { path: '/examples/:section/:example', components: { main: 'examples', left: 'exlist' } },
      { path: '/extend', components: { main: 'extend' }, as: 'extend' },
  ]);

  var locationData = {
    home: 'Getting started',
    documentation: 'Documentation',
    examples: 'Examples',
    extend: 'How to extend',
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

  function getSubsectionFromUrl(url) {
    return url.split('/')[2];
  }

  function randomProperty(obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
  }

  $scope.$on('$locationChangeSuccess', function(event, url) {
    scope.section = getSectionFromUrl($location.path());

    if (scope.section === 'documentation') {
      scope.subsection = getSubsectionFromUrl($location.path());
    }

    if (scope.section === 'examples') {
      var location = {
        section: 'basic',
        example: 'first-example',
      };

      Examples.getExample(location).then(function(example) {
        console.log('ye', example);
        scope.example = example;
      });
    }

    scope.name = locationData[scope.section];
  });

  function loadCity() {
    getCities().then(function(data) {
      var city = randomProperty(data);
      scope.center = {
        lat: city.lat,
        lng: city.lon,
        zoom: 3,
      };

      scope.markers = {
        city: {
          lat: city.lat,
          lng: city.lon,
          wikipedia: city.wikipedia,
          label: {
            message: city.city,
            options: {
              noHide: true,
            },
          },
        },
      };
    });
  }

  loadCity();

  $interval(loadCity, 5000);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $rootScope.$on('leafletDirectiveMarker.click', function(e, args) {
    var marker = args.model;
    $window.location.href = 'http://en.wikipedia.org/wiki/' + marker.wikipedia;
  });

  angular.extend(scope, {
    center: {
      lat: 40.095,
      lng: 23.823,
      zoom: 4,
    },
    tiles: {
      name: 'Mapbox Outdoors',
      url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
      type: 'xyz',
      options: {
        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
        mapid: 'bufanuvols.lia3no0m',
      },
    },
    markers: {},
    defaults: {
      scrollWheelZoom: false,
      attributionControl: false,
      tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      },
    },
  });
}
