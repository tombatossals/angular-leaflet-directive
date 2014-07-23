'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            keepAlive: false,
            configFile: 'test/protractor.conf.js',
            args: {
                specs: [ 'test/e2e/*.js' ],
            }
        },
        run: {},
        saucelabs: {
            options: {
                args: {
                    baseUrl: "http://tombatossals.github.io/angular-leaflet-directive/examples/",
                    sauceUser: process.env.SAUCE_USERNAME,
                    sauceKey: process.env.SAUCE_ACCESS_KEY
                }
            }
        }
    };
};
