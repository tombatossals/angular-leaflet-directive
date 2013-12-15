Defaults Directive Documentation
================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet defaults="defaults"></leaflet>
```

It will define the default parameters from which we want to initialize our map. It's not used as a bi-directional attribute, so it will only apply the initial map parameters and nothing more. Let's see its possibilities.

We can define some custom parameters that apply to the Leaflet map creation. These are 

* **maxZoom**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-maxzoom).
* **minZoom**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-minzoom).
* **keyboard**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-keyboard).
* **dragging**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-dragging).
* **zoomControl**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-zoomcontrol).
* **doubleClickZoom**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-doubleclickzoom).
* **scrollWheelZoom**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-scrollwheelzoom).
* **attributionControl**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-attributioncontrol).
* **zoomAnimation**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-zoomanimation).
* **fadeAnimation**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-fadeanimation).
* **markerZoomAnimation**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-markerzoomanimation).
* **worldCopyJump**. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-worldcopyjump).
* **crs**. Coordinate reference system. Four possible values, as string: [ "EPSG3857", "EPSG4326", "EPSG3395", "Simple" ]. Related Leaflet documentation [here](http://leafletjs.com/reference.html#map-crs). Information about the four CRS possible values [here](http://leafletjs.com/reference.html#defined-crs-l.crs.epsg3857)
* 
