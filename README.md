# angular-leaflet-directive
[![Build Status](https://travis-ci.org/tombatossals/angular-leaflet-directive.png)](https://travis-ci.org/tombatossals/angular-leaflet-directive) [![Dependency Status](https://gemnasium.com/tombatossals/angular-leaflet-directive.png)](https://gemnasium.com/tombatossals/angular-leaflet-directive) [![Coverage
Status](https://coveralls.io/repos/tombatossals/angular-leaflet-directive/badge.png?branch=master)](http://tombatossals.github.io/angular-leaflet-directive/coverage/PhantomJS%201.9.7%20%28Linux%29/lcov-report/dist/angular-leaflet-directive.js.html)



[AngularJS](http://angularjs.org/) directive for the Leaflet Javascript
Library. This software aims to easily embed maps managed by leaflet on your
[Leaflet](http://leaflet.cloudmade.com) project.

See some basic examples:

* [Basic example](http://tombatossals.github.io/angular-leaflet-directive/examples/simple-example.html)
* [Center example](http://tombatossals.github.io/angular-leaflet-directive/examples/center-example.html)
* [Center autodiscover example](http://tombatossals.github.io/angular-leaflet-directive/examples/center-autodiscover-example.html)
* [Center with url hash example](http://tombatossals.github.io/angular-leaflet-directive/examples/url-hash-center-example.html)
* [Custom parameters example](http://tombatossals.github.io/angular-leaflet-directive/examples/custom-parameters-example.html)
* [Draw controls example](http://tombatossals.github.io/angular-leaflet-directive/examples/control-draw-example.html)
* [Bounds example](http://tombatossals.github.io/angular-leaflet-directive/examples/bounds-example.html)
* [MaxBounds example](http://tombatossals.github.io/angular-leaflet-directive/examples/maxbounds-example.html)
* [Tiles example](http://tombatossals.github.io/angular-leaflet-directive/examples/tiles-example.html)
* [Tile zoom changer example](http://tombatossals.github.io/angular-leaflet-directive/examples/tiles-zoom-changer-example.html)
* [Layers simple example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-simple-example.html)
* [Overlays simple example](http://tombatossals.github.io/angular-leaflet-directive/examples/overlays-simple-example.html)
* [ImageOverlay simple example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-imageoverlay-example.html)
* [Dynamic add/remove layers/overlays example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-add-remove.html)
* [Google Maps example](http://tombatossals.github.io/angular-leaflet-directive/examples/googlemaps-example.html)
* [Hide a layer in the layer selector example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-hide-baselayer-on-selector-example.html)
* [ESRI Dynamic Layer example](http://tombatossals.github.io/angular-leaflet-directive/examples/esri-dynamiclayer-example.html)
* [ESRI Legend example](http://tombatossals.github.io/angular-leaflet-directive/examples/esri-legend-example.html)
* [Yandex Maps example](http://tombatossals.github.io/angular-leaflet-directive/examples/yandexmaps-example.html)
* [Paths Simple example](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-simple-example.html)
* [Paths Types example](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-types-example.html)
* [Paths example](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-example.html)
* [Single marker example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-simple-example.html)
* [Marker with label example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-label-example.html)
* [Marker with Angular templates example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-angular-template-example.html)
* [Marker with group clustering example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-example.html)
* [Marker with group clustering example (10000 markers)](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-10000.html)
* [Marker with group clustering example without overlays](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-without-overlays-example.html)
* [Marker groups example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-groups-example.html)
* [Marker update properties example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-update-example.html)
* [Markers dynamic add/remove example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-dynamic-addremove-example.html)
* [Marker addition example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-add-example.html)
* [Legend example](http://tombatossals.github.io/angular-leaflet-directive/examples/legend-example.html)
* [GeoJson example](http://tombatossals.github.io/angular-leaflet-directive/examples/geojson-example.html)
* [HeatMap example](http://tombatossals.github.io/angular-leaflet-directive/examples/heatmap-example.html)
* [Decoration example](http://tombatossals.github.io/angular-leaflet-directive/examples/decorations-simple-example.html)
* [UTFGrid example](http://tombatossals.github.io/angular-leaflet-directive/examples/utfgrid-example.html)
* [Layers extended example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-example.html)
* [Events example](http://tombatossals.github.io/angular-leaflet-directive/examples/events-example.html)
* [Overlays extended example](http://tombatossals.github.io/angular-leaflet-directive/examples/overlays-example.html)
* [Accessing the leaflet map object](http://tombatossals.github.io/angular-leaflet-directive/examples/access-leaflet-object-example.html)
* [Accessing the leaflet map object of two maps](http://tombatossals.github.io/angular-leaflet-directive/examples/double-map-example.html)
* [Two maps sharing attributes](http://tombatossals.github.io/angular-leaflet-directive/examples/double-map-sharing-attributes.html)
* [Center map with GeoIP](http://tombatossals.github.io/angular-leaflet-directive/examples/center-geoip-example.html)

To see it in action, go to the main page where you can find more examples and
some documentation:

 * http://tombatossals.github.com/angular-leaflet-directive


## How to use it

You must include the leaflet-directive dependency on your angular module:
```
var app = angular.module("demoapp", ["leaflet-directive"]);
```

After that, you can change the default values of the directive (if you want) on
your angular controller. For example, you can change the tiles source, the
maxzoom on the leaflet map or the polyline path properties.

```javascript
angular.extend($scope, {
    defaults: {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
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

If you need to run any method on the map object, use ```leafletData``` as following (notice the map object is returned in a form of a promise):

```javascript
angular.module('myModule').controller('MapController', ['$scope', 'leafletData',
	function($scope, leafletData) {
	        leafletData.getMap().then(function(map) {
	            L.GeoIP.centerMapOnPosition(map, 15);
	        });
	}
]);
```

Finally, you must include the markup directive on your HTML page, like this:
```html
<leaflet defaults="defaults" center="center" height="480px" width="640px"></leaflet>
```

If you want to have more than one map on the page and access their respective map objects, add an *id* attribute to your leaflet directive in HTML, like this:

```html
<leaflet id="mymap" defaults="defaults" center="center" height="480px" width="640px"></leaflet>
```

And then you can use this id in ```getMap()``` like this:

```javascript
angular.module('myModule').controller('MapController', ['$scope', 'leafletData',
	function($scope, leafletData) {
	        leafletData.getMap('mymap').then(function(map) {
	            L.GeoIP.centerMapOnPosition(map, 15);
	        });
	}
]);
```
