'use strict';

module.exports = function (grunt, options) {
    return {
        watchServe: {
            tasks: ['watch:fast', 'connect:webserver'],
            options: {
                logConcurrentOutput: true
            }
        },
        chrome: {
            tasks: ['karma:unit-chrome', 'watch:chrome'],
            options: {
                logConcurrentOutput: true
            }
        },
        unit: {
            tasks: ['karma:unit', 'watch:unit'],
            options: {
                logConcurrentOutput: true
            }
        },
        'unit-mocha': {
            tasks: ['karma:unit-mocha', 'watch:unit-mocha'],
            options: {
                logConcurrentOutput: true
            }
        }
    }
};
