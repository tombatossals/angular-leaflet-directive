module.exports = function(configFileName, name){
    configFileName = configFileName? configFileName : 'test/karma-unit.conf.js';
    name = name? name : '';

    var testObj = {
        unit: {
            configFile: configFileName,
                autoWatch: false,
                singleRun: true
        },
        unit_coverage: {
            configFile: configFileName,
                autoWatch: false,
                singleRun: true,
                //logLevel: 'DEBUG',
                reporters: ['progress', 'coverage'],
                preprocessors: {
                'dist/angular-leaflet-directive.js': ['coverage']
            },
            coverageReporter: {
                type : 'lcov',
                    dir : 'coverage/'
            }
        }
    };
    if(name){
        _.each(testObj,function(val, key){
            testObj[key + '-' + name] = val;
            delete testObj[key];
        });
    }
    return testObj;
};
