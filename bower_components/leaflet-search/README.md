Leaflet Control Search
============

[![npm version](https://badge.fury.io/js/leaflet-search.svg)](http://badge.fury.io/js/leaflet-search)

A Leaflet control that search markers/features location by custom property.<br />
Support ajax/jsonp autocompletion and JSON data filter/remapping.

Copyright 2014 [Stefano Cudini](http://labs.easyblog.it/stefano-cudini/)

Tested in Leaflet 0.7.2

![Image](https://raw.githubusercontent.com/stefanocudini/leaflet-search/master/images/leaflet-search.jpg)

#Where

**Demo online:**  
[labs.easyblog.it/maps/leaflet-search](http://labs.easyblog.it/maps/leaflet-search/)

**Source code:**  
[Github](https://github.com/stefanocudini/leaflet-search)  
[Bitbucket](https://bitbucket.org/zakis_/leaflet-search)  
[NPM](https://npmjs.org/package/leaflet-search)  
[Atmosphere](https://atmosphere.meteor.com/package/leaflet-search)

**Bug tracking:**
[Waffle.io](https://waffle.io/stefanocudini/leaflet-search)

[Websites that use Leaflet.Control.Search](https://github.com/stefanocudini/leaflet-search/wiki/Websites-that-use-Leaflet-Control-Search)

#Examples
(require src/leaflet-search.css)

Adding the search control to the map:
```javascript
map.addControl( new L.Control.Search({layer: searchLayer}) );
//searchLayer is a L.LayerGroup contains searched markers
```

Short way:
```javascript
L.map('map', { searchControl: {layer: searchLayer} });
```

#Advanced Examples

Ajax request to search.php for retrieve elements locations:
```javascript
map.addControl( new L.Control.Search({url: 'search.php?q={s}'}) );
```

Request to third party JSONP service, implements Geocode Searching using OSM API:
```javascript
map.addControl( new L.Control.Search({
	url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
	jsonpParam: 'json_callback',
	propertyName: 'display_name',
	propertyLoc: ['lat','lon']
}) );
```

Search and color features vector in GeoJSON layer:
```javascript
var searchControl = new L.Control.Search({layer: geojsonLayer, circleLocation:false});

searchControl.on('search_locationfound', function(e) {
	
	e.layer.setStyle({fillColor: '#3f0'});

}).on('search_collapsed', function(e) {

	featuresLayer.eachLayer(function(layer) {
		featuresLayer.resetStyle(layer);
	});	
});

map.addControl(searchControl);
```

Static data source:
```javascript
var data = [
	{"loc":[41.575330,13.102411], "title":"aquamarine"},
	{"loc":[41.575730,13.002411], "title":"black"},
	{"loc":[41.219190,13.062145], "title":"cyan"}
];

map.addControl(new L.Control.Search({
	markerLocation: true,
	callData: function(text, callResponse) {
		
		//here can use custom criteria or merge data from multiple layers

		callResponse(data);

		return {	//called to stop previous requests on map move
			abort: function() {
				console.log('aborted request:'+ text);
			}
		};
	}
}) );
```

#Build

Since Version 1.4.7 this plugin support [Grunt](http://gruntjs.com/) for building process.
Therefore the deployment require [NPM](https://npmjs.org/) installed in your system.
After you've made sure to have npm working, run this in command line:
```bash
npm install
grunt
```
