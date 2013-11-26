module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: './selenium/start',
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/install_selenium_standalone'
            },
            npm_install: {
                command: 'npm install'
            }
        },

        connect: {
            options: {
                base: 'app/'
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
                    port: 5555,
                    keepalive: true
                }
            }
        },

        protractor: {
            options: {
                keepAlive: true,
                configFile: "./test/protractor.conf.js"
            },
            singlerun: {},
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
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

        jshint: {
            options: {
                jquery: true,
                smarttabs: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                unused: false,
                browser: true,
                globals: {
                    angular: true,
                    console: true,
                    module: true,
                    L: true,
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
                configFile: 'config/karma.conf.js',
                background: false
            },
            background: {
                configFile: 'config/karma.conf.js',
                background: true,
                autoWatch: false,
                singleRun: false,
                browsers: ['PhantomJS']
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

        watch: {
            options : {
                livereload: 7777
            },
            assets: {
                files: ['app/styles/**/*.css','app/scripts/**/*.js'],
                tasks: ['concat']
            },
            protractor: {
                files: ['app/scripts/**/*.js','test/e2e/**/*.js'],
                tasks: ['protractor:auto']
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

        watch: {
            source: {
                files: [
                        'src/**/*.js',
                        'test/unit/*.js',
                        'test/e2e/*.js'
                       ],
                tasks: [
                        'jshint',
                        'concat:dist',
                        'ngmin',
                        'uglify',
                        'karma:background:run',
                        'concat:license'
                       ]
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:grunt']
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '(function() {\n\n"use strict";\n\n',
                    footer: '\n}());'
                },
                src: [
                      'src/modules/Scope.SafeApply.js',
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
                      'src/directives/maxBounds.js',
                      'src/services/leafletData.js',
                      'src/services/leafletMapDefaults.js',
                      'src/services/leafletEvents.js',
                      'src/services/leafletLayerHelpers.js',
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
            }
        }
    });

    //single run tests
    grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

    //autotest and watch tests
    grunt.registerTask('autotest', ['karma:unit_auto']);
    grunt.registerTask('autotest:unit', ['karma:unit_auto']);
    grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

    //coverage testing
    grunt.registerTask('test:coverage', ['karma:unit_coverage']);
    grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

    //installation-related
    grunt.registerTask('install', ['update','shell:protractor_install']);
    grunt.registerTask('update', ['shell:npm_install', 'concat']);

    //defaults
    grunt.registerTask('default', ['dev']);

    //development
    grunt.registerTask('dev', ['update', 'connect:devserver', 'open:devserver', 'watch:assets']);

    //server daemon
    grunt.registerTask('serve', ['connect:webserver']);

};
