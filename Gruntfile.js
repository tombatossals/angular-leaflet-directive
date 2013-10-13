module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'js/<%= pkg.name %>.min.js': ['js/angular-leaflet-directive-webpage.ngmin.js']
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
                    app: true,
                    angular: true,
                    module: true,
                    L: true,
                }
            },
            source: {
                src: ['src/app.js', 'src/controllers/*.js']
            },
            grunt: {
                src: ['Gruntfile.js']
            }
        },
        ngmin: {
            directives: {
                expand: true,
                cwd: 'js',
                src: ['angular-leaflet-directive-webpage.js'],
                dest: 'js',
                ext: '.ngmin.js',
                flatten: 'js/'
            }
        },
        concat: {
            options: {
                //separator: ';',
                banner: '(function (angular) {\n',
                footer: '})(window.angular);'
            },
            dist: {
                src: ['src/app.js', 'src/controllers/*.js'],
                dest: 'js/angular-leaflet-directive-webpage.js',
            }
        },

        watch: {
            source: {
                files: ['src/app.js', 'src/controllers/*.js'],
                tasks: ['jshint', 'concat', 'ngmin', 'uglify']
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:grunt']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');

    grunt.registerTask('default', ['watch']);

};
