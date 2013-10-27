module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                src: ['dist/angular-leaflet-directive.js']
            },
            tests: {
                src: ['test/unit/*.js', 'test/e2e/*.js'],
            },
            grunt: {
                src: ['Gruntfile.js']
            }
        },
        connect: {
            options: {
                port: 8000,
                base: './'
            },
            server: {
                options: {
                    keepalive: true
                }
            },
            testserver: {}
        },
        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
            },
            e2e: {
                configFile: 'config/karma-e2e.conf.js'
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
            source: {
                files: [
                        'src/**/*.js',
                        'test/unit/*.js',
                        'test/e2e/*.js'
                       ],
                tasks: [
                        'karma:background:run',
                        'concat:dist',
                        'jshint',
                        'ngmin',
                        'uglify',
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
                      'src/main.js',
                      'src/directives/leaflet.js',
                      'src/directives/center.js',
                      'src/directives/tiles.js',
                      'src/directives/legend.js',
                      'src/directives/geojson.js',
                      'src/directives/layers.js',
                      'src/directives/bounds.js',
                      'src/directives/marker.js',
                      'src/directives/markers.js',
                      'src/directives/paths.js',
                      'src/directives/eventBroadcast.js',
                      'src/directives/maxBounds.js',
                      'src/services/leafletData.js'
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
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');

    grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
    grunt.registerTask('test', ['karma:unit', 'test:e2e']);
    grunt.registerTask('server', ['connect:server']);
    grunt.registerTask('default', ['karma:background', 'watch']);

};
