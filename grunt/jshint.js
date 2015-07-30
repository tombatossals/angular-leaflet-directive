'use strict';

module.exports = function (grunt, options) {
    return {
        options: {
            node: true,
            browser: true,
            esnext: true,
            bitwise: true,
            curly: false,
            eqeqeq: true,
            immed: true,
            indent: 4,
            latedef: true,
            newcap: true,
            noarg: true,
            regexp: true,
            undef: true,
            unused: true,
            trailing: true,
            smarttabs: true,
            globals: {
                angular: false,
                L: false,
                lvector: false,
                cartodb: false,
                // Jasmine
                jasmine    : false,
                isCommonJS : false,
                exports    : false,
                spyOn      : false,
                it         : false,
                xit        : false,
                expect     : false,
                runs       : false,
                waits      : false,
                waitsFor   : false,
                beforeEach : false,
                afterEach  : false,
                describe   : false,
                xdescribe   : false,

                // Protractor
                protractor: false,
                browser: false,
                by: false,
                element: false
            }
        },
        source: {
            src: ['src/directives/*.js', 'src/services/*.js']
        },
        tests: {
            src: ['test/unit/*.js', 'test/e2e/*.js']
        },
        grunt: {
            src: ['Gruntfile.js']
        }
    };
};
