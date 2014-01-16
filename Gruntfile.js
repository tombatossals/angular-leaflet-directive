module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: 'node_modules/protractor/bin/webdriver-manager start',
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_update: {
                command: 'node_modules/protractor/bin/webdriver-manager update'
            },
            npm_install: {
                command: 'npm install'
            }
        },

        changelog: {},

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        connect: {
            options: {
                base: ''
            },
            webserver: {
                options: {
                    port: 8888,
                    keepalive: true
                }
            },
            devserver: {
                options: {
                    port: 8888
                }
            },
            testserver: {
                options: {
                    port: 9999
                }
            },
            coverage: {
                options: {
                    base: 'coverage/',
                    directory: 'coverage/',
                    port: 5555,
                    keepalive: true
                }
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                configFile: 'test/protractor.conf.js',
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
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.no-header.js': ['dist/angular-leaflet-directive.ngmin.js']
                }
            }
        },

        ngmin: {
            directives: {
                expand: true,
                cwd: 'dist',
                src: ['angular-leaflet-directive.js'],
                dest: 'dist',
                ext: '.ngmin.js',
                flatten: 'src/'
            }
        },

        jshint: {
            options: {
                node: true,
                browser: true,
                esnext: true,
                bitwise: true,
                curly: true,
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
                src: ['test/unit/*.js', 'test/e2e/*.js'],
            },
            grunt: {
                src: ['Gruntfile.js']
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_coverage: {
                configFile: 'test/karma-unit.conf.js',
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
        },

        coveralls: {
            options: {
                debug: true,
                coverage_dir: 'coverage'
            }
        },

        watch: {
            options : {
                livereload: 7777
            },
            source: {
                files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
                tasks: [
                    'jshint',
                    'concat:dist',
                    'ngmin',
                    'uglify',
                    'test:unit',
                    'concat:license'
                ]
            }
        },

        open: {
            devserver: {
                path: 'http://localhost:8888'
            },
            coverage: {
                path: 'http://localhost:5555'
            }
        },

        bower: {
            install: {
              //  options: {
              //      targetDir: './bower_components',
              //      cleanup: true
              //  }
            }
        },

        concat: {
            dist: {
                options: {
                    banner: '(function() {\n\n"use strict";\n\n',
                    footer: '\n}());'
                },
                src: [
                    'src/directives/leaflet.js',
                    'src/directives/center.js',
                    'src/directives/tiles.js',
                    'src/directives/legend.js',
                    'src/directives/geojson.js',
                    'src/directives/layers.js',
                    'src/directives/bounds.js',
                    'src/directives/markers.js',
                    'src/directives/paths.js',
                    'src/directives/controls.js',
                    'src/directives/eventBroadcast.js',
                    'src/directives/maxbounds.js',
                    'src/services/leafletData.js',
                    'src/services/leafletMapDefaults.js',
                    'src/services/leafletEvents.js',
                    'src/services/leafletLayerHelpers.js',
                    'src/services/leafletPathsHelpers.js',
                    'src/services/leafletBoundsHelpers.js',
                    'src/services/leafletMarkersHelpers.js',
                    'src/services/leafletHelpers.js'
                ],
                dest: 'dist/angular-leaflet-directive.js',
            },
            license: {
                src: [
                    'src/header-MIT-license.txt',
                    'dist/angular-leaflet-directive.min.no-header.js'
                ],
                dest: 'dist/angular-leaflet-directive.min.js',
            },
        }
    });

    //single run tests
    grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:e2e', ['shell:protractor_update', 'connect:testserver', 'protractor:run']);
    grunt.registerTask('test:e2e-firefox', ['shell:protractor_update', 'connect:testserver', 'protractor:firefox']);

    //coverage testing
    grunt.registerTask('test:coverage', ['karma:unit_coverage']);
    grunt.registerTask('coverage', ['karma:unit_coverage', 'open:coverage', 'connect:coverage']);

    //installation-related
    grunt.registerTask('install', ['shell:npm_install', 'bower:install', 'shell:protractor_update']);

    //defaults
    grunt.registerTask('default', ['watch:source']);

    //development
    grunt.registerTask('dev', ['connect:devserver', 'open:devserver', 'watch:source']);

    //server daemon
    grunt.registerTask('serve', ['connect:webserver']);

    //travis
    grunt.registerTask('travis', ['bower:install', 'test:unit', 'karma:unit_coverage', 'coveralls', 'shell:protractor_update', 'protractor:saucelabs']);
};
