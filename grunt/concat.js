'use strict';

var concatDist, concatDistMapped = null;

concatDist = {
    options: {
        banner: require('./utils/banner') + "(function(angular){\n" + "'use strict';\n",
        footer: '\n}(angular));'
    },
    src: [
        'src/directives/leaflet.js',
        'src/directives/center.js',
        'src/directives/tiles.js',
        'src/directives/legend.js',
        'src/directives/geojson.js',
        'src/directives/layers.js',
        'src/directives/bounds.js',
        'src/directives/markers.js',
        'src/directives/paths.js',
        'src/directives/controls.js',
        'src/directives/eventBroadcast.js',
        'src/directives/maxbounds.js',
        'src/directives/decorations.js',
        'src/directives/layercontrol.js',
        'src/services/leafletData.js',
        'src/services/leafletMapDefaults.js',
        'src/services/leafletEvents.js',
        'src/services/leafletLayerHelpers.js',
        'src/services/leafletControlHelpers.js',
        'src/services/leafletLegendHelpers.js',
        'src/services/leafletPathsHelpers.js',
        'src/services/leafletBoundsHelpers.js',
        'src/services/leafletMarkersHelpers.js',
        'src/services/leafletHelpers.js'
    ],
    dest: 'dist/angular-leaflet-directive.pre.js'
};

concatDistMapped = _.clone(concatDist,true);
concatDistMapped.options = _.extend(_.clone(concatDist.options,true), {
    sourceMap: true,
    sourceMapName: "dist/<%= pkg.name %>_dev_mapped.js.map"
});
concatDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.js";



module.exports = function (grunt, options) {
    return {
        dist: concatDist,
        distMapped: concatDistMapped,
        license: {
            src: [
                'src/header-MIT-license.txt',
                'dist/angular-leaflet-directive.min.no-header.js'
            ],
            dest: 'dist/angular-leaflet-directive.min.js'
        }
    };
};
