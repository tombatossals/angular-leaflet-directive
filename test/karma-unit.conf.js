module.exports = function(karma) {
  karma.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // list of files / patterns to load in the browser
    files: [
        'bower_components/leaflet/dist/leaflet-src.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
        'bower_components/leaflet.vector-markers/dist/Leaflet.vector-markers.js',
        'bower_components/Leaflet.PolylineDecorator/leaflet.polylineDecorator.js',
        'dist/angular-leaflet-directive.js',
        'test/unit/*.js',
        'test/unit/**/marker*.js',
    ],

    // Frameworks
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [
    ],

    browsers: [
        'PhantomJS',
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
    singleRun: true,
  });
};
