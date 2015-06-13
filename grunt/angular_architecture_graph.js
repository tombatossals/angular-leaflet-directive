'use strict';

module.exports = function (grunt, options) {
    return {
        diagram: {
            files: {
                    "dist/architecture": ["dist/<%= pkg.name %>.js"]
            }
        }
    };
};
