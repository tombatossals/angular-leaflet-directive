Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

Please take a look at [previous issues on Esri Leaflet](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) and [previous issues on Esri Leaflet Clustered Feature Layer](https://github.com/Esri/esri-leaflet-heatmap-feature-layer/issues?labels=FAQ&milestone=&page=1&state=closed)that resolve common problems.

You can also post issues on the [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) an/or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

### I want to contribute, what should I work on?

There is a lot of room for contributions to Esri Leaflet. Make sure you checkout the [development instructions](https://github.com/Esri/esri-leaflet-heatmap-feature-layer#development-instructions) in the readme to help you get started.

### Setting up a dev environment

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone Esri Leaflet Clustered Feature Layer](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet-heatmap-feature-layer` folder
5. Install the dependencies with `npm install`
5. run `grunt` from the command line. This will start watching the source files and running linting and testing commands.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Linting

Please make sure your changes pass JS Hint. This will help make sure code is consistant throguh out Esri Leaflet. You can run JS Hint with `grunt jshint`.

### Testing

Please make sure your changes dont break existing tests. Testing is essential for determining backward compatibility and catching breaking changes. You can run tests with `grunt karma:run`, `grunt karma:watch` or `grunt karma:coverage.`