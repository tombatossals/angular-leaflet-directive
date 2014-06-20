'use strict';

module.exports = function (grunt, options) {
    return {
        directives: {
            expand: true,
            cwd: 'dist',
            src: ['angular-leaflet-directive.pre.js'],
            dest: 'dist',
            ext: '.js',
            flatten: 'src/'
        }
    };
};
