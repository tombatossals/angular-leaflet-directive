Leaflet Routing Machine [![NPM version](https://badge.fury.io/js/leaflet-routing-machine.png)](http://badge.fury.io/js/leaflet-routing-machine)
=======================

Find the way from A to B on a Leaflet map. The plugin supports multiple backends:

* [OSRM](http://project-osrm.org/) - builtin and used by default
* [GraphHopper](https://graphhopper.com/) - through plugin [lrm-graphopper](https://github.com/perliedman/lrm-graphhopper)
* [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/) - through plugin [lrm-mapbox](https://github.com/perliedman/lrm-mapbox)

See the [Leaflet Routing Machine site](http://www.liedman.net/leaflet-routing-machine/) for more information, demos, tutorials and more.

## Features

* Show returned route on a map
* Edit start, end and waypoint points on the map
* Geocoding to search start, end and waypoint locations from text
* Wrapper to handle OSRM's API

## Usage

Searching, displaying and editing a route is a complex problem with several moving parts. Leaflet Routing Machine aims to solve this problem while at offering the ability to customize how the user interacts with the routing software.

For detailed documentation, please refer to the [Leaflet Routing Machine API docs](http://www.liedman.net/leaflet-routing-machine/api/).

### Installing

To use Leaflet Routing Machine, copy the files under the ```dist``` folder to where you store you scripts and CSS.

If you use NPM and Browserify (or similar), you can also do:

```
npm install --save leaflet-routing-machine
```

### Basics

The quickest way to add routing to your map is to use [`L.Routing.Control`](http://www.liedman.net/leaflet-routing-machine/api/#l-routing-control):

Include script and CSS:

```HTML
<link rel="stylesheet" href="leaflet-routing-machine.css" />
<script src="leaflet-routing-machine.min.js"></script>
```

Create a map and add the routing control:

```js
var map = L.map('map');

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.Routing.control({
    waypoints: [
        L.latLng(57.74, 11.94),
        L.latLng(57.6792, 11.949)
    ]
}).addTo(map);
```

By default, the control lets the user add new waypoints by both drag-n-drop on the route's line
in the map, or by adding new waypoints in the control's sidebar.

Unless geocoding is enabled (see below), your code should set start and end waypoints for the control,
since it can otherwise only be done by typing location names.

### Geocoding support

To let the user enter location addresses, a so called geocoder must be used. OSRM does not
provide a geocoding service, so an external service has to be used. Leaflet Routing Machine
can support any geocoding service, as long as it implements the [IGeocoder](https://github.com/perliedman/leaflet-control-geocoder#igeocoder) interface used by [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder). An easy alternative (used by the examples) is to simply use Leaflet Control Geocoder straight away.

Enable the geocoder with options when creating the control:

```js
L.Routing.control({
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);
```

(This example assumes Leaflet Control Geocoder has already been loaded.)

### Getting and modifying waypoints

The waypoints can be modified externally with either ```setWaypoints``` or ```spliceWaypoints```:

```js
// Replace existing waypoints:
control.setWaypoints([
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
]);

// Add a new waypoint before the current waypoints
control.spliceWaypoints(0, 0, L.latLng(57.68, 11.98));

// Remove the first waypoint
control.spliceWaypoints(0, 1);
```

### Building

To build the packaged files in ```dist```, run

```sh
npm install
```

This requires [Node and npm](http://nodejs.org/), as well as `grunt`.
