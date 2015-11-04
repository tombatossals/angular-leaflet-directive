module.exports = function (grunt) {

    require('load-grunt-config')(grunt);
    grunt.config('pkg', grunt.file.readJSON('package.json'));
    
};
