# angular-leaflet-directive

[AngularJS](http://angularjs.org/) directive for the Leaflet Javascript
Library. This software aims to easily embed maps managed by leaflet on your
[Leaflet](http://leaflet.cloudmade.com) project.

See some basic examples:

* [Basic example](http://tombatossals.github.io/angular-leaflet-directive/examples/simple-example.html)
* [Custom parameters example](http://tombatossals.github.io/angular-leaflet-directive/examples/custom-parameters-example.html)
* [Markers example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-example.html)
* [Polyline example](http://tombatossals.github.io/angular-leaflet-directive/examples/path-example.html)
* [Tile changer example](http://tombatossals.github.io/angular-leaflet-directive/examples/tiles-example.html)
* [Legend example](http://tombatossals.github.io/angular-leaflet-directive/examples/legend-example.html)
* [GeoJson example](http://tombatossals.github.io/angular-leaflet-directive/examples/geojson-example.html)
* [Layers example](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-example.html)
* [Events example](http://tombatossals.github.io/angular-leaflet-directive/examples/events-example.html)
* [Overlays example](http://tombatossals.github.io/angular-leaflet-directive/examples/overlays-example.html)
* [Google Maps example](http://tombatossals.github.io/angular-leaflet-directive/examples/googlemaps-example.html)


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
Finally, you must include the markup directive on your HTML page, like this:
```html
<leaflet defaults="defaults" center="center" height="480px" width="640px"></leaflet>
```
