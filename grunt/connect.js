'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            base: ''
        },
        webserver: {
            options: {
                port: 8888,
                keepalive: true
            }
        },
        devserver: {
            options: {
                port: 8888
            }
        },
        testserver: {
            options: {
                port: 9999
            }
        },
        coverage: {
            options: {
                base: 'coverage/',
                directory: 'coverage/',
                port: 5555,
                keepalive: true
            }
        }
    };
};
