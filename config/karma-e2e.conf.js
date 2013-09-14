module.exports = function(karma) {
    karma.set({
        basePath:   '../',
        urlRoot:    '/_karma_/',
        files:      ['test/e2e/**/*.js'],
        frameworks: ["ng-scenario"],
        autoWatch:  false,
        browsers:   ['PhantomJS'],
        //browsers:   ['Chrome'],
        singleRun:  true,
        runnerPort: 9999,
        logLevel:   karma.LOG_INFO,
        proxies:    {'/': 'http://localhost:8000/'},
        junitReporter: {
            outputFile: 'test_out/e2e.xml',
            suite: 'e2e'
        }
    });
}
