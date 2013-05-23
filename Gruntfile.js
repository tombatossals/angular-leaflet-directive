module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/angular-leaflet-directive.js']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'test/unit/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
                autoWatch: true
            }
        }
    });

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'uglify']);

};
