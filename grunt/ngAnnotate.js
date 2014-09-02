 'use strict';

 module.exports = function ngAnnotate(grunt, options) {
     return {
         options: {},
         dist: {
             files: {
                 'dist/angular-leaflet-directive.js': [ 'dist/angular-leaflet-directive.pre.js' ]
             }
         }
     };
};
