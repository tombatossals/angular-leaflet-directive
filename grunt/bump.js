'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: [],
            commit: true,
            commitMessage: 'Release v%VERSION%',
            commitFiles: [
                'package.json',
                'bower.json',
                'dist/angular-leaflet-directive.js',
                'dist/angular-leaflet-directive.min.js',
                'dist/angular-leaflet-directive_dev_mapped.js',
                'dist/angular-leaflet-directive_dev_mapped.js.map'
            ],
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: true,
            pushTo: 'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
        }
    };
};
