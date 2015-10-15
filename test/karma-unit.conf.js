module.exports = function(karma) {
    karma.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../',

        preprocessors: {
            'test/**/**/*.coffee': ['coffee']
        },
        coffeePreprocessor: {
            options: {
                bare: true,
                sourceMap: false
            },
            transformPath: function(path) {
                return path.replace(/\.js$/, '.coffee');
            }
        },
        // list of files / patterns to load in the browser
        files: [
            'bower_components/leaflet/dist/leaflet-src.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-simple-logger/dist/angular-simple-logger.js',//THIS IS BROWSER version
            'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
            'bower_components/leaflet.vector-markers/dist/Leaflet.vector-markers.js',
            'dist/angular-leaflet-directive_dev_mapped.js',
            'test/unit/bootstrap.coffee',
            'test/unit/*.js',
            'test/unit/**/*.js',
            'test/unit/**/*.coffee',
            'bower_components/Leaflet.PolylineDecorator/leaflet.polylineDecorator.js',
            //do not include those specs for jasmine html runner by karma kama_jasmine_runner.html
            {pattern:'**/**/**/*.coffee', included: false},
            {pattern: '**/*.js.map', included: false}
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
            'PhantomJS'
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
        autoWatch: false,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
