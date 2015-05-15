'use strict';

module.exports = function (grunt, options) {
    var pkgFunction = function(){
        return grunt.file.readJSON('package.json')
    };
    //THIS extension forces the banner or whatever uses pkgFunction to always get the latest version
    //where as pkg is only done once at grunt init.
    _.extend(options, {
        pkgFunction: pkgFunction
    });
    return pkgFunction();
};
