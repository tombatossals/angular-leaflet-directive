# Angular Leaflet Directive

[AngularJS](http://angularjs.org/) directive for the [Leaflet](http://www.leafletjs.com/) Javascript
Library. This software aims to easily embed maps managed by Leaflet on your project.

[![Join the chat at https://gitter.im/tombatossals/angular-leaflet-directive](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tombatossals/angular-leaflet-directive?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## [tombatossals](http://github.com/tombatossals/angular-leaflet-directive) — main upstream

[![Build Status](https://travis-ci.org/tombatossals/angular-leaflet-directive.png?branch=master)](https://travis-ci.org/tombatossals/angular-leaflet-directive) [![Dependencies](https://david-dm.org/tombatossals/angular-leaflet-directive.svg)](https://david-dm.org/tombatossals/angular-leaflet-directive)&nbsp;
[![Dependencies](https://david-dm.org/tombatossals/angular-leaflet-directive/dev-status.svg)](https://david-dm.org/tombatossals/angular-leaflet-directive) [![Coverage
Status](https://coveralls.io/repos/tombatossals/angular-leaflet-directive/badge.png?branch=master)](http://tombatossals.github.io/angular-leaflet-directive/coverage/PhantomJS%201.9.7%20%28Linux%29/lcov-report/dist/angular-leaflet-directive.js.html)

## [realtymaps](http://github.com/realtymaps/angular-leaflet-directive)
[![Build Status](https://travis-ci.org/realtymaps/angular-leaflet-directive.png?branch=master)](https://travis-ci.org/realtymaps/angular-leaflet-directive) [![Dependencies](https://david-dm.org/realtymaps/angular-leaflet-directive.svg)](https://david-dm.org/realtymaps/angular-leaflet-directive)&nbsp;
[![Dependencies](https://david-dm.org/realtymaps/angular-leaflet-directive/dev-status.svg)](https://david-dm.org/realtymaps/angular-leaflet-directive) [![Coverage
Status](https://coveralls.io/repos/realtymaps/angular-leaflet-directive/badge.png?branch=master)](http://realtymaps.github.io/angular-leaflet-directive/coverage/PhantomJS%201.9.7%20%28Linux%29/lcov-report/dist/angular-leaflet-directive.js.html)

## Examples

[Browse all the examples](http://tombatossals.github.io/angular-leaflet-directive/examples/0000-viewer.html) added by the community to learn about the directive and its possibilities.

## Documentation

See https://tombatossals.github.com/angular-leaflet-directive

## How to use it

Include [angular-simple-logger](https://github.com/nmccready/angular-simple-logger) before Angular-Leaflet js files. Logger gets installed as a requirement of Angular-Leaflet with `bower install` or `npm install`. Note if your using the browser to load it without CommonJS (browserify, webpack) please use angular-simple-logger.js (not index.js) .

Include the `leaflet-directive` dependency on your Angular module:
```
var app = angular.module('demoapp', ['nemLogging','leaflet-directive']);
```

After that, you can change the default values of the directive on
your angular controller. For example, you can change the tiles source, the
maxzoom on the Leaflet map or the polyline path properties.

```javascript
angular.extend($scope, {
    defaults: {
        tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
        maxZoom: 14,
        path: {
            weight: 10,
            color: '#800000',
            opacity: 1
        }
    }
});
```

If you want to set the start of the map to a precise position, you can define
the "center" property of the scope (lat, lng, zoom). It will be updated
interacting on the scope and on the leaflet map in two-way binding. Example:
```javascript
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 8
    }
});
```

If you need to run any method on the map object, use `leafletData` as following (notice the map object is returned in a form of a promise):

```javascript
angular.module('myModule').controller('MapController', ['$scope', 'leafletData',
    function($scope, leafletData) {
        leafletData.getMap().then(function(map) {
            L.GeoIP.centerMapOnPosition(map, 15);
        });
    }
]);
```

Finally, you must include the markup directive on your HTML page:
```html
<leaflet defaults="defaults" lf-center="center" height="480px" width="640px"></leaflet>
```

If you want to have more than one map on the page and access their respective map objects, add an *id* attribute to your leaflet directive in HTML:

```html
<leaflet id="mymap" defaults="defaults" lf-center="center" height="480px" width="640px"></leaflet>
```

And then you can use this id in `getMap()`:

```javascript
angular.module('myModule').controller('MapController', ['$scope', 'leafletData',
    function($scope, leafletData) {
        leafletData.getMap('mymap').then(function(map) {
            L.GeoIP.centerMapOnPosition(map, 15);
        });
    }
]);
```
