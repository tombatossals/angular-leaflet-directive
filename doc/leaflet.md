Leaflet directive Documentation
===============================

This directive acts as an intermediary between the AngularJS framework and the Leaflet map management library. It's composed of a main directive "**leaflet**" and attributes which gives us the required functionality. For example, we could add to our HTML code:

```
&lt;leaflet lf-center="center" width="640px" height="480px">
```

Here we have the main "**leaflet**" directive, with the sub-direcitve "**lf-center**" and two more attributes (without bi-directional binding) **width** and **height**.

Before detailing how to use the directive and its attributes, let's talk about initializing our web page to be able to work with the directive. We must load the required JS libraries and CSS in our HTML:

```
&lt;html>
  &lt;head>
     &lt;script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script>
     &lt;script src="http://cdn.leafletjs.com/leaflet-0.7.7/leaflet.js"></script>
     &lt;script src="http://tombatossals.github.io/angular-leaflet-directive/dist/angular-leaflet-directive.min.js"></script>
     &lt;link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.7/leaflet.css" />
  &lt;/head>
&lt;/html>
```

After loading the required libraries, we only need to define our AngularJS application (depending on 'angular-leaflet') and an application controller to be able to load our map. Showing the map on screen will require that we set the width and height CSS properties of the div including the Leaflet map. We have a lot of alternatives for this, let's see the main ones.

* We can add *height* and *width* attributes to our *leaflet* directive inline. Example:
```
&lt;leaflet width="640px" height="480px">&lt;/leaflet>
```

* We can set the *width* and *height* of the common CSS class '*angular-leaflet-map*' applied to all maps. Beware this will be applied to all maps rendered in your application. Example:
```
&lt;style>
  .angular-leaflet-map {
    width: 640px;
    height: 480px;
  }
&lt;/style>
```

* We can set and *id* to our map, and set the CSS properties to this specifid id. Example:
```
&lt;style>
  #main {
    width: 640px;
    height: 480px;
  }
&lt;/style>
...
&lt;leaflet id="main"></leaflet>
```


Great, let's see now the complete HTML and inline javascript code needed to load our first map:

```
&lt;!DOCTYPE html>
&lt;html ng-app="demoapp">
  &lt;head>
    &lt;script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script>
    &lt;script src="http://cdn.leafletjs.com/leaflet-0.7.7/leaflet.js"></script>
    &lt;script src="http://tombatossals.github.io/angular-leaflet-directive/dist/angular-leaflet-directive.min.js"></script>
    &lt;link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.7/leaflet.css" />
    &lt;script>
       var app = angular.module("demoapp", ['leaflet-directive']);
       app.controller("DemoController", [ "$scope", function($scope) {
           // Nothing here!
       }]);
    &lt;/script>
  &lt;/head>
  &lt;body ng-controller="DemoController">
    &lt;leaflet width="640px" height="480px"></leaflet>
  &lt;/body>
&lt;/html>

```

You can see this example in action on the [basic-first-example demo file](http://tombatossals.github.io/angular-leaflet-directive/examples/0100-basic-first-example.html).

Take a look at the [AnguarJS controller documentation](http://docs.angularjs.org/guide/controller) if you want to learn more about Angular controller definition, or to the [AngularJS ngApp](http://docs.angularjs.org/api/ng.directive:ngApp) to know how to bootstrap an Angular application.


Attributes and subdirectives documentation
==========================================

We have much more possibilities than showing a simple map, but we will need to take a closer look at the attributes and subdirectives documentation&examples you can find in the upper links.
