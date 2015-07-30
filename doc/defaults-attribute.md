'defaults' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet defaults="defaults"></leaflet>
```

It will define the default parameters from which we want to initialize our map. It's not used as a bi-directional attribute, so it will only apply the initial map parameters and nothing more. Let's see the possibilities.

We can define some specific parameters that apply to the Leaflet map creation. Only the parameters listed below will be passed to Leaflet on the map creation process. This is the list:

* [maxZoom](http://leafletjs.com/reference.html#map-maxzoom). *Number*. From 1 to 20.
* [minZoom](http://leafletjs.com/reference.html#map-minzoom). *Number* From 1 to 20.
* [keyboard](http://leafletjs.com/reference.html#map-keyboard). *Boolean*. Allows the use of the keyboard to navigate the map.
* [dragging](http://leafletjs.com/reference.html#map-dragging). *Boolean*. Allows to drag the mouse, or make it static.
* [zoomControl](http://leafletjs.com/reference.html#map-zoomcontrol). *Boolean*. Put the zoom control on the map or not.
* [doubleClickZoom](http://leafletjs.com/reference.html#map-doubleclickzoom). *Boolean*. Allows to zoom with the double-click mouse action.
* [scrollWheelZoom](http://leafletjs.com/reference.html#map-scrollwheelzoom). *Boolean*. Allows to zoom with the mouse wheel.
* [tap](http://leafletjs.com/reference.html#map-tap). *Boolean*. Enables mobile hacks for supporting instant taps (fixing 200ms click delay on iOS/Android) and touch holds (fired as contextmenu events).
* [attributionControl](http://leafletjs.com/reference.html#map-attributioncontrol). *Boolean*. Shows or hides the attribution text control.
* [zoomAnimation](http://leafletjs.com/reference.html#map-zoomanimation). *Boolean*. Animate the zoom action or not.
* [fadeAnimation](http://leafletjs.com/reference.html#map-fadeanimation). *Boolean*. Enable/disable the tile fade animation.
* [markerZoomAnimation](http://leafletjs.com/reference.html#map-markerzoomanimation). *Boolean*. Enable/disable the marker zoom animation.
* [worldCopyJump](http://leafletjs.com/reference.html#map-worldcopyjump). *Boolean*.
* [crs](http://leafletjs.com/reference.html#map-crs). *String*. Coordinate reference system. Here we will use four possible values: [ "EPSG3857", "EPSG4326", "EPSG3395", "Simple" ]. [More information](http://leafletjs.com/reference.html#defined-crs-l.crs.epsg3857).


We can define also some other defaults, like the default tileLayer url where the tiles will be fetched, or the zoom control position on the map. You can see the list of all the default parameters [here](https://github.com/tombatossals/angular-leaflet-directive/blob/master/src/services/leafletMapDefaults.js#L2).

Let's see an example of how to use this. First of all, in our controller, we will create a new object *defaults* inside the *$scope* where we will set the parameters that we want to change.

```
angular.extend($scope, {
   defaults: {
       tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
       zoomControlPosition: 'topright',
       scrollWheelZoom: false
   }
});
```

And after that, in our HTML code we will define our leaflet directive like this:
```
<leaflet defaults="defaults"></leaflet>
```

And that's all. A full example of using this attribute can be found [here](http://tombatossals.github.io/angular-leaflet-directive/examples/custom-parameters-example.html).
