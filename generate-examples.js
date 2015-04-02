#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var jsdom = require('jsdom').jsdom;
var EXAMPLES_DIRECTORY = path.join(__dirname, 'examples-reworked');

var isAnExample = function(filename) {
    return filename.match(/[0-9][0-9][0-9][0-9].*\.html/) !== null;
};

var isJavascript = function(filename) {
    return filename.match(/.*\.js/) !== null;
};

var cleanJavascriptFilesFromControllersDirectory = function(dir) {
    fs.readdir(dir, function(err, list) {
        list.forEach(function(filename) {
            if (isJavascript(filename)) {
                fs.unlink(filename);
            }
        });
    })
};

fs.readdir(EXAMPLES_DIRECTORY, function(err, list) {
    list.forEach(function(filename) {
        if (isAnExample(filename)) {
            var html = fs.readFileSync(path.join(__dirname, 'examples-reworked', filename));
            var document = jsdom(html.toString());
            var scripts = document.getElementsByTagName('script');
            var last = scripts.length -1;
            var script = scripts[last].innerHTML;

            console.log(script.split('\n'));
        }
    });
});

var controllers_directory = path.join(__dirname, 'examples-reworked', js, controllers);

mkdirp(controllers_directory, function(err) {
    cleanJavascriptFilesFromControllersDirectory(controllers_directory);
})
