# Esri Leaflet Heatmap Feature Layer

[![Build Status](https://travis-ci.org/Esri/esri-leaflet-heatmap-feature-layer.svg)](https://travis-ci.org/Esri/esri-leaflet-heatmap-feature-layer)

A plugin for Esri Leaflet that enables visualization of Feature Services as heatmaps using the [L.heat](https://github.com/Leaflet/Leaflet.heat) Leaflet Plugin.

### Demos
A live demo is available on the [Esri Leaflet website](http://esri.github.io/esri-leaflet/examples/visualize-points-as-a-heatmap.html).

### Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

<a href="http://esri.github.io/esri-leaflet/examples/visualize-points-as-a-heatmap.html">
  <img src="https://github.com/Esri/esri-leaflet-heatmap-feature-layer/raw/master/esri-leaflet-heatmap-feature-layer.jpg" alt="Demo">
</a>

```html
<html>
<head>
  <meta charset=utf-8 />
  <title>Points as a heatmap</title>
  <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

  <!-- Load Leaflet from CDN-->
  <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
  <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

  <!-- Include Leaflet.heat via rawgit.com, do not use in production -->
  <script src="https://rawgit.com/Leaflet/Leaflet.heat/gh-pages/dist/leaflet-heat.js"></script>

  <!-- Load Esri Leaflet from CDN -->
  <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.6/esri-leaflet.js"></script>

  <!-- Load Heatmap Feature Layer from CDN -->
  <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-heatmap-feature-layer/0.0.1-beta.1/esri-leaflet-heatmap-feature-layer.js"></script>

  <style>
    body {margin:0;padding:0;}
    #map {position: absolute;top:0;bottom:0;right:0;left:0;}
  </style>
</head>
<body>

<div id="map"></div>

<script>
  var map = L.map('map').setView([ 40.706, -73.926], 14);

  L.esri.basemapLayer('Gray').addTo(map);
  L.esri.heatmapFeatureLayer({
    url: 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Graffiti_Reports/FeatureServer/0',
    radius: 12
  }).addTo(map);
</script>

</body>
</html>
```

### Documentation & Examples

A full [API Reference](http://esri.github.io/esri-leaflet/api-reference/) and plenty of [sample code](http://esri.github.io/esri-leaflet/examples/) can be found at the [Esri Leaflet](http://esri.github.io/esri-leaflet/) website.

### Development Roadmap

If you are interested in contributing to Esri Leaflet or are interetsed in seeing what is coming up next checkout the [development roadmap](https://github.com/Esri/esri-leaflet/wiki/Roadmap).

### Development Instructions

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone this repo](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
3. Install the dependencies with `npm install`
4. run `grunt` from the command line. This will start watching the source files and running linting and testing commands.
5. Open `debug/sample.html` which will load up a development environment.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Dependencies

* [Leaflet](http://leaflet.com) version 0.7 or higher is required and the latest version is recommended.
* [Esri Leaflet](http://esri.github.io/esri-leaflet/) beta 5 or or higher is required but the latest version is recommended.
* [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) version 0.1.1 is required.

### Resources

* [Importing Data Into Feature Services](https://developers.arcgis.com/tools/csv-to-feature-service/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [@Esri](http://twitter.com/esri)
* [@EsriPDX](http://twitter.com/esripdx)

### Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/Esri/esri-leaflet-heatmap-feature-layer/issues).

Please take a look at [previous issues on Esri Leaflet](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) and [previous issues on Esri Leaflet Heatmap Feature Layer](https://github.com/Esri/esri-leaflet-heatmap-feature-layer/issues?labels=FAQ&milestone=&page=1&state=closed)that resolve common problems.

You can also post issues on the [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) an/or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet-heatmap-feature-layer/blob/master/CONTRIBUTING.md).

### Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet Heatmap)
[](Esri Language: JavaScript)
