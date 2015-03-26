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
        }

    }
};
