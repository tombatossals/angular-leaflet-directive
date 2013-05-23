# angular-leaflet-directive

[AngularJS](http://angularjs.org/) directive for the Leaflet Javascript Library. This software aims to 
easily embed maps managed by leaflet on your [Leaflet](http://leaflet.cloudmade.com) project.

See some basic examples:

* [Basic example](http://tombatossals.github.io/angular-leaflet-directive/examples/simple-example.html)
* [Custom parameters example](http://tombatossals.github.io/angular-leaflet-directive/examples/custom-parameters-example.html)
* [Markers example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-example.html)
* [Polyline example](http://tombatossals.github.io/angular-leaflet-directive/examples/path-example.html)


To see it in action, go to the main page where you can find more examples and some documentation:

 * http://tombatossals.github.com/angular-leaflet-directive


## How to use it

You must include the leaflet-directive dependency on your angular module:
```
var app = angular.module("demoapp", ["leaflet-directive"]);
```

After that, you can change the default values of the directive (if you want) on your angular controller. For example, you can change the tiles source, the maxzoom on the leaflet map or the polyline path properties.

```
angular.extend($scope, {
    defaults: {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        maxZoom: 14,
        path: {
            weight: 10,
            opacity: 1
        }
    }
});
```

If you want to set the start of the map to a precise position, you can define the "center" property of the scope (lat, lng, zoom). It will be updated interacting on the scope and on the leaflet map in two-way binding. Example:
```
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 8
    }
});

```
Finally, you must include the markup directive on your HTML page, like this:
```
<leaflet defaults="defaults" center="center"></leaflet>
```

## How to contribute

You can use grunt/karma to test your code, and grunt/jshint to lint your code.

```
# Inside the project dir, install the dependencies
$ npm install

# Set the PATH for the binaries of grunt
$ export PATH=$PATH:node_modules/.bin

# JSHINT
$ grunt jshint
Running "jshint:files" (jshint) task
>> 2 files lint free.

Done, without errors.

# KARMA
$ grunt karma
Running "karma:unit" (karma) task
INFO [karma]: Karma server started at http://localhost:9018/
INFO [launcher]: Starting browser PhantomJS
INFO [PhantomJS 1.9 (Linux)]: Connected on socket id y6MlOmYdWFtvS-F83ZHu
PhantomJS 1.9 (Linux): Executed 8 of 8 SUCCESS (0.438 secs / 0.137 secs)
