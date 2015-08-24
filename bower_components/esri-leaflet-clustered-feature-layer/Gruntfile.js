var fs = require('fs');

module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  var copyright = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
                  '*   Copyright (c) <%= grunt.template.today(\'yyyy\') %> Environmental Systems Research Institute, Inc.\n' +
                  '*   Apache License' +
                  '*/\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: [
          'src/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'spec/**/*.js'
        ],
        tasks: ['test'],
        options: {
          spawn: false
        }
      }
    },

    concat: {
      options: {
        sourceMap: true,
        separator: '\n',
        banner: copyright,
      },
      cluster: {
        src: [
          'src/ClusteredFeatureLayer.js'
        ],
        dest: 'dist/esri-leaflet-clustered-feature-layer-src.js'
      },
    },

    uglify: {
      options: {
        sourceMap: true,
        wrap: false,
        mangle: {
          except: ['L']
        },
        preserveComments: 'some',
        report: 'gzip',
        banner: copyright
      },
      dist: {
        files: {
          'dist/esri-leaflet-clustered-feature-layer.js': [
            'src/ClusteredFeatureLayer.js'
          ],
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['progress'],
        browsers: browsers
      },
      coverage: {
        reporters: ['progress', 'coverage'],
        browsers: browsers,
        preprocessors: {
          'src/**/*.js': 'coverage'
        }
      },
      watch: {
        singleRun: false,
        autoWatch: true,
        browsers: browsers
      }
    },

    releaseable: {
      release: {
        options: {
          build: 'npm run prepublish',
          remote: 'upstream',
          dryRun: grunt.option('dryRun') ? grunt.option('dryRun') : false,
          silent: false
        },
        src: ['dist/**/*.js', 'dist/**/*.map']
      }
    }
  });

  // Development Tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['jshint', 'karma:coverage', 'concat', 'uglify']);
  grunt.registerTask('test', ['jshint', 'karma:run']);
  grunt.registerTask('prepublish', ['concat', 'uglify']);
  grunt.registerTask('release', ['releaseable']);

  // Require all grunt modules
  require('load-grunt-tasks')(grunt);

};
