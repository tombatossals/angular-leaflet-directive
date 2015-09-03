'use strict';
var fs =  require('fs');

module.exports = function (grunt, options) {
    return {
        options: JSON.parse(fs.readFileSync('.jshintrc')),
        source: {
            src: ['src/directives/*.js', 'src/services/*.js']
        },
        tests: {
            src: ['test/unit/*.js', 'test/e2e/*.js']
        },
        grunt: {
            src: ['Gruntfile.js']
        }
    };
};
