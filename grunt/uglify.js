'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
            files: {
                'dist/<%= pkg.name %>.min.no-header.js': ['dist/angular-leaflet-directive.js']
            }
        }
    };
};
