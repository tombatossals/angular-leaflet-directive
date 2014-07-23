'use strict';

module.exports = function (grunt, options) {
    return {
        options : {
            livereload: 7777
        },
        source: {
            files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
            tasks: [
                'jshint',
                'concat:dist',
                'ngmin',
                'uglify',
                'test-unit',
                'concat:license'
            ]
        }
    };
};
