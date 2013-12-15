Defaults Directive Documentation
================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet defaults="defaults"></leaflet>
```

It will define the default parameters from which we want to initialize our map. It's not used as a bi-directional attribute, so it will only apply the initial map parameters and nothing more. Let's see its possibilities.

We can define some custom parameters that apply to the Leaflet map creation. These are 

* [maxZoom](http://leafletjs.com/reference.html#map-maxzoom).
* [minZoom](http://leafletjs.com/reference.html#map-minzoom).
* [keyboard](http://leafletjs.com/reference.html#map-keyboard).
* [dragging](http://leafletjs.com/reference.html#map-dragging).
* [zoomControl](http://leafletjs.com/reference.html#map-zoomcontrol).
* [doubleClickZoom](http://leafletjs.com/reference.html#map-doubleclickzoom).
* [scrollWheelZoom](http://leafletjs.com/reference.html#map-scrollwheelzoom).
* [attributionControl](http://leafletjs.com/reference.html#map-attributioncontrol).
* [zoomAnimation](http://leafletjs.com/reference.html#map-zoomanimation).
* [fadeAnimation](http://leafletjs.com/reference.html#map-fadeanimation).
* [markerZoomAnimation](http://leafletjs.com/reference.html#map-markerzoomanimation).
* [worldCopyJump](http://leafletjs.com/reference.html#map-worldcopyjump).
* [crs](http://leafletjs.com/reference.html#map-crs). Coordinate reference system. Here we will use four possible values as string: [ "EPSG3857", "EPSG4326", "EPSG3395", "Simple" ]. [More information](http://leafletjs.com/reference.html#defined-crs-l.crs.epsg3857).
