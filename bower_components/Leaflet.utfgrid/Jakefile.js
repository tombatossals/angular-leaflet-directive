var build = require('./build/build.js'),
    lint = require('./build/hint.js');

var COPYRIGHT = '/*\n Copyright (c) 2012, Smartrak, David Leaver\n' +
                ' Leaflet.utfgrid is an open-source JavaScript library that provides utfgrid interaction on leaflet powered maps.\n' + 
                ' https://github.com/danzel/Leaflet.utfgrid\n*/\n';

desc('Check Leaflet.utfgrid source for errors with JSHint');
task('lint', function () {

	var files = build.getFiles();

	console.log('Checking for JS errors...');

	var errorsFound = lint.jshint(files);

	if (errorsFound > 0) {
		console.log(errorsFound + ' error(s) found.\n');
		fail();
	} else {
		console.log('\tCheck passed');
	}
});

desc('Combine and compress Leaflet.utfgrid source files');
task('build', ['lint'], function (compsBase32, buildName) {

	var files = build.getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');

	var content = build.combineFiles(files),
	    newSrc = COPYRIGHT + content,

	    pathPart = 'dist/leaflet.utfgrid' + (buildName ? '-' + buildName : ''),
	    srcPath = pathPart + '-src.js',

	    oldSrc = build.load(srcPath),
	    srcDelta = build.getSizeDelta(newSrc, oldSrc);

	console.log('\tUncompressed size: ' + newSrc.length + ' bytes (' + srcDelta + ')');

	if (newSrc === oldSrc) {
		console.log('\tNo changes');
	} else {
		build.save(srcPath, newSrc);
		console.log('\tSaved to ' + srcPath);
	}

	console.log('Compressing...');

	var path = pathPart + '.js',
	    oldCompressed = build.load(path),
	    newCompressed = COPYRIGHT + build.uglify(content),
	    delta = build.getSizeDelta(newCompressed, oldCompressed);

	console.log('\tCompressed size: ' + newCompressed.length + ' bytes (' + delta + ')');

	if (newCompressed === oldCompressed) {
		console.log('\tNo changes');
	} else {
		build.save(path, newCompressed);
		console.log('\tSaved to ' + path);
	}
});

task('default', ['build']);
