module.exports = function(grunt) {

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
                    module: true,
                    L: true,
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'uglify']);

};
