'use strict';

module.exports = function (grunt, options) {
    return {
        watchServe: {
            tasks: ['watch:fast', 'connect:webserver'],
            options: {
                logConcurrentOutput: true
            }
        },
        spec: {
            tasks: ['karma:unit-chrome', 'watch:chrome'],
            options: {
                logConcurrentOutput: true
            }
        },
        unit: {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> - geojson nested working
            tasks: ['karma:unit', 'watch:unit'],
            options: {
                logConcurrentOutput: true
            }
        },
        'unit-mocha': {
            tasks: ['karma:unit-mocha', 'watch:unit-mocha'],
<<<<<<< HEAD
=======
            tasks: ['karma:unit-mocha', 'watch:chrome'],
>>>>>>> ability to disable watches in markers 100%
=======
>>>>>>> - geojson nested working
            options: {
                logConcurrentOutput: true
            }
        }
    }
};
