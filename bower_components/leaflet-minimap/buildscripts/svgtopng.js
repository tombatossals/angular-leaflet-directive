var svg2png = require('svg2png');
var ncp = require('ncp');
var path = require('path');

svg2png(path.resolve('src/images/toggle.svg'), path.resolve('src/images/toggle.png'), 1.0, function (err) {
	ncp('src/images/toggle.png', 'dist/images/toggle.png');
});
