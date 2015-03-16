WebGL Heatmap Leaflet Plugin
=====================

A Leaflet plugin for [@pyalot](https://github.com/pyalot)'s [webgl heatmap library](https://github.com/pyalot/webgl-heatmap).

As [@pyalot](https://github.com/pyalot) explains in his post, [High Performance JS heatmaps](http://codeflow.org/entries/2013/feb/04/high-performance-js-heatmaps/), sometimes there is a need to be able to draw hundreds of thousands of data points to a map (and not have your browser crash due to lag).

We used his library to create a WebGL alternative to Leaflet's existing heatmap plugins.

It uses the following existing options in the library:

* gradientTexture (use a PNG instead of default green to red)
* alphaRange (show transparency)

See the [example](http://ursudio.com/webgl-heatmap-leaflet/)

***
Usage
===

Set up your map
---

```
var baseURL = 'http://{s}.tile.cloudmade.com/{API}/{map_style}/256/{z}/{x}/{y}.png';
var base = L.tileLayer(baseURL, { 
	API: your-api, 
	map_style: '44094' 
});
var map = L.map('map', {layers: [base]}).setView(your-lng-lat, your-zoom-level);
```

Initialize Heatmap
---    
```
var heatmap = new L.TileLayer.WebGLHeatMap({
         size: diameter-in-meters
});
```

Add Data
---
You should have an array of arrays in format: `[[lat, lng, intensity]...]`

```
var dataPoints = [[44.6674, -63.5703, 37], [44.6826, -63.7552, 34], [44.6325, -63.5852, 41], [44.6467, -63.4696, 67], [44.6804, -63.487, 64], [44.6622, -63.5364, 40], [44.603, - 63.743, 52]];
```

With this you can add the whole dataset with `heatmap.setData(dataPoints)`.

Alternatively, you could add an array of arrays in format: `[[lat, lng]...]` with a for loop that sets the intensity of each point to a single value (recommended):

```
var intensity = 50;
for (var i = 0, len = dataPoints.length; i < len; i++) {
	var point = dataPoints[i];
	heatmap.addDataPoint(point[0],
		 point[1],
      		 intensity);
}
```

Add heatmap to map
---

```
map.addLayer(heatmap);
```

Options
===
* size (in meters)
* opacity (for the canvas element)
* gradientTexture (url to gradient PNG)
* alphaRange (adjust transparency by changing to value between 0 and 1)

License
===
* MIT: see mit-license
