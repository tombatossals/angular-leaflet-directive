'use strict';

var concatDist, concatDistMapped = null;

concatDist = {
    options: {
        banner: require('./utils/banner') + "(function(angular){\n" + "'use strict';\n",
        footer: '\n}(angular));'
    },
    src: [
        'src/directives/leaflet.js',
        'src/services/*.js',
        'src/**/*.js'

    ],
    dest: 'dist/angular-leaflet-directive.pre.js'
};

concatDistMapped = _.clone(concatDist, true);
concatDistMapped.options.sourceMap = true;
concatDistMapped.options.sourceMapName = "dist/<%= pkg.name %>_dev_mapped.js.map";
concatDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.js";



module.exports = function(grunt, options) {
    return {
        dist: concatDist,
        distMapped: concatDistMapped,
        license: {
            src: [
                'src/header-MIT-license.txt',
                'dist/angular-leaflet-directive.min.no-header.js'
            ],
            dest: 'dist/angular-leaflet-directive.min.js'
        },
        examples: {
            options: {
                banner: '(function(angular){ \nvar app = angular.module(\'webapp\');\n',
                footer: '}(angular));'
            },
            src: ['examples/js/controllers/*.js'],
            dest: 'examples/js/controllers.js'
        }
    };
};
