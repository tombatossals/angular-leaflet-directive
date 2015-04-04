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
            tasks: ['karma:unit', 'watch:unit'],
            options: {
                logConcurrentOutput: true
            }
        },
        'unit-mocha': {
            tasks: ['karma:unit-mocha', 'watch:unit-mocha'],
=======
            tasks: ['karma:unit-mocha', 'watch:chrome'],
>>>>>>> ability to disable watches in markers 100%
            options: {
                logConcurrentOutput: true
            }
        }
    }
};
