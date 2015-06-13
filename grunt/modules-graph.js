'use strict';

module.exports = function (grunt, options) {
    return {
        options:{
            externalDependenciesColor:'red'
        },
        library:{
            files:{
                'dist/angular-leaflet-directive.dot': ['src/**/*.js']
            }
        }
    };
};
