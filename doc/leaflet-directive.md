Leaflet directive Documentation
===============================

This directive acts as an intermediary between the AngularJS framework and the Leaflet map management library. It's composed of a main directive **&lt;leaflet&gt;** and attributes (coded as sub-directives) of the main directive. For example, we could add to our HTML code:

```
<leaflet lf-center="center" width="640px" height="480px">
```

Here we have the main **leaflet** directive, with the attribute **center** and two more attributes (without bi-directional binding) **width** and **height**.

Before detailing how to use the directive and its attributes, let's talk about initializing our web page to be able to work with the directive. We must load the required JS libraries and CSS in our HTML:

```
<html>
  <head>
     <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.5/angular.min.js"></script>
     <script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
     <script src="http://tombatossals.github.io/angular-leaflet-directive/dist/angular-leaflet-directive.min.js"></script>
     <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.css" />
  </head>
</html>
```

After loading the required libraries, we only need to define our AngularJS application (depending on 'openlayers-library') and an application controller to be able to load our map. Showing the map on screen will require that we set the width and height CSS properties of the div including the Leaflet map. We have a lot of alternatives for this, let's see the main ones.

* We can add *height* and *width* attributes to our *leaflet* directive inline. Example:
```
<leaflet width="640px" height="480px"></leaflet>
```

* We can set the *width* and *height* of the common CSS class '*angular-leaflet-map*' applied to all maps. Beware this will be applied to all maps rendered on your application. Example:
```
<style>
  .angular-leaflet-map {
    width: 640px;
    height: 480px;
  }
</style>
```

* We can set and *id* to our map, and set the CSS properties to this specifid id. Example:
```
<style>
  #main {
    width: 640px;
    height: 480px;
  }
</style>
...
<leaflet id="main"></leaflet>
```


Great, let's see now the complete HTML and inline javascript code needed to load our first map:

```
<!DOCTYPE html>
<html ng-app="demoapp">
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.5/angular.min.js"></script>
    <script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
    <script src="http://tombatossals.github.io/angular-leaflet-directive/dist/angular-leaflet-directive.min.js"></script>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.css" />
    <script>
       var app = angular.module("demoapp", ['leaflet-directive']);
       app.controller("DemoController", [ "$scope", function($scope) {
           // Nothing here!
       }]);
    </script>
  </head>
  <body ng-controller="DemoController">
    <leaflet width="640px" height="480px"></leaflet>
  </body>
</html>

```

You can see this example in action on the [simple-example.html demo file](http://tombatossals.github.io/angular-leaflet-directive/examples/simple-example.html).

Take a look at the [AnguarJS controller documentation](http://docs.angularjs.org/guide/controller) if you want to learn more about Angular controller definition, or to the [AngularJS ngApp](http://docs.angularjs.org/api/ng.directive:ngApp) to know how to bootstrap an Angular application.


Attributes Documentation
========================

We have much more possibilities than showing a simple map, but this will need that we take a closer look at the attributes, listed below:

* [_defaults_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/defaults-attribute.md)
* [_center_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/center-attribute.md)
* [_bounds_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/bounds-attribute.md)
* [_maxbounds_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/maxbounds-attribute.md)
* [_tiles_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/tiles-attribute.md)
* [_layers_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/layers-attribute.md)
* [_paths_ attribute](https://github.com/tombatossals/angular-leaflet-directive/blob/master/doc/paths-attribute.md)
