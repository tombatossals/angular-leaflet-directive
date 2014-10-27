Leaflet.utfgrid
===============

A UTFGrid interaction implementation for Leaflet that is super small.

Example: http://danzel.github.com/Leaflet.utfgrid/example/map.html

## Using the plugin

See the included example for the plugin in action.

### Usage

Create a new L.UtfGrid, optionally specifying the resolution (The default is 4)
```javascript
var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}', {
	resolution: 2
});
```
```?callback={cb}``` is required when using utfgrids in JSONP mode.

Add event listeners to it
```javascript
utfGrid.on('click', function (e) {
	//click events are fired with e.data==null if an area with no hit is clicked
	if (e.data) {
		alert('click: ' + e.data.admin);
	} else {
		alert('click: nothing');
	}
});
utfGrid.on('mouseover', function (e) {
	console.log('hover: ' + e.data.admin);
});
utfGrid.on('mousemove', function (e) {
	console.log('move: ' + e.data.admin);
});
utfGrid.on('mouseout', function (e) {
	console.log('unhover: ' + e.data.admin);
});
```

The callback object in all cases is:
```javascript
{
	latlng: L.LatLng
	data: Data object for the grid (whatever you are returning in the grid json)
}
```

We use JSONP by default which requires the query string part of the url to contain ```callback={cb}```.
To use an ajax query instead you need to set useJsonP:false in the L.UtfGrid options.
Your grid json provider must return raw json to support this functionality.

```javascript
var utfGrid = new L.UtfGrid('http://myserver/amazingness/{z}/{x}/{y}.grid.json', {
	useJsonP: false
});
```

### Other options

- pointerCursor: changes the mouse cursor to a pointer when hovering over an interactive part of the grid. (Default: true)
- maxRequests: Maximum number of requests sent at once to the utfgrid tile server. Increasing this will get more processing done at once, however it means your utfgrid tiles will get priority over your visual tiles (as browsers tend to prioritize javascript/json requests). Increasing this will also reduce the number of requests that may get dropped early when users pan the map. There is little point to have this higher than 8.  (Default: 4)
- requestTimeout: number of milliseconds after which a request for a tile is considered to have timed out. (Default: 60000)

### Turning interaction on and off

You can add and remove the UtfGrid layer from your map as per normal, even within a layers control.

Example: http://danzel.github.com/Leaflet.utfgrid/example/layers.html

## Other examples of UTFGrid

Spec: https://github.com/mapbox/utfgrid-spec

OpenLayers:
*   http://openlayers.org/dev/examples/utfgrid_twogrids.html
*   https://github.com/perrygeo/openlayers/blob/utfgrid/lib/OpenLayers/Tile/UTFGrid.js

Wax:
*   http://mapbox.com/wax/interaction-leaf-native.html (Doesn't work correctly in webkit)
*   https://github.com/mapbox/wax
