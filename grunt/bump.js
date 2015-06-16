'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: [],
            commit: true,
            commitMessage: 'Release v%VERSION%',
            commitFiles: [
                'CHANGELOG.md',
                'package.json',
                'bower.json',
                'dist/angular-leaflet-directive.js',
                'dist/angular-leaflet-directive.min.js',
                'dist/angular-leaflet-directive_dev_mapped.js',
                'dist/angular-leaflet-directive_dev_mapped.js.map',
                'dist/architecture/**/*'
            ],
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: false,
            pushTo: 'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
        }
    };
};
