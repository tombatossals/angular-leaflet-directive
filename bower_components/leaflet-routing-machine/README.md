[Leaflet Routing Machine]((http://www.liedman.net/leaflet-routing-machine/)) [![NPM version](https://badge.fury.io/js/leaflet-routing-machine.png)](http://badge.fury.io/js/leaflet-routing-machine)
=======================

Find the way from A to B on a Leaflet map. The plugin supports multiple backends:

* [OSRM](http://project-osrm.org/) - builtin and used by default
* [GraphHopper](https://graphhopper.com/) - through plugin [lrm-graphopper](https://github.com/perliedman/lrm-graphhopper)
* [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/) - through plugin [lrm-mapbox](https://github.com/perliedman/lrm-mapbox)

## Features

* Show returned route on a map
* Edit start, end and waypoint points on the map
* Geocoding to search start, end and waypoint locations from text
* Wrapper to handle OSRM's API

### Go to the [Leaflet Routing Machine site](http://www.liedman.net/leaflet-routing-machine/) for more information, demos, tutorials and more.

## Building

```sh
npm install
```

This requires [Node and npm](http://nodejs.org/), as well as `grunt`.
