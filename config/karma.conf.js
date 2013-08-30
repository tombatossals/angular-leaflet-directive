module.exports = function(karma) {
    karma.set({
        // base path, that will be used to resolve files and exclude
        basePath: '..',

        // list of files / patterns to load in the browser
        files: [
            'test/lib/leaflet.js',
            'test/lib/angular/angular.js',
            'test/lib/angular/angular-mocks.js',
            'test/lib/markercluster/leaflet.markercluster.js',
            'src/angular-leaflet-directive.js',
            'test/unit/**/*.js'
        ],

        // Frameworks
        frameworks: ["jasmine"],

        // list of files to exclude
        exclude: [
        ],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari
        // - PhantomJS
        browsers: [
            'Firefox'
            //'Chrome'
            //'PhantomJS'
        ],

        // test results reporter to use
        // possible values: dots || progress
        reporters: ['progress'],

        // web server port
        port: 9018,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: karma.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
