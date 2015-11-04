'use strict';

module.exports = function (grunt, options) {
    return {
        devserver: {
            path: 'http://localhost:8888'
        },
        coverage: {
            path: 'http://localhost:5555'
        }
    };
};
