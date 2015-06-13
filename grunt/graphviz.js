'use strict';

//notice this depends on graphviz being installed
//brew install graphviz
module.exports = function (grunt, options) {
    return {
        library: {
            files:{
                'dist/angular-leaflet-directive.png':'dist/angular-leaflet-directive.dot'
            }
        }
    };
};
